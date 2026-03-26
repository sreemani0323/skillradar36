import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { alertSettings as mockSettings, recentAlerts as mockAlerts } from '../data/mockData';

/**
 * Alert settings hook — manages user alert rules.
 */
export function useAlerts() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem('skillradar-alerts');
      setSettings(stored ? JSON.parse(stored) : mockSettings);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSettings(mockSettings); setLoading(false); return; }

      const { data: rows } = await supabase
        .from('user_alert_settings')
        .select('*')
        .eq('user_id', user.id);

      setSettings(rows?.length ? rows : mockSettings);
      setLoading(false);
    }
    fetch();
  }, []);

  const updateSetting = useCallback(async (id, updates) => {
    const newSettings = settings.map(s => s.id === id ? { ...s, ...updates } : s);
    setSettings(newSettings);

    if (!isSupabaseConfigured()) {
      localStorage.setItem('skillradar-alerts', JSON.stringify(newSettings));
      return;
    }

    await supabase
      .from('user_alert_settings')
      .update(updates)
      .eq('id', id);
  }, [settings]);

  const addSetting = useCallback(async (setting) => {
    const newSetting = { id: Date.now(), ...setting };

    if (!isSupabaseConfigured()) {
      const newSettings = [...settings, newSetting];
      setSettings(newSettings);
      localStorage.setItem('skillradar-alerts', JSON.stringify(newSettings));
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: inserted } = await supabase
      .from('user_alert_settings')
      .insert({ user_id: user.id, ...setting })
      .select()
      .single();

    if (inserted) setSettings(prev => [...prev, inserted]);
  }, [settings]);

  return { settings, loading, updateSetting, addSetting };
}

/**
 * Recent alerts feed — jobs matching user's alert thresholds.
 */
export function useRecentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAlerts(mockAlerts);
      setLoading(false);
      return;
    }

    async function fetch() {
      setLoading(true);
      // For now, return mock alerts — will be powered by edge functions later
      setAlerts(mockAlerts);
      setLoading(false);
    }
    fetch();
  }, []);

  return { alerts, loading };
}
