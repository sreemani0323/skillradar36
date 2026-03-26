"""
Himalayas.app — Official JSON API
Docs: https://himalayas.app/jobs/api (public, no key needed)
"""
import requests
from config import REQUEST_TIMEOUT, USER_AGENT

API_URL = 'https://himalayas.app/jobs/api'

def fetch(limit=100):
    """Fetch jobs from Himalayas API."""
    jobs = []
    try:
        resp = requests.get(
            API_URL,
            params={'limit': limit},
            headers={'User-Agent': USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        for item in data.get('jobs', [])[:limit]:
            jobs.append({
                'title': item.get('title', '').strip(),
                'company': item.get('companyName', '').strip(),
                'platform': 'Himalayas',
                'location': item.get('location', 'Remote'),
                'job_type': 'Remote',
                'description': item.get('description', ''),
                'apply_url': item.get('applicationLink', '') or f"https://himalayas.app/jobs/{item.get('slug', '')}",
                'posted_at': item.get('pubDate', ''),
                'tags': item.get('categories', []),
            })

        print(f'  ✓ Himalayas: {len(jobs)} jobs fetched')
    except Exception as e:
        print(f'  ✗ Himalayas error: {e}')

    return jobs
