-- SkillRadar Initial Schema
-- Run this in your Supabase SQL Editor (supabase.com > project > SQL Editor)

-- ========== TABLES ==========

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  total_mentions INTEGER DEFAULT 0,
  change_percent REAL DEFAULT 0,
  trend TEXT DEFAULT 'up' CHECK (trend IN ('up', 'down', 'stable')),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hash TEXT UNIQUE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  platform TEXT NOT NULL,
  location TEXT,
  job_type TEXT DEFAULT 'On-site',
  domain TEXT,
  description TEXT,
  apply_url TEXT,
  posted_at TIMESTAMPTZ DEFAULT now(),
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- Junction: job <-> skills
CREATE TABLE IF NOT EXISTS job_skills (
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (job_id, skill_id)
);

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  my_skills JSONB DEFAULT '[]'::jsonb,
  watchlist JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Skill mention snapshots (for trend charts)
CREATE TABLE IF NOT EXISTS skills_snapshot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  mention_count INTEGER NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(skill_id, snapshot_date)
);

-- User application tracker (Kanban)
CREATE TABLE IF NOT EXISTS user_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  domain TEXT,
  match_score INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interview', 'offer', 'rejected')),
  note TEXT,
  applied_at TIMESTAMPTZ DEFAULT now()
);

