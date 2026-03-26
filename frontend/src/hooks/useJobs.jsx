import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { jobs as mockJobs } from '../data/mockData';
import { calculateMatchScore } from '../utils/skillMatchScore';

/**
 * Fetch jobs from Supabase with filters, joined with skills.
 * Falls back to mock data if Supabase is not configured.
 */
export function useJobs({ domain = 'All', type = 'All', search = '', userSkills = [] } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      let filtered = [...mockJobs];
      if (domain !== 'All') filtered = filtered.filter(j => j.domain === domain);
      if (type !== 'All') filtered = filtered.filter(j => j.type === type);
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      // Recalculate match scores if user skills provided
      if (userSkills.length) {
        filtered = filtered.map(j => ({
          ...j,
          matchScore: calculateMatchScore(userSkills, j.skills),
        }));
      }
      setData(filtered);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      let query = supabase
        .from('jobs')
        .select(`
          id, title, company, platform, location, job_type, domain, apply_url, posted_at,
          job_skills ( skill_id, skills ( name ) )
        `)
        .order('posted_at', { ascending: false });

      if (domain !== 'All') query = query.eq('domain', domain);
      if (type !== 'All') query = query.eq('job_type', type);
      if (search) query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%`);

      const { data: rows, error: err } = await query;
      if (err) { setError(err.message); setLoading(false); return; }

      const jobs = rows.map(r => {
        const skills = r.job_skills?.map(js => js.skills?.name).filter(Boolean) || [];
        return {
          id: r.id,
          title: r.title,
          company: r.company,
          platform: r.platform,
          location: r.location,
          type: r.job_type,
          domain: r.domain,
          skills,
          matchScore: calculateMatchScore(userSkills, skills),
          postedAt: r.posted_at,
          applyUrl: r.apply_url || '#',
        };
      });

      setData(jobs);
      setLoading(false);
    }
    fetch();
  }, [domain, type, search, userSkills.join(',')]);

  return { data, loading, error };
}
