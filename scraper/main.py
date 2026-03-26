#!/usr/bin/env python3
"""
SkillRadar Scraping Pipeline — Main Orchestrator

Usage:
  python main.py              # Full run: fetch → extract → push
  python main.py --dry-run    # Fetch + extract only, no DB writes
  python main.py --source remotive   # Run a single source
"""
import sys
import time
from datetime import datetime

from sources import remotive, himalayas, arbeitnow, jobicy, remoteok, weworkremotely, internshala
from skills.extractor import extract_skills, classify_domain
from push_to_supabase import push_jobs, update_skill_counts

ALL_SOURCES = {
    'remotive': remotive,
    'himalayas': himalayas,
    'arbeitnow': arbeitnow,
    'jobicy': jobicy,
    'remoteok': remoteok,
    'weworkremotely': weworkremotely,
    'internshala': internshala,
}


def run_pipeline(sources=None, dry_run=False):
    """Run the full scraping pipeline."""
    start = time.time()
    print(f'\n{"="*60}')
    print(f'  SkillRadar Scraper — {datetime.now().strftime("%Y-%m-%d %H:%M")}')
    print(f'  Mode: {"DRY RUN" if dry_run else "LIVE PUSH"}')
    print(f'{"="*60}\n')

    # 1. Fetch from all sources
    if sources is None:
        sources = ALL_SOURCES

    all_jobs = []
    print('📡 Phase 1: Fetching jobs...')
    for name, module in sources.items():
        try:
            jobs = module.fetch()
            all_jobs.extend(jobs)
        except Exception as e:
            print(f'  ✗ {name} failed: {e}')
        time.sleep(0.5)  # Be respectful between sources

    print(f'\n  Total raw jobs: {len(all_jobs)}')

    # 2. Extract skills and classify domains
    print('\n🧠 Phase 2: Extracting skills...')
    processed = 0
    skills_found = 0
    for job in all_jobs:
        skills = extract_skills(job.get('description', ''), job.get('tags'))
        job['skills'] = skills
        job['domain'] = classify_domain(skills, job.get('title', ''))
        skills_found += len(skills)
        processed += 1

    avg_skills = skills_found / max(processed, 1)
    print(f'  Processed {processed} jobs')
    print(f'  Total skills extracted: {skills_found}')
    print(f'  Average skills per job: {avg_skills:.1f}')

    # Show domain breakdown
    domains = {}
    for job in all_jobs:
        d = job.get('domain', 'General')
        domains[d] = domains.get(d, 0) + 1
    print(f'\n  Domain breakdown:')
    for d, count in sorted(domains.items(), key=lambda x: -x[1]):
        print(f'    {d}: {count} jobs')

    # 3. Push to Supabase
    print(f'\n📤 Phase 3: {"[DRY RUN] Simulating" if dry_run else "Pushing to"} Supabase...')
    inserted, skipped = push_jobs(all_jobs, dry_run=dry_run)

    # 4. Update skill counts + snapshot
    print('\n📊 Phase 4: Updating skill counts...')
    update_skill_counts(dry_run=dry_run)

    # Summary
    elapsed = time.time() - start
    print(f'\n{"="*60}')
    print(f'  ✅ Pipeline complete in {elapsed:.1f}s')
    print(f'  Jobs fetched:  {len(all_jobs)}')
    print(f'  Jobs inserted: {inserted}')
    print(f'  Duplicates:    {skipped}')
    print(f'  Skills found:  {skills_found}')
    print(f'{"="*60}\n')


def main():
    dry_run = '--dry-run' in sys.argv
    source_filter = None

    # Check for --source flag
    for i, arg in enumerate(sys.argv):
        if arg == '--source' and i + 1 < len(sys.argv):
            name = sys.argv[i + 1].lower()
            if name in ALL_SOURCES:
                source_filter = {name: ALL_SOURCES[name]}
                print(f'Running single source: {name}')
            else:
                print(f'Unknown source: {name}')
                print(f'Available: {", ".join(ALL_SOURCES.keys())}')
                sys.exit(1)

    run_pipeline(sources=source_filter, dry_run=dry_run)


if __name__ == '__main__':
    main()
