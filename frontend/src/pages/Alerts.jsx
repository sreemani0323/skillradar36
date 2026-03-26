import { useState } from 'react';
import {
  Bell, BellRing, Mail, MessageCircle, Settings, Plus, Trash2,
  AlertCircle, CheckCircle, Clock, TrendingUp, Filter, X,
} from 'lucide-react';
import { domainColors } from '../data/mockData';
import { useAlerts, useRecentAlerts } from '../hooks/useAlerts';

export default function Alerts() {
  const { settings, updateSetting, addSetting } = useAlerts();
  const { alerts: recentAlertsData } = useRecentAlerts();
  const [alerts, setAlerts] = useState(recentAlertsData);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({ domain: 'AI/ML', threshold: 70, email: true, telegram: false });

  // Sync alerts when recentAlertsData changes
  useState(() => { setAlerts(recentAlertsData); }, [recentAlertsData]);

  const toggleSetting = (id, field) => {
    const rule = settings.find(s => s.id === id);
    if (rule) updateSetting(id, { [field]: !rule[field] });
  };

  const updateThreshold = (id, value) => {
    updateSetting(id, { threshold: parseInt(value) });
  };

  const deleteRule = (id) => {
    updateSetting(id, { active: false });
  };

  const addRule = () => {
    addSetting({ ...newRule, active: true });
    setShowAddRule(false);
    setNewRule({ domain: 'AI/ML', threshold: 70, email: true, telegram: false });
  };

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, read: true } : a
    ));
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Smart Alerts</h1>
        <p>Get notified when high-match jobs appear — only the ones worth your time</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Alert Rules */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="var(--accent-primary)" /> Alert Rules
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddRule(!showAddRule)}>
              <Plus size={14} /> Add Rule
            </button>
          </div>

          {/* Add rule form */}
          {showAddRule && (
            <div className="glass-card" style={{ padding: '20px', marginBottom: '16px', borderColor: 'var(--border-primary)', animation: 'scaleIn 0.2s ease' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>New Alert Rule</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Domain</label>
                  <select className="input" value={newRule.domain} onChange={e => setNewRule(p => ({ ...p, domain: e.target.value }))} style={{ paddingLeft: '14px' }}>
                    {['AI/ML', 'Full Stack', 'Data Science', 'LLM/GenAI', 'Cybersecurity', 'Cloud/DevOps'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                    Match Threshold: {newRule.threshold}%
                  </label>
                  <input
                    type="range" min="30" max="100" value={newRule.threshold}
                    onChange={e => setNewRule(p => ({ ...p, threshold: parseInt(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={newRule.email} onChange={() => setNewRule(p => ({ ...p, email: !p.email }))} />
                      <span className="toggle-slider"></span>
                    </label>
                    <Mail size={14} /> Email
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={newRule.telegram} onChange={() => setNewRule(p => ({ ...p, telegram: !p.telegram }))} />
                      <span className="toggle-slider"></span>
                    </label>
                    <MessageCircle size={14} /> Telegram
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm" onClick={addRule}>Create Rule</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowAddRule(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Existing rules */}
          {settings.map((rule, i) => (
            <div key={rule.id} className="glass-card" style={{
              padding: '18px',
              marginBottom: '12px',
              opacity: rule.active ? 1 : 0.6,
              animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: domainColors[rule.domain] || '#6c5ce7',
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{rule.domain}</span>
                  <span className={`badge ${rule.active ? 'badge-success' : 'badge-warning'}`}>
                    {rule.active ? 'Active' : 'Paused'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <label className="toggle-switch" style={{ transform: 'scale(0.85)' }}>
                    <input type="checkbox" checked={rule.active} onChange={() => toggleSetting(rule.id, 'active')} />
                    <span className="toggle-slider"></span>
                  </label>
                  <button onClick={() => deleteRule(rule.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Match Threshold</span>
                  <span style={{ color: 'var(--accent-primary-light)', fontWeight: 600 }}>{rule.threshold}%</span>
                </label>
                <input
                  type="range" min="30" max="100" value={rule.threshold}
                  onChange={e => updateThreshold(rule.id, e.target.value)}
                  style={{ width: '100%', accentColor: domainColors[rule.domain] || 'var(--accent-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => toggleSetting(rule.id, 'email')}>
                  <Mail size={13} color={rule.email ? '#00b894' : 'var(--text-muted)'} />
                  Email {rule.email ? '✓' : '✗'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => toggleSetting(rule.id, 'telegram')}>
                  <MessageCircle size={13} color={rule.telegram ? '#00b894' : 'var(--text-muted)'} />
                  Telegram {rule.telegram ? '✓' : '✗'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Alerts */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BellRing size={18} color="var(--accent-primary)" />
              Recent Alerts
              {unreadCount > 0 && (
                <span style={{
                  background: 'var(--accent-danger)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}>{unreadCount}</span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
            )}
          </div>

          {alerts.map((alert, i) => (
            <div
              key={alert.id}
              className="glass-card"
              style={{
                padding: '16px',
                marginBottom: '10px',
                cursor: 'pointer',
                borderColor: !alert.read ? 'rgba(108,92,231,0.3)' : undefined,
                animation: `fadeInUp 0.4s ease ${i * 0.06}s both`,
              }}
              onClick={() => markAsRead(alert.id)}
            >
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: `${domainColors[alert.domain] || '#6c5ce7'}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Bell size={18} color={domainColors[alert.domain] || '#6c5ce7'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: !alert.read ? 600 : 400 }}>{alert.title}</span>
                    {!alert.read && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{alert.company}</div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge" style={{
                      background: alert.matchScore >= 80 ? 'rgba(0,184,148,0.15)' : 'rgba(253,203,110,0.15)',
                      color: alert.matchScore >= 80 ? '#00b894' : '#fdcb6e',
                    }}>
                      <TrendingUp size={10} /> {alert.matchScore}% match
                    </span>
                    <span className="badge" style={{
                      background: `${domainColors[alert.domain]}20`,
                      color: domainColors[alert.domain],
                    }}>{alert.domain}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
