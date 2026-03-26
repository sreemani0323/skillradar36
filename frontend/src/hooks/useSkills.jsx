import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { topSkills as mockSkills, trendData as mockTrends, skillGapData as mockGap } from '../data/mockData';

/**
 * Fetch skills from Supabase, optionally filtered by domain/category.
 */
export function useSkills(domain = 'All') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const filtered = domain === 'All' ? mockSkills : mockSkills.filter(s => s.domain === domain);
      setData(filtered);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      let query = supabase.from('skills').select('*').order('total_mentions', { ascending: false });
      if (domain !== 'All') query = query.eq('category', domain);
      const { data: rows, error: err } = await query;
      if (err) setError(err.message);
      else setData(rows.map(r => ({
        name: r.name,
        mentions: r.total_mentions,
        domain: r.category,
        change: r.change_percent,
        trend: r.trend,
      })));
      setLoading(false);
    }
    fetch();
  }, [domain]);

  return { data, loading, error };
}

/**
 * Fetch trend snapshots for given skill names.
 */
export function useSkillTrends(skillNames = ['Python', 'React', 'LangChain', 'Docker', 'SQL']) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setData(mockTrends);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      // Get skill IDs
      const { data: skills } = await supabase
        .from('skills')
        .select('id, name')
        .in('name', skillNames);

      if (!skills?.length) { setLoading(false); return; }

      const skillMap = {};
      skills.forEach(s => { skillMap[s.id] = s.name; });

      const { data: snaps } = await supabase
        .from('skills_snapshot')
        .select('skill_id, mention_count, snapshot_date')
        .in('skill_id', skills.map(s => s.id))
        .order('snapshot_date', { ascending: true });

      // Group by month
      const monthMap = {};
      snaps?.forEach(snap => {
        const d = new Date(snap.snapshot_date);
        const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (!monthMap[key]) monthMap[key] = { month: key };
        monthMap[key][skillMap[snap.skill_id]] = snap.mention_count;
      });

      setData(Object.values(monthMap));
      setLoading(false);
    }
    fetch();
  }, [skillNames.join(',')]);

  return { data, loading };
}

/**
 * Compute skill gap per domain for the given user skills.
 */
export function useSkillGap(userSkills = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !userSkills.length) {
      setData(mockGap);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      const { data: allSkills } = await supabase
        .from('skills')
        .select('name, category')
        .order('total_mentions', { ascending: false });

      if (!allSkills) { setLoading(false); return; }

      // Group by domain
      const domains = {};
      allSkills.forEach(s => {
        if (!domains[s.category]) domains[s.category] = [];
        domains[s.category].push(s.name);
      });

      const userSet = new Set(userSkills.map(s => s.toLowerCase()));
      const result = Object.entries(domains).map(([domain, skills]) => {
        const matched = skills.filter(s => userSet.has(s.toLowerCase()));
        const missing = skills.filter(s => !userSet.has(s.toLowerCase()));
        return {
          domain,
          matchPercent: Math.round((matched.length / skills.length) * 100),
          totalSkills: skills.length,
          matchedSkills: matched.length,
          missing,
        };
      });

      setData(result);
      setLoading(false);
    }
    fetch();
  }, [userSkills.join(',')]);

  return { data, loading };
}
