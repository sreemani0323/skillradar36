import { useState, useRef } from 'react';
import { Upload, FileText, Download, Plus, X, Trash2, User, Mail, GraduationCap, Briefcase, Code2 } from 'lucide-react';

/* Client-side skill extraction from text */
const SKILL_KEYWORDS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Docker',
  'AWS', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Java', 'C++', 'C#', 'Go',
  'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TensorFlow', 'PyTorch', 'Pandas',
  'NumPy', 'Scikit-learn', 'LangChain', 'OpenAI', 'Git', 'Linux', 'Redis',
  'GraphQL', 'REST', 'API', 'HTML', 'CSS', 'Tailwind', 'Next.js', 'Express',
  'Django', 'Flask', 'FastAPI', 'Spring', 'Angular', 'Vue', 'Machine Learning',
  'Deep Learning', 'NLP', 'Computer Vision', 'Data Science', 'DevOps', 'CI/CD',
  'Terraform', 'Jenkins', 'Figma', 'Firebase', 'Supabase', 'Azure', 'GCP',
];

function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter(s => lower.includes(s.toLowerCase()));
}

const EMPTY_RESUME = {
  name: '', email: '', phone: '', summary: '',
  education: [{ institution: '', degree: '', year: '' }],
  experience: [{ company: '', role: '', duration: '', description: '' }],
  skills: [],
  projects: [{ name: '', description: '' }],
};

