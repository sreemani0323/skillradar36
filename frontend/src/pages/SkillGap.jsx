import { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import {
  Target, CheckCircle, XCircle, ArrowRight, Sparkles, Plus, X, Search,
  TrendingUp, Award, Zap,
} from 'lucide-react';
import { domainColors, userSkills as defaultSkills } from '../data/mockData';
import { useSkillGap, useSkills } from '../hooks/useSkills';



const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'rgba(22,22,31,0.95)',
        border: '1px solid rgba(108,92,231,0.3)',
        borderRadius: '10px',
        padding: '12px 16px',
      }}>
        <p style={{ color: '#e8e6f0', fontSize: '13px', fontWeight: 600 }}>{payload[0]?.payload?.domain}</p>
        <p style={{ color: '#a29bfe', fontSize: '12px' }}>Match: <strong>{payload[0]?.value}%</strong></p>
      </div>
    );
  }
  return null;
};

export default function SkillGap() {
  const [mySkills, setMySkills] = useState(defaultSkills);
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const { data: allSkillsData } = useSkills();
  const { data: skillGapData } = useSkillGap(mySkills);
  const allAvailableSkills = allSkillsData.map(s => s.name);

  const suggestions = allAvailableSkills
    .filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !mySkills.includes(s))
    .slice(0, 8);

  const addSkill = (skill) => {
    if (!mySkills.includes(skill)) {
      setMySkills([...mySkills, skill]);
    }
    setSkillInput('');
    setShowSuggestions(false);
  };

  const removeSkill = (skill) => {
    setMySkills(mySkills.filter(s => s !== skill));
  };

  const radarData = skillGapData.map(d => ({
    domain: d.domain,
    match: d.matchPercent,
    fullMark: 100,
  }));

  const selectedGap = selectedDomain
    ? skillGapData.find(d => d.domain === selectedDomain)
    : null;

  // Top recommendation
  const topRec = skillGapData
    .filter(d => d.matchPercent < 80)
    .sort((a, b) => b.matchPercent - a.matchPercent)[0];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Skill Gap Analyzer</h1>
        <p>Enter your skills, see your match per domain, and know exactly what to learn next</p>
      </div>

      {/* My Skills Section */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>Your Skills</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{mySkills.length} skills added</div>
          </div>
          <span className="badge badge-primary"><Sparkles size={12} /> Edit anytime</span>
        </div>

        {/* Skill input */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div className="input-group">
            <input
              type="text"
              className="input"
              placeholder="Add a skill (e.g., Python, React, Docker)..."
              value={skillInput}
              onChange={(e) => { setSkillInput(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && skillInput.trim()) {
                  addSkill(skillInput.trim());
                }
              }}
              style={{ paddingLeft: '42px' }}
            />
            <Search size={16} className="input-icon" />
          </div>
          {showSuggestions && skillInput && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              marginTop: '4px',
              zIndex: 50,
              maxHeight: '200px',
              overflowY: 'auto',
            }}>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(108,92,231,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <Plus size={14} style={{ color: 'var(--accent-primary)' }} />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current skills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {mySkills.map(skill => (
            <span key={skill} className="skill-tag matched" style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)}>
              {skill} <X size={12} />
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Radar Chart */}
        <div className="glass-card chart-container">
          <div className="chart-title">Domain Match Radar</div>
          <div className="chart-subtitle">Click a domain below to see details</div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="domain"
                tick={{ fill: '#9b97b0', fontSize: 11 }}
              />
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

        {/* Domain Bars */}
        <div className="glass-card chart-container">
          <div className="chart-title">Match Score by Domain</div>
          <div className="chart-subtitle">Based on current listings vs your skills</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={skillGapData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9b97b0', fontSize: 11 }} axisLine={false} />
              <YAxis dataKey="domain" type="category" tick={{ fill: '#9b97b0', fontSize: 12 }} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="matchPercent" radius={[0, 6, 6, 0]} cursor="pointer"
                onClick={(data) => setSelectedDomain(data.domain)}
              >
                {skillGapData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={domainColors[entry.domain] || '#6c5ce7'}
                    fillOpacity={selectedDomain === entry.domain ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domain Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
        {skillGapData.map((d, i) => (
          <div
            key={d.domain}
            className={`glass-card ${selectedDomain === d.domain ? '' : ''}`}
            style={{
              padding: '20px',
              cursor: 'pointer',
              borderColor: selectedDomain === d.domain ? domainColors[d.domain] : undefined,
              animation: `fadeInUp 0.5s ease ${i * 0.08}s both`,
            }}
            onClick={() => setSelectedDomain(d.domain === selectedDomain ? null : d.domain)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{d.domain}</span>
              <span className="badge" style={{
                background: d.matchPercent >= 75 ? 'rgba(0,184,148,0.15)' : d.matchPercent >= 50 ? 'rgba(253,203,110,0.15)' : 'rgba(225,112,85,0.15)',
                color: d.matchPercent >= 75 ? '#00b894' : d.matchPercent >= 50 ? '#fdcb6e' : '#e17055',
              }}>
                {d.matchPercent}%
              </span>
            </div>

            <div className="progress-bar" style={{ marginBottom: '12px' }}>
              <div className="progress-fill" style={{
                width: `${d.matchPercent}%`,
                background: `linear-gradient(90deg, ${domainColors[d.domain]}88, ${domainColors[d.domain]})`,
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span><CheckCircle size={12} style={{ color: 'var(--accent-success)' }} /> {d.matchedSkills} matched</span>
              <span><XCircle size={12} style={{ color: 'var(--accent-danger)' }} /> {d.totalSkills - d.matchedSkills} missing</span>
            </div>

            {selectedDomain === d.domain && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--accent-danger)' }}>
                  Skills to Learn:
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {d.missing.slice(0, 5).map(s => (
                    <span key={s} className="skill-tag missing">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Top Recommendation */}
      {topRec && (
        <div className="glass-card" style={{
          padding: '24px',
          marginTop: '24px',
          borderColor: 'var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'rgba(108,92,231,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={24} color="#6c5ce7" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
              🎯 Highest ROI: Learn <span style={{ color: 'var(--accent-primary-light)' }}>{topRec.missing[0]}</span> next
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Adding this skill would boost your {topRec.domain} match from {topRec.matchPercent}% to ~{Math.min(topRec.matchPercent + 8, 100)}%.
              It appears in {allSkillsData.find(s => s.name === topRec.missing[0])?.mentions || '200+'} current listings.
            </div>
          </div>
          <button className="btn btn-primary btn-sm">
            <ArrowRight size={14} /> View Courses
          </button>
        </div>
      )}
    </div>
  );
}
