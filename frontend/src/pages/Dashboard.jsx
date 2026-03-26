import { useState } from 'react';
import { useDashboardStats, useTopSkills } from '../hooks/useDashboard';
import { Briefcase, Code2, Layers, TrendingUp, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STAT_ICONS = [Briefcase, Code2, Layers, TrendingUp];
const STAT_COLORS = ['var(--accent-bg)', 'var(--green-bg)', 'var(--blue-bg)', 'var(--amber-bg)'];
const STAT_ICON_COLORS = ['var(--accent)', 'var(--green)', 'var(--blue)', 'var(--amber)'];

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { data: skills, loading: skillsLoading } = useTopSkills('All', 10);
  const [showChart, setShowChart] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const statCards = [
    { label: 'Jobs Indexed', value: stats.totalJobs || 0, change: '+147 this week' },
    { label: 'Skills Tracked', value: stats.totalSkills || 0, change: '+12 new' },
    { label: 'Platforms', value: stats.platformCount || stats.platforms || 0, change: '+2 added' },
    { label: 'Avg. Match', value: `${stats.avgMatch || 72}%`, change: '+5%' },
  ];

  const displayedSkills = showAllSkills ? skills : skills.slice(0, 5);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Skill demand overview</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card skeleton" style={{ height: 100 }} />
          ))
        ) : (
          statCards.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div key={stat.label} className="card stat-card">
                <div className="stat-icon" style={{ background: STAT_COLORS[i], color: STAT_ICON_COLORS[i] }}>
                  <Icon size={18} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <span className="stat-change up">{stat.change}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Top Skills — progressive disclosure */}
      <div className="card mb-6">
        <div className="chart-title">Top In-Demand Skills</div>
        <div className="chart-subtitle">Ranked by mention frequency</div>

        {skillsLoading ? (
          <div className="skeleton" style={{ height: 200 }} />
        ) : skills.length === 0 ? (
          <div className="empty-state"><p>No skill data yet.</p></div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Skill</th>
                  <th>Mentions</th>
                </tr>
              </thead>
              <tbody>
                {displayedSkills.map((skill, i) => (
                  <tr key={skill.name || i}>
                    <td style={{ color: 'var(--text-muted)', width: 40 }}>{i + 1}</td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{skill.name}</span>
                      {skill.domain && (
                        <span className="badge badge-primary" style={{ marginLeft: 8 }}>
                          {skill.domain}
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ maxWidth: 100 }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${skills[0]?.mentions ? (skill.mentions / skills[0].mentions) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          {skill.mentions}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {skills.length > 5 && (
              <button className="view-more-btn" onClick={() => setShowAllSkills(!showAllSkills)}>
                {showAllSkills ? 'Show Less' : `View All ${skills.length} Skills`}
                <ChevronDown size={16} style={{ transform: showAllSkills ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Chart — collapsible */}
      <div className="card">
        <button
          className="section-toggle"
          onClick={() => setShowChart(!showChart)}
          style={{ width: '100%' }}
        >
          <span>Skill Mentions Chart</span>
          <ChevronDown size={18} style={{ transform: showChart ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {showChart && skills.length > 0 && (
          <div style={{ paddingTop: 12 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={skills.slice(0, 8).map(s => ({ name: s.name, mentions: s.mentions }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="mentions" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
