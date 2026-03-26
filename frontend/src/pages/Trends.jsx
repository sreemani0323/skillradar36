import { useState } from 'react';
import { useSkillTrends } from '../hooks/useSkills';
import { DOMAINS, domainColors } from '../data/mockData';
import { ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/* useSkillTrends returns flat array like:
   [{ month: 'Oct 24', Python: 1540, React: 1380, ... }, ...]
   We display one combined chart + collapsible domain sections */

const SKILL_LINES = [
  { key: 'Python', color: '#6366f1' },
  { key: 'React', color: '#06b6d4' },
  { key: 'LangChain', color: '#ec4899' },
  { key: 'Docker', color: '#3b82f6' },
  { key: 'SQL', color: '#f59e0b' },
];

export default function Trends() {
  const { data: trendData, loading } = useSkillTrends();
  const [showChart, setShowChart] = useState(true);
  const [visibleSkills, setVisibleSkills] = useState(SKILL_LINES.map(s => s.key));

  const toggleSkill = (key) => {
    setVisibleSkills(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Skill Trends</h1>
        <p>Track demand changes over time</p>
      </div>

      {/* Skill toggles */}
      <div className="filter-bar">
        {SKILL_LINES.map(({ key, color }) => (
          <button
            key={key}
            className={`filter-chip ${visibleSkills.includes(key) ? 'active' : ''}`}
            onClick={() => toggleSkill(key)}
            style={visibleSkills.includes(key) ? { borderColor: color, color, background: `${color}12` } : {}}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: visibleSkills.includes(key) ? color : 'var(--text-muted)', display: 'inline-block' }} />
            {key}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <button className="section-toggle" onClick={() => setShowChart(!showChart)} style={{ width: '100%' }}>
          <span>Mention Trends (6 months)</span>
          <ChevronDown size={18} style={{ transform: showChart ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {showChart && (
          <div style={{ paddingTop: 12 }}>
            {loading ? (
              <div className="skeleton" style={{ height: 260, borderRadius: 'var(--radius-md)' }} />
            ) : !trendData || trendData.length === 0 ? (
              <div className="empty-state"><p>No trend data available yet.</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      fontSize: 13,
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {SKILL_LINES.filter(s => visibleSkills.includes(s.key)).map(({ key, color }) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="card">
        <div className="chart-title">Key Insights</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {[
            { skill: 'LangChain', pct: '+192%', note: 'Fastest growing skill — 6-month surge in GenAI adoption', color: '#ec4899' },
            { skill: 'Python', pct: '+20%', note: 'Steady leader across AI/ML and data roles', color: '#6366f1' },
            { skill: 'React', pct: '+18%', note: 'Dominant frontend framework for SaaS internships', color: '#06b6d4' },
            { skill: 'Docker', pct: '+27%', note: 'DevOps skills increasingly required even for non-infra roles', color: '#3b82f6' },
          ].map(item => (
            <div key={item.skill} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: 4, borderRadius: 2, background: item.color, flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{item.skill}</span>
                  <span className="badge badge-success">{item.pct}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
