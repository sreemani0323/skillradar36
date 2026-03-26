import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'frontend', '.env'))
# Also load scraper-specific .env if it exists
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'), override=True)

SUPABASE_URL = os.getenv('VITE_SUPABASE_URL', '') or os.getenv('SUPABASE_URL', '')
# Scraper uses service_role key (bypasses RLS) — NEVER expose this in frontend
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '') or os.getenv('VITE_SUPABASE_ANON_KEY', '')

# Domain classification rules: if a job's extracted skills contain
# any skill from a domain, it gets classified into that domain.
# Priority order: first match wins.
DOMAIN_SKILL_MAP = {
    'LLM/GenAI': ['langchain', 'openai', 'llm', 'gpt', 'rag', 'vector database', 'hugging face',
                   'prompt engineering', 'fine-tuning', 'transformer', 'generative ai', 'chatgpt',
                   'ollama', 'llamaindex', 'embeddings', 'claude', 'anthropic', 'gemini'],
    'AI/ML': ['tensorflow', 'pytorch', 'machine learning', 'deep learning', 'neural network',
              'computer vision', 'nlp', 'scikit-learn', 'keras', 'opencv', 'reinforcement learning',
              'ml', 'artificial intelligence', 'data mining', 'predictive modeling'],
    'Data Science': ['pandas', 'numpy', 'matplotlib', 'power bi', 'tableau', 'data analysis',
                     'statistics', 'spark', 'hadoop', 'data pipeline', 'etl', 'dbt', 'snowflake',
                     'data engineering', 'bigquery', 'airflow', 'redshift', 'databricks', 'r', 'excel'],
    'Cybersecurity': ['penetration testing', 'siem', 'soc', 'firewall', 'vulnerability',
                      'incident response', 'threat', 'malware', 'security audit', 'nist',
                      'owasp', 'cryptography', 'ids', 'ips', 'wireshark', 'burp suite', 'metasploit'],
    'Cloud/DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd',
                     'jenkins', 'ansible', 'devops', 'cloud', 'lambda', 'serverless', 'helm',
                     'github actions', 'gitlab ci', 'prometheus', 'grafana', 'sre', 'argocd'],
    'Full Stack': ['react', 'node.js', 'javascript', 'typescript', 'next.js', 'vue', 'angular',
                   'express', 'django', 'flask', 'fastapi', 'mongodb', 'postgresql', 'mysql',
                   'graphql', 'rest api', 'html', 'css', 'tailwind', 'python', 'java', 'c++', 
                   'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'spring boot', 'laravel', 
                   '.net', 'ruby on rails'],
}

# Request settings
REQUEST_TIMEOUT = 15  # seconds
USER_AGENT = 'SkillRadar/1.0 (Student Research Project - job skill trend analysis)'
