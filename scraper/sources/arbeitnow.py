"""
Arbeitnow.com — Official JSON API
Docs: https://arbeitnow.com/api/job-board-api (public, no key)
"""
import requests
from config import REQUEST_TIMEOUT, USER_AGENT

API_URL = 'https://www.arbeitnow.com/api/job-board-api'

def fetch(limit=100):
    """Fetch jobs from Arbeitnow API."""
    jobs = []
    try:
        resp = requests.get(
            API_URL,
            headers={'User-Agent': USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        for item in data.get('data', [])[:limit]:
            location = item.get('location', 'Remote')
            remote = item.get('remote', False)
            jobs.append({
                'title': item.get('title', '').strip(),
                'company': item.get('company_name', '').strip(),
                'platform': 'Arbeitnow',
                'location': location if location else 'Remote',
                'job_type': 'Remote' if remote else 'On-site',
                'description': item.get('description', ''),
                'apply_url': item.get('url', ''),
                'posted_at': item.get('created_at', ''),
                'tags': item.get('tags', []),
            })

        print(f'  ✓ Arbeitnow: {len(jobs)} jobs fetched')
    except Exception as e:
        print(f'  ✗ Arbeitnow error: {e}')

    return jobs
