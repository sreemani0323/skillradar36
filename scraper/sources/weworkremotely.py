"""
We Work Remotely — Public RSS feeds
Categories: programming, design, devops, management, etc.
"""
import feedparser
from config import USER_AGENT

RSS_FEEDS = [
    'https://weworkremotely.com/categories/remote-programming-jobs.rss',
    'https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss',
    'https://weworkremotely.com/categories/remote-design-jobs.rss',
    'https://weworkremotely.com/categories/remote-data-jobs.rss',
]

def fetch(limit=100):
    """Fetch jobs from We Work Remotely RSS feeds."""
    jobs = []
    try:
        for feed_url in RSS_FEEDS:
            feed = feedparser.parse(feed_url, agent=USER_AGENT)
            for entry in feed.entries:
                jobs.append({
                    'title': entry.get('title', '').strip(),
                    'company': _extract_company(entry.get('title', '')),
                    'platform': 'WeWorkRemotely',
                    'location': 'Remote',
                    'job_type': 'Remote',
                    'description': entry.get('summary', '') or entry.get('description', ''),
                    'apply_url': entry.get('link', ''),
                    'posted_at': entry.get('published', ''),
                    'tags': [t.get('term', '') for t in entry.get('tags', [])],
                })

        # Deduplicate by title+company
        seen = set()
        unique = []
        for j in jobs:
            key = f"{j['title']}|{j['company']}"
            if key not in seen:
                seen.add(key)
                unique.append(j)
        jobs = unique[:limit]

        print(f'  ✓ WeWorkRemotely: {len(jobs)} jobs fetched')
    except Exception as e:
        print(f'  ✗ WeWorkRemotely error: {e}')

    return jobs

def _extract_company(title):
    """WWR titles are often 'Company: Role'. Extract the company."""
    if ':' in title:
        return title.split(':')[0].strip()
    return 'Unknown'
