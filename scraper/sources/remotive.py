"""
Remotive.com — Official JSON API
Docs: https://remotive.com/api/remote-jobs (public, no key needed)
"""
import requests
from config import REQUEST_TIMEOUT, USER_AGENT

API_URL = 'https://remotive.com/api/remote-jobs'

def fetch(limit=100):
    """Fetch jobs from Remotive API. Returns list of normalized dicts."""
    jobs = []
    try:
        resp = requests.get(
            API_URL,
            headers={'User-Agent': USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        for item in data.get('jobs', [])[:limit]:
            jobs.append({
                'title': item.get('title', '').strip(),
                'company': item.get('company_name', '').strip(),
                'platform': 'Remotive',
                'location': item.get('candidate_required_location', 'Remote'),
                'job_type': 'Remote',
                'description': item.get('description', ''),
                'apply_url': item.get('url', ''),
                'posted_at': item.get('publication_date', ''),
                'tags': item.get('tags', []),
            })

        print(f'  ✓ Remotive: {len(jobs)} jobs fetched')
    except Exception as e:
        print(f'  ✗ Remotive error: {e}')

    return jobs
