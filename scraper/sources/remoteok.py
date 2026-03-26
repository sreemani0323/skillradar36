"""
RemoteOK.com — Public JSON endpoint
Note: RemoteOK returns JSON at /api but rate-limits aggressively.
We add a delay and respectful user-agent.
"""
import requests
import time
from config import REQUEST_TIMEOUT, USER_AGENT

API_URL = 'https://remoteok.com/api'

def fetch(limit=100):
    """Fetch jobs from RemoteOK JSON endpoint."""
    jobs = []
    try:
        time.sleep(1)  # Respectful delay
        resp = requests.get(
            API_URL,
            headers={
                'User-Agent': USER_AGENT,
                'Accept': 'application/json',
            },
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        # First item is metadata, skip it
        for item in data[1:limit + 1]:
            if not isinstance(item, dict):
                continue
            jobs.append({
                'title': item.get('position', '').strip(),
                'company': item.get('company', '').strip(),
                'platform': 'RemoteOK',
                'location': item.get('location', 'Remote') or 'Remote',
                'job_type': 'Remote',
                'description': item.get('description', ''),
                'apply_url': item.get('url', '') or f"https://remoteok.com/l/{item.get('id', '')}",
                'posted_at': item.get('date', ''),
                'tags': item.get('tags', []),
            })

        print(f'  ✓ RemoteOK: {len(jobs)} jobs fetched')
    except Exception as e:
        print(f'  ✗ RemoteOK error: {e}')

    return jobs
