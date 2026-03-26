import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { kanbanData as mockKanban } from '../data/mockData';

const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'];

/**
 * Application tracker hook — CRUD operations for the Kanban board.
 * Falls back to localStorage-backed mock data if Supabase is not configured.
 */
export function useTracker() {
  const [data, setData] = useState({ saved: [], applied: [], interview: [], offer: [], rejected: [] });
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Use localStorage for persistence without Supabase
      const stored = localStorage.getItem('skillradar-tracker');
      if (stored) {
        try { setData(JSON.parse(stored)); } catch { setData(mockKanban); }
      } else {
        setData(mockKanban);
      }
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: apps } = await supabase
        .from('user_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      const grouped = { saved: [], applied: [], interview: [], offer: [], rejected: [] };
      apps?.forEach(a => {
        const item = {
          id: a.id,
          title: a.title,
          company: a.company,
          domain: a.domain,
          matchScore: a.match_score,
          note: a.note,
          date: a.applied_at?.split('T')[0],
        };
        if (grouped[a.status]) grouped[a.status].push(item);
      });

      setData(grouped);
      setLoading(false);
    }
    fetch();
  }, []);

  // Save to localStorage when not using Supabase
  const saveLocal = useCallback((newData) => {
    setData(newData);
    if (!isSupabaseConfigured()) {
      localStorage.setItem('skillradar-tracker', JSON.stringify(newData));
    }
  }, []);

  const addApplication = useCallback(async (app, status = 'saved') => {
    const newItem = {
      id: 'k' + Date.now(),
      title: app.title,
      company: app.company,
      domain: app.domain || '',
      matchScore: app.matchScore || 0,
      note: app.note || '',
      date: new Date().toISOString().split('T')[0],
    };

    if (!isSupabaseConfigured()) {
      const newData = { ...data, [status]: [...data[status], newItem] };
      saveLocal(newData);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: inserted } = await supabase
      .from('user_applications')
      .insert({
        user_id: user.id,
        title: app.title,
        company: app.company,
        domain: app.domain,
        match_score: app.matchScore || 0,
        status,
        note: app.note || '',
      })
      .select()
      .single();

    if (inserted) {
      newItem.id = inserted.id;
      setData(prev => ({ ...prev, [status]: [...prev[status], newItem] }));
    }
  }, [data, saveLocal]);

  const moveApplication = useCallback(async (id, fromStatus, toStatus) => {
    const item = data[fromStatus]?.find(a => a.id === id);
    if (!item) return;

    const newData = {
      ...data,
      [fromStatus]: data[fromStatus].filter(a => a.id !== id),
      [toStatus]: [...data[toStatus], item],
    };

    if (!isSupabaseConfigured()) {
      saveLocal(newData);
      return;
    }

    await supabase
      .from('user_applications')
      .update({ status: toStatus })
      .eq('id', id);

    setData(newData);
  }, [data, saveLocal]);

  const deleteApplication = useCallback(async (id, status) => {
    const newData = {
      ...data,
      [status]: data[status].filter(a => a.id !== id),
    };

    if (!isSupabaseConfigured()) {
      saveLocal(newData);
      return;
    }

    await supabase.from('user_applications').delete().eq('id', id);
    setData(newData);
  }, [data, saveLocal]);

  return { data, loading, addApplication, moveApplication, deleteApplication, STATUSES };
}
