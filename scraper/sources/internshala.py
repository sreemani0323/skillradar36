"""
Internshala — Web scraper for tech internship listings.
Internshala doesn't have a public RSS/API for job listings,
so we parse their public category pages for tech internships.
"""
import requests
import re
from config import REQUEST_TIMEOUT, USER_AGENT

URLS = [
    'https://internshala.com/internships/computer-science-internship',
    'https://internshala.com/internships/web-development-internship',
    'https://internshala.com/internships/python-django-development-internship',
    'https://internshala.com/internships/machine-learning-internship',
]

def fetch(limit=50):
    """Fetch internships from Internshala public pages."""
    jobs = []
    try:
        for url in URLS:
            try:
                resp = requests.get(
                    url,
                    headers={
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'text/html,application/xhtml+xml',
                    },
                    timeout=REQUEST_TIMEOUT,
                )
                if resp.status_code != 200:
                    continue

                html = resp.text
                # Extract internship cards from the HTML
                # Internshala uses structured data we can parse
                titles = re.findall(r'<h3 class="[^"]*heading_4_5[^"]*"[^>]*>\s*<a[^>]*>([^<]+)</a>', html)
                companies = re.findall(r'<h4 class="[^"]*heading_6[^"]*"[^>]*>\s*<a[^>]*>([^<]+)</a>', html)
                locations = re.findall(r'<span[^>]*id="location_names"[^>]*>([^<]+)</span>', html)
                links = re.findall(r'<a[^>]*class="[^"]*job-title-href[^"]*"[^>]*href="([^"]+)"', html)

                for i in range(min(len(titles), len(companies))):
                    loc = locations[i].strip() if i < len(locations) else 'India'
                    link = f"https://internshala.com{links[i]}" if i < len(links) else url

                    jobs.append({
                        'title': titles[i].strip(),
                        'company': companies[i].strip(),
                        'platform': 'Internshala',
                        'location': loc,
                        'job_type': 'Remote' if 'work from home' in loc.lower() else 'On-site',
                        'description': f"{titles[i].strip()} internship at {companies[i].strip()}",
                        'apply_url': link,
                        'posted_at': '',
                        'tags': [url.split('/')[-1].replace('-internship', '').replace('-', ' ')],
                    })
            except Exception:
                continue

        # Deduplicate
        seen = set()
        unique = []
        for j in jobs:
            key = f"{j['title']}|{j['company']}"
            if key not in seen:
                seen.add(key)
                unique.append(j)
        jobs = unique[:limit]

        print(f'  ✓ Internshala: {len(jobs)} jobs fetched')
    except Exception as e:
        print(f'  ✗ Internshala error: {e}')

    return jobs
