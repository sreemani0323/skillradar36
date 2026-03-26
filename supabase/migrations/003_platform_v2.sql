-- SkillRadar v2 Schema — Profiles, Saved Jobs, Skill Preferences
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql

-- Profiles (extends users with resume data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  resume_data JSONB DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Saved jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Skill preferences (user's priority skills for matching)
CREATE TABLE IF NOT EXISTS skill_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  UNIQUE(user_id, skill_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_skill_prefs_user ON skill_preferences(user_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: own data only
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Saved jobs: own data only
CREATE POLICY "Users read own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own saved jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- Skill preferences: own data only
CREATE POLICY "Users read own skill prefs" ON skill_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own skill prefs" ON skill_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own skill prefs" ON skill_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own skill prefs" ON skill_preferences FOR DELETE USING (auth.uid() = user_id);
