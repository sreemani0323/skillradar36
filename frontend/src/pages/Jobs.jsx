import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { Search, MapPin, Building2, ExternalLink, ChevronDown, SlidersHorizontal, X } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function Jobs() {
  const { data: jobs, loading } = useJobs();
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const domains = ['All', ...new Set((jobs || []).map(j => j.domain).filter(Boolean))];

  const filtered = (jobs || []).filter(job => {
    const matchSearch = !search ||
      (job.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(search.toLowerCase());
    const matchDomain = domain === 'All' || job.domain === domain;
    return matchSearch && matchDomain;
  });

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Jobs</h1>
        <p>{filtered.length} listings from {new Set((jobs || []).map(j => j.platform)).size} platforms</p>
      </div>

      {/* Search + Filter Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div className="input-group" style={{ flex: 1 }}>
          <Search size={16} className="input-icon" />
          <input
            className="input"
            placeholder="Search jobs or companies..."
            value={search}
            onChange={e => { setSearch(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
          />
        </div>
        <button
          className={`btn btn-secondary btn-icon`}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
          style={showFilters ? { background: 'var(--accent-bg)', borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
        >
          {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
        </button>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="filter-bar">
          {domains.map(d => (
            <button
              key={d}
              className={`filter-chip ${domain === d ? 'active' : ''}`}
              onClick={() => { setDomain(d); setVisibleCount(ITEMS_PER_PAGE); }}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Job Cards */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <p>No jobs match your search.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displayed.map((job, idx) => (
            <div key={job.id || idx} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="truncate" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                    {job.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={13} />
                      {job.company}
                    </span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={13} />
                      {job.location || 'Remote'}
                    </span>
                  </div>
                </div>

                {(job.applyUrl || job.apply_url) && (
                  <a
                    href={job.applyUrl || job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    Apply <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                {job.domain && <span className="badge badge-primary">{job.domain}</span>}
                {job.platform && <span className="badge badge-info">{job.platform}</span>}
                {job.matchScore != null && (
                  <span className={`badge ${job.matchScore >= 70 ? 'badge-success' : 'badge-warning'}`}>
                    {job.matchScore}% match
                  </span>
                )}
              </div>

              {job.skills && job.skills.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                  {job.skills.slice(0, 4).map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="skill-tag" style={{ opacity: 0.6 }}>+{job.skills.length - 4}</span>
                  )}
                </div>
              )}
            </div>
          ))}

          {hasMore && (
            <button
              className="view-more-btn"
              onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
            >
              Load More ({filtered.length - visibleCount} remaining)
              <ChevronDown size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