export default function Resume() {
  const [tab, setTab] = useState('extractor');
  const [extractedData, setExtractedData] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [resumeData, setResumeData] = useState(EMPTY_RESUME);
  const fileRef = useRef(null);

  /* ========== EXTRACTOR ========== */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setExtractedData(null);

    try {
      const text = await file.text(); // Works for plain text / basic PDF text layer
      const skills = extractSkillsFromText(text);

      // Simple extraction patterns
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      const phoneMatch = text.match(/[\+]?\d{10,13}/);

      setExtractedData({
        fileName: file.name,
        textLength: text.length,
        skills,
        email: emailMatch?.[0] || '',
        phone: phoneMatch?.[0] || '',
        rawPreview: text.slice(0, 500),
      });
    } catch (err) {
      setExtractedData({ error: 'Could not read file. Try a .txt or plain text PDF.' });
    }
    setExtracting(false);
  };

  /* ========== BUILDER ========== */
  const updateField = (field, value) => setResumeData(prev => ({ ...prev, [field]: value }));

  const addArrayItem = (field, template) => {
    setResumeData(prev => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeArrayItem = (field, index) => {
    setResumeData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? { ...item, [key]: value } : item),
    }));
  };

  const addSkill = (skill) => {
    if (skill && !resumeData.skills.includes(skill)) {
      updateField('skills', [...resumeData.skills, skill]);
    }
  };

  const downloadResume = () => {
    const d = resumeData;
    let html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body{font-family:Inter,Arial,sans-serif;max-width:700px;margin:0 auto;padding:40px;color:#1a1a2e;font-size:13px;line-height:1.5}
  h1{font-size:22px;margin-bottom:2px}
  h2{font-size:14px;text-transform:uppercase;letter-spacing:0.05em;border-bottom:2px solid #5046e5;padding-bottom:4px;margin:18px 0 8px;color:#5046e5}
  .contact{font-size:12px;color:#666;margin-bottom:4px}
  .entry{margin-bottom:10px}
  .entry-title{font-weight:600;font-size:13px}
  .entry-sub{font-size:12px;color:#666}
  .skills{display:flex;flex-wrap:wrap;gap:4px}
  .skill{padding:3px 10px;background:#f0eef8;border-radius:20px;font-size:11px;color:#5046e5}
</style></head><body>
  <h1>${d.name || 'Your Name'}</h1>
  <div class="contact">${[d.email, d.phone].filter(Boolean).join(' | ')}</div>
  ${d.summary ? `<p style="margin-top:8px">${d.summary}</p>` : ''}
  <h2>Education</h2>
  ${d.education.filter(e => e.institution).map(e => `<div class="entry"><div class="entry-title">${e.institution}</div><div class="entry-sub">${e.degree} ${e.year ? `(${e.year})` : ''}</div></div>`).join('')}
  <h2>Experience</h2>
  ${d.experience.filter(e => e.company).map(e => `<div class="entry"><div class="entry-title">${e.role} — ${e.company}</div><div class="entry-sub">${e.duration}</div><p>${e.description}</p></div>`).join('')}
  <h2>Skills</h2>
  <div class="skills">${d.skills.map(s => `<span class="skill">${s}</span>`).join('')}</div>
  ${d.projects.some(p => p.name) ? `<h2>Projects</h2>${d.projects.filter(p => p.name).map(p => `<div class="entry"><div class="entry-title">${p.name}</div><p>${p.description}</p></div>`).join('')}` : ''}
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(d.name || 'resume').replace(/\s+/g, '_')}_resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [newSkill, setNewSkill] = useState('');

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Resume Tools</h1>
        <p>Extract skills from your resume or build a new one</p>
      </div>

      {/* Tabs */}
      <div className="filter-bar" style={{ marginBottom: 24 }}>
        <button className={`filter-chip ${tab === 'extractor' ? 'active' : ''}`} onClick={() => setTab('extractor')}>
          <Upload size={14} /> Skill Extractor
        </button>
        <button className={`filter-chip ${tab === 'builder' ? 'active' : ''}`} onClick={() => setTab('builder')}>
          <FileText size={14} /> Resume Builder
        </button>
      </div>

      {/* ========== EXTRACTOR TAB ========== */}
      {tab === 'extractor' && (
        <div>
          <div className="card mb-4" style={{ textAlign: 'center', padding: 32 }}>
            <Upload size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Upload Your Resume</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Supports .txt files. PDF parsing available via server.</p>
            <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
            <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Choose File
            </button>
          </div>

          {extracting && (
            <div className="card mb-4">
              <div className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-md)' }} />
            </div>
          )}

          {extractedData && !extractedData.error && (
            <div className="card mb-4">
              <div className="chart-title">Extraction Results</div>
              <div className="chart-subtitle">{extractedData.fileName}</div>

              {extractedData.email && (
                <div style={{ fontSize: 13, marginBottom: 8 }}>
                  <strong>Email:</strong> {extractedData.email}
                </div>
              )}
              {extractedData.phone && (
                <div style={{ fontSize: 13, marginBottom: 12 }}>
                  <strong>Phone:</strong> {extractedData.phone}
                </div>
              )}

              <div className="chart-title" style={{ marginTop: 16 }}>Skills Found ({extractedData.skills.length})</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {extractedData.skills.length > 0 ? (
                  extractedData.skills.map(s => <span key={s} className="skill-tag matched">{s}</span>)
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No known skills detected. Try a different file format.</p>
                )}
              </div>

              {extractedData.skills.length > 0 && (
                <button className="btn btn-secondary btn-block" style={{ marginTop: 16 }} onClick={() => {
                  setResumeData(prev => ({
                    ...prev,
                    skills: [...new Set([...prev.skills, ...extractedData.skills])],
                    email: extractedData.email || prev.email,
                  }));
                  setTab('builder');
                }}>
                  Use These Skills in Resume Builder
                </button>
              )}
            </div>
          )}

          {extractedData?.error && (
            <div className="card" style={{ padding: '16px 20px', background: 'var(--red-bg)', color: 'var(--red)', fontSize: 13, borderRadius: 'var(--radius-md)' }}>
              {extractedData.error}
            </div>
          )}
        </div>
      )}

      {/* ========== BUILDER TAB ========== */}
      {tab === 'builder' && (
        <div>
          {/* Personal Info */}
          <div className="card mb-4">
            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={16} /> Personal Info</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 12 }}>
              <input className="input" style={{ paddingLeft: 16 }} placeholder="Full Name" value={resumeData.name} onChange={e => updateField('name', e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input className="input" style={{ paddingLeft: 16 }} placeholder="Email" value={resumeData.email} onChange={e => updateField('email', e.target.value)} />
                <input className="input" style={{ paddingLeft: 16 }} placeholder="Phone" value={resumeData.phone} onChange={e => updateField('phone', e.target.value)} />
              </div>
              <textarea className="input" style={{ paddingLeft: 16, minHeight: 60, resize: 'vertical' }} placeholder="Professional Summary (optional)" value={resumeData.summary} onChange={e => updateField('summary', e.target.value)} />
            </div>
          </div>

          {/* Education */}
          <div className="card mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><GraduationCap size={16} /> Education</div>
              <button className="btn btn-ghost btn-sm" onClick={() => addArrayItem('education', { institution: '', degree: '', year: '' })}><Plus size={14} /></button>
            </div>
            {resumeData.education.map((edu, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginTop: 12, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input className="input" style={{ paddingLeft: 16 }} placeholder="Institution" value={edu.institution} onChange={e => updateArrayItem('education', i, 'institution', e.target.value)} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 8 }}>
                    <input className="input" style={{ paddingLeft: 16 }} placeholder="Degree" value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} />
                    <input className="input" style={{ paddingLeft: 16 }} placeholder="Year" value={edu.year} onChange={e => updateArrayItem('education', i, 'year', e.target.value)} />
                  </div>
                </div>
                {resumeData.education.length > 1 && (
                  <button className="btn btn-icon btn-ghost" onClick={() => removeArrayItem('education', i)}><Trash2 size={14} /></button>
                )}
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="card mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Briefcase size={16} /> Experience</div>
              <button className="btn btn-ghost btn-sm" onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', description: '' })}><Plus size={14} /></button>
            </div>
            {resumeData.experience.map((exp, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginTop: 12, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input className="input" style={{ paddingLeft: 16 }} placeholder="Company" value={exp.company} onChange={e => updateArrayItem('experience', i, 'company', e.target.value)} />
                    <input className="input" style={{ paddingLeft: 16 }} placeholder="Role" value={exp.role} onChange={e => updateArrayItem('experience', i, 'role', e.target.value)} />
                  </div>
                  <input className="input" style={{ paddingLeft: 16 }} placeholder="Duration (e.g. Jan 2024 – Mar 2024)" value={exp.duration} onChange={e => updateArrayItem('experience', i, 'duration', e.target.value)} />
                  <textarea className="input" style={{ paddingLeft: 16, minHeight: 50, resize: 'vertical' }} placeholder="Description" value={exp.description} onChange={e => updateArrayItem('experience', i, 'description', e.target.value)} />
                </div>
                {resumeData.experience.length > 1 && (
                  <button className="btn btn-icon btn-ghost" onClick={() => removeArrayItem('experience', i)}><Trash2 size={14} /></button>
                )}
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="card mb-4">
            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Code2 size={16} /> Skills</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 12 }}>
              <input className="input" style={{ paddingLeft: 16 }} placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { addSkill(newSkill); setNewSkill(''); } }} />
              <button className="btn btn-primary" onClick={() => { addSkill(newSkill); setNewSkill(''); }}><Plus size={16} /></button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {resumeData.skills.map(s => (
                <span key={s} className="skill-tag matched" style={{ cursor: 'pointer' }} onClick={() => updateField('skills', resumeData.skills.filter(sk => sk !== s))}>
                  {s} <X size={12} />
                </span>
              ))}
            </div>
          </div>

          {/* Download */}
          <button className="btn btn-primary btn-block btn-lg" onClick={downloadResume}>
            <Download size={18} /> Download Resume (HTML)
          </button>
        </div>
      )}
    </div>
  );
}
