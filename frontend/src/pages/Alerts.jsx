import { useState } from 'react';
import { useAlerts, useRecentAlerts } from '../hooks/useAlerts';
import { Bell, Plus, X, Trash2, AlertTriangle, Zap, Clock } from 'lucide-react';

export default function Alerts() {
  const { settings, loading, updateSetting, addSetting } = useAlerts();
  const { alerts } = useRecentAlerts();
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState({ domain: '', threshold: 70, email: true });

  const handleAdd = () => {
    if (newRule.domain.trim()) {
      addSetting({ domain: newRule.domain, threshold: newRule.threshold, email: newRule.email, active: true });
      setNewRule({ domain: '', threshold: 70, email: true });
      setShowAdd(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Smart Alerts</h1>
          <p>Get notified about skill demand changes</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Alert
        </button>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600 }}>New Alert Rule</h3>
              <button className="btn btn-icon" onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Domain</label>
                <select className="input" style={{ paddingLeft: 16 }} value={newRule.domain} onChange={e => setNewRule(p => ({ ...p, domain: e.target.value }))}>
                  <option value="">Select domain...</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Data Science">Data Science</option>
                  <option value="LLM/GenAI">LLM/GenAI</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud/DevOps">Cloud/DevOps</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  Match Threshold: <strong>{newRule.threshold}%</strong>
                </label>
                <input type="range" min="30" max="95" value={newRule.threshold} onChange={e => setNewRule(p => ({ ...p, threshold: Number(e.target.value) }))} style={{ width: '100%', minHeight: 44 }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                <label className="toggle-switch">
                  <input type="checkbox" checked={newRule.email} onChange={e => setNewRule(p => ({ ...p, email: e.target.checked }))} />
                  <span className="toggle-slider" />
                </label>
                Email notifications
              </label>
              <button className="btn btn-primary btn-block" onClick={handleAdd} style={{ marginTop: 4 }}>Create Alert</button>
            </div>
          </div>
        </div>
      )}

      {/* Active Rules */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : settings.length === 0 ? (
        <div className="card mb-6">
          <div className="empty-state">
            <Bell size={28} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
            <p>No alert rules yet. Add one to get started.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {settings.map(rule => (
            <div key={rule.id} className="card interactive" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: rule.active ? 'var(--accent-bg)' : 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={18} style={{ color: rule.active ? 'var(--accent)' : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{rule.domain}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 2 }}>
                      <span>Threshold: {rule.threshold}%</span>
                      <span>·</span>
                      <span>{rule.email ? 'Email on' : 'Email off'}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={rule.active} onChange={() => updateSetting(rule.id, { active: !rule.active })} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Alerts Feed */}
      <div className="card">
        <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <AlertTriangle size={16} style={{ color: 'var(--amber)' }} /> Recent Matches
        </div>
        {alerts.length === 0 ? (
          <div className="empty-state"><p>No recent alerts.</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {alerts.map(alert => (
              <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{alert.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 2 }}>
                    <span>{alert.company}</span>
                    <span className="badge badge-primary">{alert.domain}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className={`badge ${alert.matchScore >= 80 ? 'badge-success' : 'badge-warning'}`}>{alert.matchScore}%</span>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}><Clock size={10} /> {alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
