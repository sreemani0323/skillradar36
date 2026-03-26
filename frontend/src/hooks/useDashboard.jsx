import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { platformStats as mockStats, topSkills as mockSkills } from '../data/mockData';

/**
 * Dashboard aggregate stats.
 */
export function useDashboardStats() {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStats(mockStats);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);

      const [jobsRes, skillsRes] = await Promise.all([
        supabase.from('jobs').select('id, platform', { count: 'exact', head: false }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
      ]);

      const totalJobs = jobsRes.count || 0;
      const totalSkills = skillsRes.count || 0;
      const platforms = new Set(jobsRes.data?.map(j => j.platform) || []);

      setStats({
        totalJobs,
        totalSkills,
        platformCount: platforms.size,
        lastScraped: new Date().toISOString(),
      });
      setLoading(false);
    }
    fetch();
  }, []);

  return { stats, loading };
}

/**
 * Top skills for the dashboard, optionally filtered by domain.
 */
export function useTopSkills(domain = 'All', limit = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      let skills = domain === 'All' ? mockSkills : mockSkills.filter(s => s.domain === domain);
      setData(skills.slice(0, limit));
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      let query = supabase
        .from('skills')
        .select('*')
        .order('total_mentions', { ascending: false })
        .limit(limit);

      if (domain !== 'All') query = query.eq('category', domain);
      const { data: rows } = await query;

      setData((rows || []).map(r => ({
        name: r.name,
        mentions: r.total_mentions,
        domain: r.category,
        change: r.change_percent,
        trend: r.trend,
      })));
      setLoading(false);
    }
    fetch();
  }, [domain, limit]);

  return { data, loading };
}
