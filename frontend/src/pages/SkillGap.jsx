import { useState, useCallback } from 'react';
import { useSkills, useSkillGap } from '../hooks/useSkills';
import { Target, Plus, X, ChevronRight, Check } from 'lucide-react';
import { userSkills as mockUserSkills } from '../data/mockData';

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
    if (s && !userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase())) {
      setUserSkills(prev => [...prev, s]);
    }
  }, [userSkills]);

  const removeSkill = useCallback((skill) => {
    setUserSkills(prev => prev.filter(s => s.toLowerCase() !== skill.toLowerCase()));
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
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1>Skill Gap Analysis</h1>
        <p>Discover exactly what you need to learn to stay competitive</p>
      </div>

      {/* Modern Stepper */}
      <div className="stepper-container" style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 12 }}>
        <button
          onClick={() => setStep(1)}
          className={`stepper-pill ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}
        >
          <span className="stepper-num">{step > 1 ? <Check size={12} /> : 1}</span>
          Your Inventory
        </button>
        <div className="stepper-line" style={{ flex: 1, height: 2, background: step > 1 ? 'var(--accent)' : 'var(--border)', borderRadius: 2 }} />
        <button
          onClick={() => setStep(2)}
          disabled={userSkills.length < 2 && step === 1}
          className={`stepper-pill ${step === 2 ? 'active' : ''}`}
          style={{ opacity: userSkills.length < 2 && step === 1 ? 0.5 : 1 }}
        >
          <span className="stepper-num">2</span>
          Market Gap Report
        </button>
      </div>

      <div className="step-content fadeIn">
        {step === 1 && (
          <div className="animation-slide-up">
            <div className="card mb-6" style={{ padding: 24 }}>
              <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Target size={18} style={{ color: 'var(--accent)' }} /> Select Your Skills
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Filter open roles by what you know, and we'll tell you what's missing. Add at least 2 skills to unlock the report.
              </p>

              <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                <input
                  className="input"
                  style={{ paddingLeft: 16 }}
                  placeholder="Type a skill..."
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                />
                <button className="btn btn-primary" onClick={handleAddSkill} disabled={!newSkill.trim()}>
                  <Plus size={16} /> Add
                </button>
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Suggested additions
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {SUGGESTED_SKILLS.filter(s => !userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase())).slice(0, 10).map(s => (
                  <button key={s} className="skill-tag" onClick={() => addSkill(s)} style={{ cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent' }}>
                    <Plus size={12} style={{ color: 'var(--text-muted)' }} /> {s}
                  </button>
                ))}
              </div>
            </div>

            {userSkills.length > 0 && (
              <div className="card mb-6" style={{ padding: 24, borderTop: '3px solid var(--green)' }}>
                <div className="chart-title" style={{ marginBottom: 16 }}>Your Inventory ({userSkills.length})</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {userSkills.map(s => (
                    <span key={s} className="skill-tag matched interactive" onClick={() => removeSkill(s)}>
                      {s} <X size={12} style={{ cursor: 'pointer', opacity: 0.6 }} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {userSkills.length >= 2 && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)} style={{ padding: '0 40px' }}>
                  Generate Gap Report <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animation-slide-up">
            <div className="card mb-6" style={{ padding: 24, background: 'linear-gradient(to right, var(--bg-card), var(--bg-secondary))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div className="chart-title" style={{ fontSize: 18 }}>Overall Market Coverage</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Based on top {topMarketSkills.length} in-demand skills</div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: coveragePercent >= 60 ? 'var(--green)' : coveragePercent >= 30 ? 'var(--amber)' : 'var(--red)', letterSpacing: '-0.02em' }}>
                  {coveragePercent}%
                </div>
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div className="progress-fill" style={{ width: `${coveragePercent}%`, background: coveragePercent >= 60 ? 'var(--green)' : coveragePercent >= 30 ? 'var(--amber)' : 'var(--red)' }} />
              </div>
            </div>

            {/* Top Missing Skills - Highlighted */}
            {missingSkills.length > 0 && (
              <div className="card mb-6" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div style={{ padding: '16px 24px', background: 'rgba(239, 68, 68, 0.05)', borderBottom: '1px solid var(--border)' }}>
                  <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Target size={18} style={{ color: 'var(--red)' }} /> Priority Skills to Learn
                  </div>
                </div>
                <div style={{ padding: 8 }}>
                  {missingSkills.slice(0, 6).map((s, i) => (
                    <div key={s.name} className="interactive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red-bg)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                          {i + 1}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.mentions} mentions</span>
                        <button className="btn btn-sm btn-ghost" onClick={() => { addSkill(s.name); setStep(1); }} style={{ color: 'var(--accent)' }}>
                          <Plus size={14} /> Learn
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
              {/* Gap by Domain */}
              {!gapLoading && gapData.length > 0 && (
                <div className="card" style={{ padding: 24 }}>
                  <div className="chart-title" style={{ marginBottom: 20 }}>Coverage by Domain</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {gapData.filter(d => d.domain).map(d => (
                      <div key={d.domain}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.domain}</span>
                          <span style={{ color: d.matchPercent >= 60 ? 'var(--green)' : d.matchPercent >= 30 ? 'var(--amber)' : 'var(--text-muted)' }}>{d.matchPercent}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: 4 }}>
                          <div className="progress-fill" style={{ width: `${d.matchPercent}%`, background: d.matchPercent >= 60 ? 'var(--green)' : d.matchPercent >= 30 ? 'var(--amber)' : 'var(--border)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Skills */}
              {matchedSkills.length > 0 && (
                <div className="card" style={{ padding: 24, borderTop: '3px solid var(--green)' }}>
                  <div className="chart-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={18} style={{ color: 'var(--green)' }} /> Skills You Have
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {matchedSkills.map(s => (
                      <span key={s.name} className="skill-tag matched" style={{ background: 'var(--green-bg)', color: 'var(--green)', borderColor: 'transparent' }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .stepper-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .stepper-pill.active {
          background: var(--accent-bg);
          border-color: rgba(99, 102, 241, 0.3);
          color: var(--accent);
        }
        .stepper-pill.completed {
          background: var(--green-bg);
          border-color: rgba(34, 197, 94, 0.3);
          color: var(--green);
        }
        .stepper-num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--border);
          color: var(--text-muted);
          font-size: 11px;
        }
        .stepper-pill.active .stepper-num {
          background: var(--accent);
          color: white;
        }
        .stepper-pill.completed .stepper-num {
          background: var(--green);
          color: white;
        }
        .animation-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
