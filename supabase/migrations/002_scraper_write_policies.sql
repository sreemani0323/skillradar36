-- Run this in Supabase SQL Editor to allow the scraper to write data.
-- These policies let the service_role (and authenticated users) insert/update/delete
-- on public data tables.

-- Skills: allow inserts and updates
CREATE POLICY "Service can insert skills" ON skills FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service can update skills" ON skills FOR UPDATE TO service_role USING (true);
CREATE POLICY "Service can delete skills" ON skills FOR DELETE TO service_role USING (true);

-- Jobs: allow inserts and updates
CREATE POLICY "Service can insert jobs" ON jobs FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service can update jobs" ON jobs FOR UPDATE TO service_role USING (true);
CREATE POLICY "Service can delete jobs" ON jobs FOR DELETE TO service_role USING (true);

-- Job Skills: allow inserts
CREATE POLICY "Service can insert job_skills" ON job_skills FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service can update job_skills" ON job_skills FOR UPDATE TO service_role USING (true);
CREATE POLICY "Service can delete job_skills" ON job_skills FOR DELETE TO service_role USING (true);

-- Skills Snapshot: allow inserts and updates
CREATE POLICY "Service can insert snapshots" ON skills_snapshot FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service can update snapshots" ON skills_snapshot FOR UPDATE TO service_role USING (true);
CREATE POLICY "Service can delete snapshots" ON skills_snapshot FOR DELETE TO service_role USING (true);
