import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Cell, Area, AreaChart,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Briefcase, Code2, Brain, ArrowUpRight,
  Filter, Layers
} from 'lucide-react';
import { DOMAINS, domainColors } from '../data/mockData';
import { useDashboardStats, useTopSkills } from '../hooks/useDashboard';
import { useSkillTrends } from '../hooks/useSkills';
import { useSkillGap } from '../hooks/useSkills';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(22,22,31,0.95)',
        border: '1px solid rgba(108,92,231,0.3)',
        borderRadius: '10px',
        padding: '12px 16px',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ color: '#e8e6f0', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{label || payload[0]?.name}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || '#a29bfe', fontSize: '12px' }}>
            {p.name || p.dataKey}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const { stats: platformStats } = useDashboardStats();
  const { data: allSkills } = useTopSkills(selectedDomain, 30);
  const { data: trendData } = useSkillTrends();
  const { data: skillGapData } = useSkillGap(['Python', 'React', 'JavaScript', 'SQL', 'LangChain', 'Node.js', 'Docker', 'FastAPI', 'Git', 'TypeScript']);

  const barData = allSkills.slice(0, 12);

  const radarData = skillGapData.map(d => ({
    domain: d.domain,
    match: d.matchPercent,
  }));

  const miniTrend = trendData.slice(-4);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Skill Demand Dashboard</h1>
        <p>Real-time skill demand intelligence across {platformStats.platformCount} platforms</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108,92,231,0.15)' }}>
            <Briefcase size={22} color="#6c5ce7" />
          </div>
          <div className="stat-value">{platformStats.totalJobs.toLocaleString()}</div>
          <div className="stat-label">Jobs Indexed</div>
          <span className="stat-change up"><TrendingUp size={12} /> +147 this week</span>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0,206,201,0.15)' }}>
            <Code2 size={22} color="#00cec9" />
          </div>
          <div className="stat-value">{platformStats.totalSkills}</div>
          <div className="stat-label">Skills Tracked</div>
          <span className="stat-change up"><TrendingUp size={12} /> +12 new</span>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(253,121,168,0.15)' }}>
            <Layers size={22} color="#fd79a8" />
          </div>
          <div className="stat-value">{platformStats.platformCount}</div>
          <div className="stat-label">Platforms</div>
          <span className="stat-change up"><TrendingUp size={12} /> +2 added</span>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(253,203,110,0.15)' }}>
            <Brain size={22} color="#fdcb6e" />
          </div>
          <div className="stat-value">72%</div>
          <div className="stat-label">Avg. Match Score</div>
          <span className="stat-change up"><TrendingUp size={12} /> +5%</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <Filter size={16} style={{ color: 'var(--text-muted)', marginTop: '6px' }} />
        {DOMAINS.map((d) => (
          <button
            key={d}
            className={`filter-chip ${selectedDomain === d ? 'active' : ''}`}
            onClick={() => setSelectedDomain(d)}
          >
            {d !== 'All' && (
              <span style={{
                display: 'inline-block',
                width: 8, height: 8,
                borderRadius: '50%',
                background: domainColors[d] || '#6c5ce7',
                marginRight: 6,
              }} />
            )}
            {d}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Top Skills Bar Chart */}
        <div className="glass-card chart-container" style={{ gridColumn: '1 / -1' }}>
          <div className="chart-title">Top In-Demand Skills</div>
          <div className="chart-subtitle">
            Ranked by mention frequency across all scraped internship listings
            {selectedDomain !== 'All' && ` · Filtered: ${selectedDomain}`}
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#9b97b0', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: '#9b97b0', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mentions" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={domainColors[entry.domain] || '#6c5ce7'} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mini Trend Area */}
        <div className="glass-card chart-container">
          <div className="chart-title">6-Month Trend Overview</div>
          <div className="chart-subtitle">Top 5 skills demand trajectory</div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradPython" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradReact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00cec9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00cec9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradLang" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fd79a8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fd79a8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#9b97b0', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#9b97b0', fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Python" stroke="#6c5ce7" fill="url(#gradPython)" strokeWidth={2} />
              <Area type="monotone" dataKey="React" stroke="#00cec9" fill="url(#gradReact)" strokeWidth={2} />
              <Area type="monotone" dataKey="LangChain" stroke="#fd79a8" fill="url(#gradLang)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="glass-card chart-container">
          <div className="chart-title">Domain Match Radar</div>
          <div className="chart-subtitle">Your profile match % per domain</div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="domain" tick={{ fill: '#9b97b0', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: '#6c6887', fontSize: 10 }} domain={[0, 100]} />
              <Radar
                dataKey="match"
                stroke="#6c5ce7"
                fill="#6c5ce7"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Moving Skills Table */}
      <div className="glass-card chart-container" style={{ marginTop: '24px' }}>
        <div className="chart-title">Fastest Rising Skills</div>
        <div className="chart-subtitle">Skills with highest demand growth this month</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Skill</th>
              <th>Domain</th>
              <th>Mentions</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {allSkills
              .sort((a, b) => b.change - a.change)
              .slice(0, 8)
              .map((skill, i) => (
                <tr key={skill.name} style={{ animationDelay: `${i * 0.05}s` }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{i + 1}</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{skill.name}</span>
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: `${domainColors[skill.domain]}20`,
                      color: domainColors[skill.domain],
                    }}>
                      {skill.domain}
                    </span>
                  </td>
                  <td>{skill.mentions.toLocaleString()}</td>
                  <td>
                    <span className={`stat-change ${skill.trend}`}>
                      {skill.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {skill.change > 0 ? '+' : ''}{skill.change}%
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
