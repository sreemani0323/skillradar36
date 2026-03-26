import { useState, useCallback } from 'react';
import { useSkills, useSkillGap } from '../hooks/useSkills';
import { userSkills as mockUserSkills } from '../data/mockData';
import { Target, Plus, X, ChevronRight, Check } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Docker',
  'AWS', 'TypeScript', 'Git', 'Machine Learning', 'Java', 'MongoDB',
  'LangChain', 'TensorFlow', 'PyTorch', 'Kubernetes',
];

export default function SkillGap() {
  const [step, setStep] = useState(1);
  const [userSkills, setUserSkills] = useState(mockUserSkills);
  const [newSkill, setNewSkill] = useState('');
  const { data: marketSkills, loading: marketLoading } = useSkills();
  const { data: gapData, loading: gapLoading } = useSkillGap(userSkills);

  const addSkill = useCallback((skill) => {
    const s = skill.trim();
    if (s && !userSkills.includes(s)) {
      setUserSkills(prev => [...prev, s]);
    }
  }, [userSkills]);

  const removeSkill = useCallback((skill) => {
    setUserSkills(prev => prev.filter(s => s !== skill));
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const topMarketSkills = (marketSkills || []).slice(0, 15);
  const matchedSkills = topMarketSkills.filter(s => userSkills.map(u => u.toLowerCase()).includes(s.name.toLowerCase()));
  const missingSkills = topMarketSkills.filter(s => !userSkills.map(u => u.toLowerCase()).includes(s.name.toLowerCase()));
  const coveragePercent = topMarketSkills.length > 0
    ? Math.round((matchedSkills.length / topMarketSkills.length) * 100)
    : 0;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Skill Gap Analysis</h1>
        <p>See how your skills compare to market demand</p>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, fontSize: 13 }}>
        <button
          onClick={() => setStep(1)}
          className={`btn btn-sm ${step === 1 ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          1. Your Skills
        </button>
        <ChevronRight size={16} style={{ alignSelf: 'center', color: 'var(--text-muted)' }} />
        <button
          onClick={() => setStep(2)}
          className={`btn btn-sm ${step === 2 ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          2. Gap Report
        </button>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <div className="card mb-4">
            <div className="chart-title">Add Your Skills</div>
            <div className="chart-subtitle">Select from suggestions or type your own</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                className="input"
                style={{ paddingLeft: 16 }}
                placeholder="Type a skill..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
              />
              <button className="btn btn-primary" onClick={handleAddSkill}><Plus size={16} /> Add</button>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {SUGGESTED_SKILLS.filter(s => !userSkills.includes(s)).slice(0, 10).map(s => (
                <button key={s} className="skill-tag" onClick={() => addSkill(s)} style={{ cursor: 'pointer', border: '1px solid var(--border)' }}>
                  <Plus size={12} /> {s}
                </button>
              ))}
            </div>
          </div>

          {userSkills.length > 0 && (
            <div className="card mb-4">
              <div className="chart-title">Your Skills ({userSkills.length})</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                {userSkills.map(s => (
                  <span key={s} className="skill-tag matched" style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                    {s} <X size={12} />
                  </span>
                ))}
              </div>
            </div>
          )}

          {userSkills.length >= 2 && (
            <button className="btn btn-primary btn-block" onClick={() => setStep(2)}>
              View Gap Report <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <div className="card mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="chart-title">Market Coverage</div>
              <span style={{ fontSize: 24, fontWeight: 700, color: coveragePercent >= 60 ? 'var(--green)' : 'var(--amber)' }}>
                {coveragePercent}%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${coveragePercent}%`, background: coveragePercent >= 60 ? 'var(--green)' : 'var(--amber)' }} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
              You know {matchedSkills.length} of the top {topMarketSkills.length} in-demand skills
            </p>
          </div>

          {/* Domain-wise gap from hook */}
          {!gapLoading && gapData.length > 0 && (
            <div className="card mb-4">
              <div className="chart-title">Gap by Domain</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {gapData.filter(d => d.domain).map(d => (
                  <div key={d.domain}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 500 }}>{d.domain}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{d.matchPercent}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${d.matchPercent}%`, background: d.matchPercent >= 60 ? 'var(--green)' : d.matchPercent >= 30 ? 'var(--amber)' : 'var(--red)' }} />
                    </div>
                    {d.missing.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                        {d.missing.slice(0, 4).map(m => (
                          <span key={m} className="skill-tag missing" style={{ fontSize: 10 }}>{m}</span>
                        ))}
                        {d.missing.length > 4 && <span className="skill-tag" style={{ opacity: 0.5, fontSize: 10 }}>+{d.missing.length - 4}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {missingSkills.length > 0 && (
            <div className="card mb-4">
              <div className="chart-title">Priority Skills to Learn</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 12 }}>
                {missingSkills.slice(0, 8).map(s => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{s.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{s.mentions} mentions</span>
                    </div>
                    <button className="btn btn-sm btn-secondary" onClick={() => addSkill(s.name)}><Plus size={14} /> Add</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedSkills.length > 0 && (
            <div className="card">
              <div className="chart-title">Skills You Have</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                {matchedSkills.map(s => (
                  <span key={s.name} className="skill-tag matched"><Check size={12} /> {s.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