-- User alert settings
CREATE TABLE IF NOT EXISTS user_alert_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  threshold INTEGER DEFAULT 70,
  email BOOLEAN DEFAULT true,
  telegram BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  UNIQUE(user_id, domain)
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_mentions ON skills(total_mentions DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_domain ON jobs(domain);
CREATE INDEX IF NOT EXISTS idx_jobs_posted ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_snapshot_skill ON skills_snapshot(skill_id, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_applications_user ON user_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON user_alert_settings(user_id);

-- ========== ROW LEVEL SECURITY ==========
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alert_settings ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Applications: users can only access their own
CREATE POLICY "Users can view own apps" ON user_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own apps" ON user_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own apps" ON user_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own apps" ON user_applications FOR DELETE USING (auth.uid() = user_id);

-- Alert settings: users can only access their own
CREATE POLICY "Users can view own alerts" ON user_alert_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON user_alert_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON user_alert_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON user_alert_settings FOR DELETE USING (auth.uid() = user_id);

-- Public tables: anyone can read skills and jobs
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read skills" ON skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read jobs" ON jobs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read job_skills" ON job_skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read snapshots" ON skills_snapshot FOR SELECT TO anon, authenticated USING (true);

-- ========== SEED DATA: SKILLS ==========
INSERT INTO skills (name, category, total_mentions, change_percent, trend) VALUES
  ('Python', 'AI/ML', 1847, 12, 'up'),
  ('React', 'Full Stack', 1623, 8, 'up'),
  ('TensorFlow', 'AI/ML', 1205, -3, 'down'),
  ('JavaScript', 'Full Stack', 1189, 5, 'up'),
  ('SQL', 'Data Science', 1104, 2, 'up'),
  ('Docker', 'Cloud/DevOps', 987, 15, 'up'),
  ('LangChain', 'LLM/GenAI', 934, 42, 'up'),
  ('PyTorch', 'AI/ML', 876, 18, 'up'),
  ('Node.js', 'Full Stack', 843, 1, 'up'),
  ('AWS', 'Cloud/DevOps', 812, 7, 'up'),
  ('Pandas', 'Data Science', 798, -1, 'down'),
  ('TypeScript', 'Full Stack', 756, 22, 'up'),
  ('Kubernetes', 'Cloud/DevOps', 698, 10, 'up'),
  ('OpenAI API', 'LLM/GenAI', 654, 56, 'up'),
  ('MongoDB', 'Full Stack', 623, -2, 'down'),
  ('Scikit-learn', 'Data Science', 587, -5, 'down'),
  ('PostgreSQL', 'Full Stack', 567, 13, 'up'),
  ('Hugging Face', 'LLM/GenAI', 543, 38, 'up'),
  ('Terraform', 'Cloud/DevOps', 512, 9, 'up'),
  ('Linux', 'Cybersecurity', 498, 3, 'up'),
  ('Next.js', 'Full Stack', 487, 28, 'up'),
  ('Power BI', 'Data Science', 456, 6, 'up'),
  ('RAG', 'LLM/GenAI', 432, 67, 'up'),
  ('Penetration Testing', 'Cybersecurity', 398, 11, 'up'),
  ('Prompt Engineering', 'LLM/GenAI', 387, 45, 'up'),
  ('Tailwind CSS', 'Full Stack', 376, 19, 'up'),
  ('SIEM', 'Cybersecurity', 345, 8, 'up'),
  ('Spark', 'Data Science', 334, -4, 'down'),
  ('FastAPI', 'Full Stack', 312, 32, 'up'),
  ('Vector Databases', 'LLM/GenAI', 298, 71, 'up')
ON CONFLICT (name) DO NOTHING;

-- ========== SEED DATA: JOBS ==========
INSERT INTO jobs (title, company, platform, location, job_type, domain, posted_at) VALUES
  ('AI/ML Intern', 'Google DeepMind', 'LinkedIn', 'Bangalore', 'Hybrid', 'AI/ML', '2025-03-23'),
  ('Full Stack Developer Intern', 'Razorpay', 'Internshala', 'Bangalore', 'On-site', 'Full Stack', '2025-03-22'),
  ('Data Science Intern', 'Flipkart', 'Naukri', 'Bangalore', 'On-site', 'Data Science', '2025-03-24'),
  ('GenAI Research Intern', 'Microsoft', 'LinkedIn', 'Hyderabad', 'Hybrid', 'LLM/GenAI', '2025-03-25'),
  ('Cloud Engineer Intern', 'Amazon', 'Indeed', 'Chennai', 'On-site', 'Cloud/DevOps', '2025-03-21'),
  ('SOC Analyst Intern', 'CrowdStrike', 'LinkedIn', 'Remote', 'Remote', 'Cybersecurity', '2025-03-20'),
  ('Frontend Developer Intern', 'Swiggy', 'Internshala', 'Bangalore', 'On-site', 'Full Stack', '2025-03-24'),
  ('ML Engineer Intern', 'NVIDIA', 'LinkedIn', 'Pune', 'Hybrid', 'AI/ML', '2025-03-22'),
  ('Backend Developer Intern', 'Zerodha', 'AngelList', 'Bangalore', 'Remote', 'Full Stack', '2025-03-23'),
  ('LLM Application Developer', 'Ola', 'Naukri', 'Bangalore', 'On-site', 'LLM/GenAI', '2025-03-25'),
  ('Data Analyst Intern', 'PhonePe', 'Internshala', 'Bangalore', 'Hybrid', 'Data Science', '2025-03-24'),
  ('DevOps Intern', 'Atlassian', 'LinkedIn', 'Bangalore', 'Hybrid', 'Cloud/DevOps', '2025-03-21')
ON CONFLICT DO NOTHING;

-- ========== SEED DATA: JOB-SKILL LINKS ==========
-- Link skills to jobs using subqueries
INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Google DeepMind' AND s.name IN ('Python', 'TensorFlow', 'PyTorch')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Razorpay' AND s.name IN ('React', 'Node.js', 'PostgreSQL', 'TypeScript')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Flipkart' AND s.name IN ('Python', 'SQL', 'Pandas', 'Scikit-learn', 'Power BI')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Microsoft' AND j.title LIKE '%GenAI%' AND s.name IN ('Python', 'LangChain', 'OpenAI API', 'RAG', 'Vector Databases')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Amazon' AND s.name IN ('AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'CrowdStrike' AND s.name IN ('SIEM', 'Linux', 'Penetration Testing')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Swiggy' AND s.name IN ('React', 'JavaScript', 'Tailwind CSS', 'Next.js')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'NVIDIA' AND s.name IN ('Python', 'PyTorch')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Zerodha' AND s.name IN ('PostgreSQL', 'Docker')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Ola' AND s.name IN ('Python', 'LangChain', 'Hugging Face', 'FastAPI')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'PhonePe' AND s.name IN ('SQL', 'Python', 'Power BI')
ON CONFLICT DO NOTHING;

INSERT INTO job_skills (job_id, skill_id)
SELECT j.id, s.id FROM jobs j, skills s WHERE j.company = 'Atlassian' AND s.name IN ('Docker', 'Kubernetes', 'AWS', 'Terraform')
ON CONFLICT DO NOTHING;

-- ========== SEED DATA: TREND SNAPSHOTS ==========
INSERT INTO skills_snapshot (skill_id, mention_count, snapshot_date)
SELECT s.id, v.mentions, v.snap_date::date
FROM skills s, (VALUES
  ('Python', 1540, '2024-10-01'), ('Python', 1590, '2024-11-01'), ('Python', 1620, '2024-12-01'), ('Python', 1680, '2025-01-01'), ('Python', 1750, '2025-02-01'), ('Python', 1847, '2025-03-01'),
  ('React', 1380, '2024-10-01'), ('React', 1420, '2024-11-01'), ('React', 1460, '2024-12-01'), ('React', 1510, '2025-01-01'), ('React', 1570, '2025-02-01'), ('React', 1623, '2025-03-01'),
  ('LangChain', 320, '2024-10-01'), ('LangChain', 450, '2024-11-01'), ('LangChain', 580, '2024-12-01'), ('LangChain', 690, '2025-01-01'), ('LangChain', 810, '2025-02-01'), ('LangChain', 934, '2025-03-01'),
  ('Docker', 780, '2024-10-01'), ('Docker', 810, '2024-11-01'), ('Docker', 850, '2024-12-01'), ('Docker', 890, '2025-01-01'), ('Docker', 940, '2025-02-01'), ('Docker', 987, '2025-03-01'),
  ('SQL', 980, '2024-10-01'), ('SQL', 1010, '2024-11-01'), ('SQL', 1020, '2024-12-01'), ('SQL', 1050, '2025-01-01'), ('SQL', 1080, '2025-02-01'), ('SQL', 1104, '2025-03-01')
) AS v(skill_name, mentions, snap_date)
WHERE s.name = v.skill_name
ON CONFLICT (skill_id, snapshot_date) DO NOTHING;
