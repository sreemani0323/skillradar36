"""
Skill extraction from job descriptions.
Hybrid approach: curated keyword list + tag matching.
"""
import json
import os
import re
from html import unescape

SKILL_LIST_PATH = os.path.join(os.path.dirname(__file__), 'skill_list.json')

# Load skill dictionary
with open(SKILL_LIST_PATH, 'r') as f:
    SKILL_DB = json.load(f)['skills']

# Build a lookup: lowercase → canonical name
SKILL_LOOKUP = {}
for skill in SKILL_DB:
    SKILL_LOOKUP[skill.lower()] = skill
    # Also add without dots/special chars for flexibility
    clean = re.sub(r'[.\-/]', '', skill.lower())
    if clean != skill.lower():
        SKILL_LOOKUP[clean] = skill


def clean_html(text):
    """Strip HTML tags and decode entities."""
    text = unescape(text or '')
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_skills(description, tags=None):
    """
    Extract skills from a job description + tags.

    Returns a list of unique canonical skill names.
    """
    found = set()

    # 1. Check tags first (many APIs provide structured tags)
    if tags:
        for tag in tags:
            tag_lower = tag.strip().lower()
            if tag_lower in SKILL_LOOKUP:
                found.add(SKILL_LOOKUP[tag_lower])
            # Try cleaned version
            clean = re.sub(r'[.\-/]', '', tag_lower)
            if clean in SKILL_LOOKUP:
                found.add(SKILL_LOOKUP[clean])

    # 2. Keyword matching on description
    text = clean_html(description).lower()

    # Sort skills by length (longest first) to match multi-word skills before single-word
    sorted_skills = sorted(SKILL_LOOKUP.keys(), key=len, reverse=True)

    for skill_lower in sorted_skills:
        # Use word boundary matching for short skills (< 4 chars) to avoid false positives
        if len(skill_lower) < 4:
            pattern = r'\b' + re.escape(skill_lower) + r'\b'
            if re.search(pattern, text):
                found.add(SKILL_LOOKUP[skill_lower])
        else:
            if skill_lower in text:
                found.add(SKILL_LOOKUP[skill_lower])

    return sorted(list(found))


def classify_domain(skills, title=""):
    """
    Classify a job into a domain based on its extracted skills.
    Uses priority order from config.DOMAIN_SKILL_MAP.
    Provides a fallback to title-based classification.
    """
    from config import DOMAIN_SKILL_MAP

    skills_lower = set(s.lower() for s in skills)

    # Score each domain by number of matching skills
    scores = {}
    for domain, domain_skills in DOMAIN_SKILL_MAP.items():
        score = sum(1 for s in domain_skills if s.lower() in skills_lower)
        if score > 0:
            scores[domain] = score

    if scores:
        # Return domain with highest score
        return max(scores, key=scores.get)
        
    # Fallback: Try to classify by title if no skills matched
    if title:
        title_lower = title.lower()
        if any(x in title_lower for x in ['frontend', 'backend', 'full stack', 'web', 'react', 'node', 'software', 'developer']):
            return 'Full Stack'
        if any(x in title_lower for x in ['data', 'analytics', 'bi', 'business intelligence']):
            return 'Data Science'
        if any(x in title_lower for x in ['ai', 'ml', 'machine learning', 'computer vision', 'nlp']):
            return 'AI/ML'
        if any(x in title_lower for x in ['security', 'cyber', 'pentest', 'soc']):
            return 'Cybersecurity'
        if any(x in title_lower for x in ['devops', 'cloud', 'sre', 'aws', 'infrastructure']):
            return 'Cloud/DevOps'
        if any(x in title_lower for x in ['llm', 'genai', 'prompt']):
            return 'LLM/GenAI'

    return 'General'

