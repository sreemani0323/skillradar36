import { useState } from 'react';
import { useAlerts, useRecentAlerts } from '../hooks/useAlerts';
import { Bell, Plus, X, Trash2 } from 'lucide-react';

export default function Alerts() {
  const { rules, addRule, removeRule, toggleRule } = useAlerts();
  const { alerts } = useRecentAlerts();
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState({ skill: '', threshold: 10, type: 'spike' });

  const handleAdd = () => {
    if (newRule.skill.trim()) {
      addRule({ ...newRule, id: Date.now().toString(), enabled: true });
      setNewRule({ skill: '', threshold: 10, type: 'spike' });
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
          <Plus size={16} /> Add Rule
        </button>
      </div>

      {/* Add Rule Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600 }}>Add Alert Rule</h3>
              <button className="btn btn-icon" onClick={() => setShowAdd(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                className="input"
                style={{ paddingLeft: 16 }}
                placeholder="Skill name (e.g. Python)"
                value={newRule.skill}
                onChange={e => setNewRule({ ...newRule, skill: e.target.value })}
              />
              <select
                className="input"
                style={{ paddingLeft: 16 }}
                value={newRule.type}
                onChange={e => setNewRule({ ...newRule, type: e.target.value })}
              >
                <option value="spike">Demand Spike</option>
                <option value="drop">Demand Drop</option>
                <option value="new">New Skill Trending</option>
              </select>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  Threshold: {newRule.threshold}% change
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={newRule.threshold}
                  onChange={e => setNewRule({ ...newRule, threshold: Number(e.target.value) })}
                  style={{ width: '100%', minHeight: 44 }}
                />
              </div>
              <button className="btn btn-primary btn-block" onClick={handleAdd} style={{ marginTop: 8 }}>
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Rules */}
      <div className="card mb-6">
        <div className="chart-title">Active Rules</div>
        <div className="chart-subtitle">{rules.length} alert{rules.length !== 1 ? 's' : ''} configured</div>

        {rules.length === 0 ? (
          <div className="empty-state">
            <Bell size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
            <p>No alert rules yet. Add one to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 12 }}>
            {rules.map(rule => (
              <div
                key={rule.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{rule.skill}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {rule.type} · {rule.threshold}% threshold
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleRule(rule.id)}
                    />
                    <span className="toggle-slider" />
                  </label>
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => removeRule(rule.id)}
                    style={{ minHeight: 36, minWidth: 36, padding: 4 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="card">
          <div className="chart-title">Recent Notifications</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 12 }}>
            {alerts.map((alert, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 0', borderBottom: '1px solid var(--border)',
                  fontSize: 13, color: 'var(--text-secondary)',
                }}
              >
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{alert.skill}</span>
                {' '}{alert.message}
                {alert.date && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{alert.date}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
