"""
Push scraped jobs to Supabase.
Handles deduplication via title+company hash and incremental skill counting.
"""
import hashlib
from datetime import date, datetime
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY


def parse_date(date_str):
    """Try multiple date formats and return ISO string or None."""
    if not date_str:
        return None
    # Handle Unix timestamps (int or float)
    if isinstance(date_str, (int, float)):
        try:
            return datetime.fromtimestamp(date_str).strftime('%Y-%m-%d')
        except (OSError, ValueError):
            return None
    # Ensure it's a string
    date_str = str(date_str).strip()
    if not date_str:
        return None
    # If it looks like a Unix timestamp string
    if date_str.isdigit() and len(date_str) >= 10:
        try:
            return datetime.fromtimestamp(int(date_str)).strftime('%Y-%m-%d')
        except (OSError, ValueError):
            return None
    # If already a clean ISO date
    if len(date_str) >= 10 and date_str[4:5] == '-':
        # Try common formats
        pass
    for fmt in [
        '%Y-%m-%dT%H:%M:%S',
        '%Y-%m-%dT%H:%M:%S.%f',
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y-%m-%dT%H:%M:%S%z',
        '%Y-%m-%dT%H:%M:%S.%f%z',
        '%a, %d %b %Y %H:%M:%S %z',
        '%a, %d %b %Y %H:%M:%S %Z',
        '%Y-%m-%d %H:%M:%S',
        '%Y-%m-%d',
        '%d %b %Y',
        '%B %d, %Y',
    ]:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            continue
    # Last resort: try to extract a date-like pattern
    import re
    match = re.search(r'(\d{4}-\d{2}-\d{2})', date_str)
    if match:
        return match.group(1)
    return None


def get_client():
    """Create and return a Supabase client."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError('Supabase credentials not found. Check .env file.')
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def job_hash(title, company, location=''):
    """Create a unique hash for deduplication."""
    raw = f"{title.strip().lower()}|{company.strip().lower()}|{location.strip().lower()}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def push_jobs(jobs, dry_run=False):
    """
    Push a list of processed jobs to Supabase.

    Each job dict should have:
      title, company, platform, location, job_type, domain,
      description, apply_url, posted_at, skills (list of strings)

    Returns (inserted_count, skipped_count)
    """
    if dry_run:
        print(f'  [DRY RUN] Would push {len(jobs)} jobs')
        return len(jobs), 0

    client = get_client()
    inserted = 0
    skipped = 0

    # Get existing skill IDs
    skill_cache = _get_or_create_skills(client, jobs)

    for job in jobs:
        h = job_hash(job['title'], job['company'], job.get('location', ''))

        # Check if job already exists
        existing = client.table('jobs').select('id').eq('hash', h).execute()
        if existing.data:
            skipped += 1
            continue

        # Insert job
        job_row = {
            'hash': h,
            'title': job['title'],
            'company': job['company'],
            'platform': job['platform'],
            'location': job.get('location', 'Remote'),
            'job_type': job.get('job_type', 'Remote'),
            'domain': job.get('domain', 'General'),
            'description': (job.get('description', '') or '')[:5000],  # Truncate long descriptions
            'apply_url': job.get('apply_url', ''),
        }

        # Parse posted_at safely
        parsed_date = parse_date(job.get('posted_at', ''))
        if parsed_date:
            job_row['posted_at'] = parsed_date

        try:
            result = client.table('jobs').insert(job_row).execute()
        except Exception as e:
            print(f'  ⚠ Skipping job "{job["title"][:40]}": {str(e)[:80]}')
            skipped += 1
            continue

        if result.data:
            job_id = result.data[0]['id']

            # Link skills
            for skill_name in job.get('skills', []):
                skill_id = skill_cache.get(skill_name)
                if skill_id:
                    try:
                        client.table('job_skills').insert({
                            'job_id': job_id,
                            'skill_id': skill_id,
                        }).execute()
                    except Exception:
                        pass  # Duplicate link, skip

            inserted += 1

    print(f'  → Pushed: {inserted} new, {skipped} duplicates skipped')
    return inserted, skipped


def _get_or_create_skills(client, jobs):
    """
    Ensure all skills mentioned in jobs exist in the skills table.
    Returns a dict of skill_name → skill_id.
    """
    # Collect all unique skills
    all_skills = set()
    for job in jobs:
        for s in job.get('skills', []):
            all_skills.add(s)

    if not all_skills:
        return {}

    # Fetch existing skills
    existing = client.table('skills').select('id, name').execute()
    skill_map = {s['name']: s['id'] for s in existing.data}

    # Create missing skills
    for skill_name in all_skills:
        if skill_name not in skill_map:
            domain = _guess_skill_domain(skill_name)
            try:
                result = client.table('skills').insert({
                    'name': skill_name,
                    'category': domain,
                    'total_mentions': 0,
                }).execute()
                if result.data:
                    skill_map[skill_name] = result.data[0]['id']
            except Exception as e:
                print(f'  ⚠ Could not create skill "{skill_name}": {str(e)[:60]}')

    return skill_map


def _guess_skill_domain(skill_name):
    """Guess what domain a skill belongs to."""
    from config import DOMAIN_SKILL_MAP
    s = skill_name.lower()
    for domain, skills in DOMAIN_SKILL_MAP.items():
        if s in [sk.lower() for sk in skills]:
            return domain
    return 'General'


def update_skill_counts(dry_run=False):
    """
    Recount total_mentions for each skill and take a daily snapshot.
    Call this after pushing jobs.
    """
    if dry_run:
        print('  [DRY RUN] Would update skill counts')
        return

    client = get_client()

    # Get all skills
    skills = client.table('skills').select('id, name').execute()

    today = date.today().isoformat()

    for skill in skills.data:
        # Count how many jobs reference this skill
        count_result = client.table('job_skills').select('job_id', count='exact').eq('skill_id', skill['id']).execute()
        mention_count = count_result.count or 0

        # Update skill total
        client.table('skills').update({
            'total_mentions': mention_count,
        }).eq('id', skill['id']).execute()

        # Insert daily snapshot (upsert)
        try:
            client.table('skills_snapshot').upsert({
                'skill_id': skill['id'],
                'mention_count': mention_count,
                'snapshot_date': today,
            }, on_conflict='skill_id,snapshot_date').execute()
        except Exception:
            pass  # Snapshot already exists for today

    print(f'  → Updated counts for {len(skills.data)} skills, snapshot saved for {today}')
