import { useState } from 'react';
import { useDashboardStats, useTopSkills } from '../hooks/useDashboard';
import { Briefcase, Code2, Layers, TrendingUp, TrendingDown, ChevronDown, ArrowUpRight, Minus, Flame, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STAT_ICONS = [Briefcase, Code2, Layers, TrendingUp];
const STAT_COLORS = ['var(--accent-bg)', 'var(--green-bg)', 'var(--blue-bg)', 'var(--amber-bg)'];
const STAT_ICON_COLORS = ['var(--accent)', 'var(--green)', 'var(--blue)', 'var(--amber)'];

const BAR_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#06b6d4', '#3b82f6', '#ec4899', '#f59e0b'];

const DOMAIN_COLORS = {
  'AI/ML': '#6366f1',
  'Full Stack': '#06b6d4',
  'Data Science': '#f59e0b',
  'LLM/GenAI': '#ec4899',
  'Cybersecurity': '#ef4444',
  'Cloud/DevOps': '#3b82f6',
  'General': '#9ca3af',
};

function TrendIcon({ trend, change }) {
  if (trend === 'up' || change > 0) return <TrendingUp size={14} />;
  if (trend === 'down' || change < 0) return <TrendingDown size={14} />;
  return <Minus size={14} />;
}

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboardStats();
  const { data: skills, loading: skillsLoading } = useTopSkills('All', 15);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [domainFilter, setDomainFilter] = useState('All');

  const statCards = [
    { label: 'Jobs Indexed', value: stats.totalJobs || 0, change: '+147 this week', trend: 'up' },
    { label: 'Skills Tracked', value: stats.totalSkills || 0, change: '+12 new', trend: 'up' },
    { label: 'Platforms', value: stats.platformCount || stats.platforms || 0, change: 'Active', trend: 'stable' },
    { label: 'Avg. Match', value: `${stats.avgMatch || 72}%`, change: '+5%', trend: 'up' },
  ];

  // Smart domain classification for skills with "General" category
  const classifiedSkills = (skills || []).map(s => ({
    ...s,
    domain: s.domain === 'General' || !s.domain ? inferDomain(s.name) : s.domain,
    mentions: s.mentions || s.total_mentions || 0,
    change: s.change || s.change_percent || 0,
  }));

  const domains = ['All', ...new Set(classifiedSkills.map(s => s.domain).filter(Boolean))];
  const filteredSkills = domainFilter === 'All'
    ? classifiedSkills
    : classifiedSkills.filter(s => s.domain === domainFilter);

  const displayedSkills = showAllSkills ? filteredSkills : filteredSkills.slice(0, 8);
  const chartData = classifiedSkills.slice(0, 8).map(s => ({
    name: s.name?.length > 10 ? s.name.slice(0, 9) + '…' : s.name,
    fullName: s.name,
    mentions: s.mentions,
    domain: s.domain,
  }));

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
            <div key={i} className="card skeleton" style={{ height: 110 }} />
          ))
        ) : (
          statCards.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div key={stat.label} className="card stat-card interactive">
                <div className="stat-icon" style={{ background: STAT_COLORS[i], color: STAT_ICON_COLORS[i] }}>
                  <Icon size={18} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <span className={`stat-change ${stat.trend}`}>{stat.change}</span>
              </div>
            );
          })
        )}
      </div>

      {/* ===== TOP IN-DEMAND SKILLS — Rich Card Grid ===== */}
      <div className="card mb-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Flame size={18} style={{ color: 'var(--amber)' }} /> Top In-Demand Skills
            </div>
            <div className="chart-subtitle">Ranked by mention frequency across job listings</div>
          </div>
        </div>

        {/* Domain Filter Chips */}
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          {domains.map(d => (
            <button
              key={d}
              className={`filter-chip ${domainFilter === d ? 'active' : ''}`}
              onClick={() => { setDomainFilter(d); setShowAllSkills(false); }}
              style={domainFilter === d && d !== 'All' ? { borderColor: DOMAIN_COLORS[d] || 'var(--accent)', color: DOMAIN_COLORS[d] || 'var(--accent)' } : {}}
            >
              {d}
            </button>
          ))}
        </div>

        {skillsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-md)' }} />)}
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="empty-state"><p>No skills found for this domain.</p></div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {displayedSkills.map((skill, i) => {
                const domainColor = DOMAIN_COLORS[skill.domain] || '#9ca3af';
                const isHot = (skill.change || 0) >= 20;
                const maxMentions = classifiedSkills[0]?.mentions || 1;
                const pct = Math.round((skill.mentions / maxMentions) * 100);
                return (
                  <div
                    key={skill.name || i}
                    className="card interactive"
                    style={{
                      padding: '14px 16px',
                      position: 'relative',
                      overflow: 'hidden',
                      borderLeft: `3px solid ${domainColor}`,
                    }}
                  >
                    {/* Rank Badge */}
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 22, height: 22, borderRadius: '50%',
                      background: i < 3 ? 'var(--accent-bg)' : 'var(--bg-muted)',
                      color: i < 3 ? 'var(--accent)' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                    }}>
                      {i + 1}
                    </div>

                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, paddingRight: 28 }}>
                      {skill.name}
                      {isHot && <Zap size={12} style={{ color: 'var(--amber)', marginLeft: 4, verticalAlign: 'middle' }} />}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        {skill.mentions.toLocaleString()}
                      </span>
                      <span className={`stat-change ${skill.change >= 0 ? 'up' : 'down'}`} style={{ fontSize: 11 }}>
                        <TrendIcon trend={skill.trend} change={skill.change} />
                        {skill.change > 0 ? '+' : ''}{skill.change}%
                      </span>
                    </div>

                    {/* Mini progress bar */}
                    <div className="progress-bar" style={{ height: 4 }}>
                      <div className="progress-fill" style={{ width: `${pct}%`, background: domainColor }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: domainColor, fontWeight: 500 }}>{skill.domain}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSkills.length > 8 && (
              <button className="view-more-btn" onClick={() => setShowAllSkills(!showAllSkills)}>
                {showAllSkills ? 'Show Less' : `View All ${filteredSkills.length} Skills`}
                <ChevronDown size={16} style={{ transform: showAllSkills ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            )}
          </>
        )}
      </div>

      {/* ===== CHART — Open by default ===== */}
      <div className="card">
        <div className="chart-title" style={{ marginBottom: 16 }}>Skill Mentions Chart</div>
        {classifiedSkills.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  fontSize: 13,
                  boxShadow: 'var(--shadow-md)',
                }}
                formatter={(value, name, props) => [value.toLocaleString() + ' mentions', props.payload.fullName]}
              />
              <Bar dataKey="mentions" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={DOMAIN_COLORS[entry.domain] || BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state"><p>No skill data available yet.</p></div>
        )}
      </div>
    </div>
  );
}

