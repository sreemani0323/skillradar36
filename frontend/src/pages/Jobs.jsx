import { useState, useMemo } from 'react';
import {
  Search, Filter, ExternalLink, MapPin, Briefcase, Clock,
  ChevronDown, ChevronUp, Star, Bookmark, ArrowUpDown,
} from 'lucide-react';
import { DOMAINS, PLATFORMS, domainColors } from '../data/mockData';
import { useJobs } from '../hooks/useJobs';

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortField, setSortField] = useState('matchScore');
  const [sortDir, setSortDir] = useState('desc');
  const [savedJobs, setSavedJobs] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);

  const { data: jobsData, loading } = useJobs({
    domain: domainFilter,
    type: typeFilter,
    search: searchTerm,
    userSkills: ['Python', 'React', 'JavaScript', 'SQL', 'LangChain', 'Node.js', 'Docker', 'FastAPI', 'Git', 'TypeScript'],
  });

  const types = ['All', 'Remote', 'Hybrid', 'On-site'];

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filteredJobs = useMemo(() => {
    return [...jobsData]
      .sort((a, b) => {
        const modifier = sortDir === 'asc' ? 1 : -1;
        if (sortField === 'matchScore') return (a.matchScore - b.matchScore) * modifier;
        if (sortField === 'postedAt') return (new Date(a.postedAt) - new Date(b.postedAt)) * modifier;
        if (sortField === 'title') return a.title.localeCompare(b.title) * modifier;
        return 0;
      });
  }, [jobsData, sortField, sortDir]);

  const toggleSave = (jobId) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const getMatchColor = (score) => {
    if (score >= 80) return '#00b894';
    if (score >= 60) return '#fdcb6e';
    if (score >= 40) return '#e17055';
    return '#d63031';
  };

  const daysSince = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff}d ago`;
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Jobs Browser</h1>
        <p>All internships from 20+ platforms in one searchable, filterable view</p>
      </div>

      {/* Search & Filters */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="input-group" style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              className="input"
              placeholder="Search by title, company, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '42px' }}
            />
            <Search size={16} className="input-icon" />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)', marginTop: '10px' }} />
            {DOMAINS.map(d => (
              <button
                key={d}
                className={`filter-chip ${domainFilter === d ? 'active' : ''}`}
                onClick={() => setDomainFilter(d)}
              >{d}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Type:</span>
          {types.map(t => (
            <button
              key={t}
              className={`filter-chip ${typeFilter === t ? 'active' : ''}`}
              onClick={() => setTypeFilter(t)}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >{t}</button>
          ))}
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th onClick={() => toggleSort('title')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Role <ArrowUpDown size={12} />
                </span>
              </th>
              <th>Company</th>
              <th>Domain</th>
              <th>Location</th>
              <th>Skills</th>
              <th onClick={() => toggleSort('matchScore')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Match <ArrowUpDown size={12} />
                </span>
              </th>
              <th onClick={() => toggleSort('postedAt')} style={{ cursor: 'pointer' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Posted <ArrowUpDown size={12} />
                </span>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, i) => (
              <tr key={job.id} style={{ animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
                <td>
                  <button
                    onClick={() => toggleSave(job.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <Bookmark
                      size={16}
                      fill={savedJobs.includes(job.id) ? '#fdcb6e' : 'none'}
                      color={savedJobs.includes(job.id) ? '#fdcb6e' : 'var(--text-muted)'}
                    />
                  </button>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{job.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>via {job.platform}</div>
                </td>
                <td style={{ fontWeight: 500 }}>{job.company}</td>
                <td>
                  <span className="badge" style={{
                    background: `${domainColors[job.domain]}20`,
                    color: domainColors[job.domain],
                  }}>{job.domain}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    {job.location}
                  </div>
                  <span className="badge" style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    marginTop: '2px',
                    background: job.type === 'Remote' ? 'rgba(0,184,148,0.1)' : 'rgba(255,255,255,0.05)',
                    color: job.type === 'Remote' ? '#00b894' : 'var(--text-muted)',
                  }}>{job.type}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '200px' }}>
                    {job.skills.slice(0, 3).map(s => (
                      <span key={s} className="skill-tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{s}</span>
                    ))}
                    {job.skills.length > 3 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+{job.skills.length - 3}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `conic-gradient(${getMatchColor(job.matchScore)} ${job.matchScore * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: getMatchColor(job.matchScore),
                    }}>
                      {job.matchScore}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    {daysSince(job.postedAt)}
                  </div>
                </td>
                <td>
                  <a
                    href={job.applyUrl}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Apply <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredJobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Briefcase size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
            <div style={{ fontSize: '15px', fontWeight: 500 }}>No jobs found</div>
            <div style={{ fontSize: '13px' }}>Try adjusting your filters or search terms</div>
          </div>
        )}
      </div>
    </div>
  );
}
