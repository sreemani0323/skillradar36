import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';
import { TrendingUp, Search, Eye, EyeOff, Info } from 'lucide-react';
import { domainColors, DOMAINS } from '../data/mockData';

const SKILL_COLORS = {
  Python: '#6c5ce7',
  React: '#00cec9',
  LangChain: '#fd79a8',
  Docker: '#74b9ff',
  SQL: '#fdcb6e',
  TensorFlow: '#e17055',
  PyTorch: '#a29bfe',
  'Node.js': '#55efc4',
  TypeScript: '#00b894',
  AWS: '#fab1a0',
  'OpenAI API': '#ff7675',
  'Hugging Face': '#dfe6e9',
};

const allSkillNames = Object.keys(SKILL_COLORS);

const extendedTrendData = [
  { month: 'Aug 24', Python: 1420, React: 1300, LangChain: 180, Docker: 720, SQL: 930, TensorFlow: 1100, PyTorch: 690, 'Node.js': 790, TypeScript: 580, AWS: 740, 'OpenAI API': 300, 'Hugging Face': 250 },
  { month: 'Sep 24', Python: 1480, React: 1340, LangChain: 240, Docker: 750, SQL: 950, TensorFlow: 1140, PyTorch: 720, 'Node.js': 800, TypeScript: 610, AWS: 760, 'OpenAI API': 380, 'Hugging Face': 310 },
  { month: 'Oct 24', Python: 1540, React: 1380, LangChain: 320, Docker: 780, SQL: 980, TensorFlow: 1160, PyTorch: 760, 'Node.js': 810, TypeScript: 650, AWS: 775, 'OpenAI API': 430, 'Hugging Face': 370 },
  { month: 'Nov 24', Python: 1590, React: 1420, LangChain: 450, Docker: 810, SQL: 1010, TensorFlow: 1180, PyTorch: 790, 'Node.js': 820, TypeScript: 680, AWS: 790, 'OpenAI API': 490, 'Hugging Face': 410 },
  { month: 'Dec 24', Python: 1620, React: 1460, LangChain: 580, Docker: 850, SQL: 1020, TensorFlow: 1200, PyTorch: 810, 'Node.js': 825, TypeScript: 710, AWS: 800, 'OpenAI API': 540, 'Hugging Face': 450 },
  { month: 'Jan 25', Python: 1680, React: 1510, LangChain: 690, Docker: 890, SQL: 1050, TensorFlow: 1210, PyTorch: 840, 'Node.js': 830, TypeScript: 730, AWS: 805, 'OpenAI API': 590, 'Hugging Face': 490 },
  { month: 'Feb 25', Python: 1750, React: 1570, LangChain: 810, Docker: 940, SQL: 1080, TensorFlow: 1205, PyTorch: 860, 'Node.js': 838, TypeScript: 745, AWS: 810, 'OpenAI API': 625, 'Hugging Face': 520 },
  { month: 'Mar 25', Python: 1847, React: 1623, LangChain: 934, Docker: 987, SQL: 1104, TensorFlow: 1205, PyTorch: 876, 'Node.js': 843, TypeScript: 756, AWS: 812, 'OpenAI API': 654, 'Hugging Face': 543 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'rgba(22,22,31,0.95)',
        border: '1px solid rgba(108,92,231,0.3)',
        borderRadius: '10px',
        padding: '12px 16px',
        backdropFilter: 'blur(10px)',
        maxHeight: '300px',
        overflowY: 'auto',
      }}>
        <p style={{ color: '#e8e6f0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{label}</p>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
            <span style={{ color: '#9b97b0', fontSize: '12px', flex: 1 }}>{p.dataKey}</span>
            <span style={{ color: '#e8e6f0', fontSize: '12px', fontWeight: 600 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Trends() {
  const [visibleSkills, setVisibleSkills] = useState(['Python', 'React', 'LangChain', 'Docker', 'SQL']);
  const [searchTerm, setSearchTerm] = useState('');
  const [chartType, setChartType] = useState('area');

  const toggleSkill = (skill) => {
    setVisibleSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filteredSkillNames = allSkillNames.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Skill Trend Tracker</h1>
        <p>Historical demand curves for 500+ skills across multiple scrape cycles</p>
      </div>

      {/* Info card */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Info size={18} color="var(--accent-info)" />
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Each data point represents a snapshot from a scheduled scrape cycle. Trends show how skill demand evolves over months — data no other free platform provides.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        {/* Chart */}
        <div className="glass-card chart-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div className="chart-title">Demand Over Time</div>
              <div className="chart-subtitle">{visibleSkills.length} skill{visibleSkills.length !== 1 ? 's' : ''} selected · Aug 2024 – Mar 2025</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`filter-chip ${chartType === 'area' ? 'active' : ''}`}
                onClick={() => setChartType('area')}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >Area</button>
              <button
                className={`filter-chip ${chartType === 'line' ? 'active' : ''}`}
                onClick={() => setChartType('line')}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >Line</button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'area' ? (
              <AreaChart data={extendedTrendData}>
                <defs>
                  {visibleSkills.map(skill => (
                    <linearGradient key={skill} id={`grad-${skill.replace(/[\s/.]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={SKILL_COLORS[skill] || '#6c5ce7'} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={SKILL_COLORS[skill] || '#6c5ce7'} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#9b97b0', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: '#9b97b0', fontSize: 11 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {visibleSkills.map(skill => (
                  <Area
                    key={skill}
                    type="monotone"
                    dataKey={skill}
                    stroke={SKILL_COLORS[skill] || '#6c5ce7'}
                    fill={`url(#grad-${skill.replace(/[\s/.]/g, '')})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: SKILL_COLORS[skill] || '#6c5ce7' }}
                  />
                ))}
              </AreaChart>
            ) : (
              <LineChart data={extendedTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#9b97b0', fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: '#9b97b0', fontSize: 11 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                {visibleSkills.map(skill => (
                  <Line
                    key={skill}
                    type="monotone"
                    dataKey={skill}
                    stroke={SKILL_COLORS[skill] || '#6c5ce7'}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px', justifyContent: 'center' }}>
            {visibleSkills.map(skill => (
              <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: SKILL_COLORS[skill] || '#6c5ce7' }} />
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Skill picker sidebar */}
        <div className="glass-card" style={{ padding: '20px', alignSelf: 'start', position: 'sticky', top: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Toggle Skills</div>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <input
              type="text"
              className="input"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            <Search size={16} className="input-icon" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '450px', overflowY: 'auto' }}>
            {filteredSkillNames.map(skill => {
              const isVisible = visibleSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: isVisible ? 'rgba(108,92,231,0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: isVisible ? 'rgba(108,92,231,0.3)' : 'transparent',
                    borderRadius: '8px',
                    color: isVisible ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: SKILL_COLORS[skill] || '#6c5ce7',
                    opacity: isVisible ? 1 : 0.4,
                  }} />
                  <span style={{ flex: 1 }}>{skill}</span>
                  {isVisible ? <Eye size={14} /> : <EyeOff size={14} style={{ opacity: 0.4 }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
