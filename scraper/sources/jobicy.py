"""
Jobicy.com — Official JSON API v2
Docs: https://jobicy.com/api/v2/remote-jobs (public, no key)
"""
import requests
from config import REQUEST_TIMEOUT, USER_AGENT

API_URL = 'https://jobicy.com/api/v2/remote-jobs'

def fetch(limit=50):
    """Fetch jobs from Jobicy API."""
    jobs = []
    try:
        resp = requests.get(
            API_URL,
            params={'count': min(limit, 50)},
            headers={'User-Agent': USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        for item in data.get('jobs', []):
            jobs.append({
                'title': item.get('jobTitle', '').strip(),
                'company': item.get('companyName', '').strip(),
                'platform': 'Jobicy',
                'location': item.get('jobGeo', 'Remote'),
                'job_type': 'Remote',
                'description': item.get('jobDescription', ''),
                'apply_url': item.get('url', ''),
                'posted_at': item.get('pubDate', ''),
                'tags': [],
            })

        print(f'  ✓ Jobicy: {len(jobs)} jobs fetched')
    except Exception as e:
        print(f'  ✗ Jobicy error: {e}')

    return jobs