/* Infer domain for skills categorized as "General" */
function inferDomain(skillName) {
  const lower = (skillName || '').toLowerCase();
  const AI = ['python', 'tensorflow', 'pytorch', 'keras', 'opencv', 'nlp', 'computer vision', 'deep learning', 'machine learning', 'scikit', 'numpy', 'pandas', 'r', 'matlab', 'scipy'];
  const FULLSTACK = ['react', 'angular', 'vue', 'javascript', 'typescript', 'node', 'express', 'next', 'html', 'css', 'tailwind', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql', 'rest', 'api', 'django', 'flask', 'fastapi', 'spring', 'java', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'c#', '.net', 'flutter', 'dart'];
  const GENAI = ['langchain', 'openai', 'gpt', 'llm', 'rag', 'vector', 'hugging', 'prompt', 'fine-tun', 'embedding', 'chatgpt', 'gemini', 'claude'];
  const DEVOPS = ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'ci/cd', 'linux', 'ansible', 'helm', 'monitoring', 'grafana', 'prometheus'];
  const CYBER = ['siem', 'penetration', 'firewall', 'wireshark', 'soc', 'forensic', 'malware', 'compliance', 'nist', 'ids', 'vulnerability'];
  const DATA = ['sql', 'power bi', 'tableau', 'spark', 'hadoop', 'etl', 'statistics', 'excel', 'data warehouse', 'snowflake', 'airflow'];

  if (AI.some(k => lower.includes(k))) return 'AI/ML';
  if (GENAI.some(k => lower.includes(k))) return 'LLM/GenAI';
  if (DEVOPS.some(k => lower.includes(k))) return 'Cloud/DevOps';
  if (CYBER.some(k => lower.includes(k))) return 'Cybersecurity';
  if (DATA.some(k => lower.includes(k))) return 'Data Science';
  if (FULLSTACK.some(k => lower.includes(k))) return 'Full Stack';
  return 'General';
}
