import { useState, useMemo } from 'react';
import { useJobs } from '../hooks/useJobs';
import { Search, MapPin, Building2, ExternalLink, ChevronDown, SlidersHorizontal, X, Clock, Calendar, ArrowUpDown } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const TIME_FILTERS = [
  { key: 'all', label: 'All Time' },
  { key: '24h', label: 'Last 24h' },
  { key: '3d', label: 'Last 3 Days' },
  { key: '7d', label: 'Last Week' },
  { key: '30d', label: 'Last Month' },
];

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'match', label: 'Best Match' },
];

const DOMAIN_COLORS = {
  'AI/ML': '#6366f1',
  'Full Stack': '#06b6d4',
  'Data Science': '#f59e0b',
  'LLM/GenAI': '#ec4899',
  'Cybersecurity': '#ef4444',
  'Cloud/DevOps': '#3b82f6',
};

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  if (diffD < 30) return `${Math.floor(diffD / 7)}w ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Jobs() {
  const { data: jobs, loading } = useJobs();
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const domains = useMemo(() => ['All', ...new Set((jobs || []).map(j => j.domain).filter(Boolean))], [jobs]);
  const jobTypes = useMemo(() => ['All', ...new Set((jobs || []).map(j => j.type || j.job_type).filter(Boolean))], [jobs]);
  const platforms = useMemo(() => new Set((jobs || []).map(j => j.platform)).size, [jobs]);

  const filtered = useMemo(() => {
    let result = (jobs || []);

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(job =>
        (job.title || '').toLowerCase().includes(q) ||
        (job.company || '').toLowerCase().includes(q) ||
        (job.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }

    // Domain
    if (domain !== 'All') result = result.filter(j => j.domain === domain);

    // Job Type
    if (jobType !== 'All') result = result.filter(j => (j.type || j.job_type) === jobType);

    // Time filter
    if (timeFilter !== 'all') {
      const now = Date.now();
      const thresholds = { '24h': 86400000, '3d': 259200000, '7d': 604800000, '30d': 2592000000 };
      const threshold = thresholds[timeFilter];
      result = result.filter(j => {
        const posted = new Date(j.postedAt || j.posted_at).getTime();
        return now - posted <= threshold;
      });
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.postedAt || b.posted_at) - new Date(a.postedAt || a.posted_at));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.postedAt || a.posted_at) - new Date(b.postedAt || b.posted_at));
    } else if (sortBy === 'match') {
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return result;
  }, [jobs, search, domain, jobType, timeFilter, sortBy]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const activeFilters = [domain !== 'All', jobType !== 'All', timeFilter !== 'all'].filter(Boolean).length;

  const clearFilters = () => {
    setDomain('All');
    setJobType('All');
    setTimeFilter('all');
    setSortBy('newest');
    setSearch('');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Jobs</h1>
        <p>{filtered.length} listings from {platforms} platforms</p>
      </div>

      {/* Search + Filter Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div className="input-group" style={{ flex: 1 }}>
          <Search size={16} className="input-icon" />
          <input
            className="input"
            placeholder="Search by title, company, or skill..."
            value={search}
            onChange={e => { setSearch(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
          />
        </div>
        <button
          className="btn btn-secondary btn-icon"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
          style={showFilters || activeFilters > 0 ? { background: 'var(--accent-bg)', borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
        >
          {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
          {activeFilters > 0 && !showFilters && (
            <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="card mb-4" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Filters</span>
            {activeFilters > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ color: 'var(--red)', fontSize: 12 }}>
                Clear All
              </button>
            )}
          </div>

          {/* Time Filter */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} /> TIME POSTED
            </div>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              {TIME_FILTERS.map(t => (
                <button
                  key={t.key}
                  className={`filter-chip ${timeFilter === t.key ? 'active' : ''}`}
                  onClick={() => { setTimeFilter(t.key); setVisibleCount(ITEMS_PER_PAGE); }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Filter */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>DOMAIN</div>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              {domains.map(d => (
                <button
                  key={d}
                  className={`filter-chip ${domain === d ? 'active' : ''}`}
                  onClick={() => { setDomain(d); setVisibleCount(ITEMS_PER_PAGE); }}
                  style={domain === d && d !== 'All' ? { borderColor: DOMAIN_COLORS[d], color: DOMAIN_COLORS[d] } : {}}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Job Type Filter */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>JOB TYPE</div>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              {jobTypes.map(t => (
                <button
                  key={t}
                  className={`filter-chip ${jobType === t ? 'active' : ''}`}
                  onClick={() => { setJobType(t); setVisibleCount(ITEMS_PER_PAGE); }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpDown size={12} /> SORT BY
            </div>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              {SORT_OPTIONS.map(s => (
                <button
                  key={s.key}
                  className={`filter-chip ${sortBy === s.key ? 'active' : ''}`}
                  onClick={() => setSortBy(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Job Cards */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>No jobs match your filters.</p>
            {activeFilters > 0 && (
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displayed.map((job, idx) => {
            const domColor = DOMAIN_COLORS[job.domain] || '#9ca3af';
            return (
              <div key={job.id || idx} className="card interactive" style={{ padding: 16, borderLeft: `3px solid ${domColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="truncate" style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                      {job.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Building2 size={13} /> {job.company}
                      </span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} /> {job.location || 'Remote'}
                      </span>
                      {(job.postedAt || job.posted_at) && (
                        <>
                          <span>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                            <Clock size={12} /> {formatTimeAgo(job.postedAt || job.posted_at)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {(job.applyUrl || job.apply_url) && (job.applyUrl || job.apply_url) !== '#' && (
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
                  {job.domain && <span className="badge badge-primary" style={{ borderColor: domColor, color: domColor, background: `${domColor}10` }}>{job.domain}</span>}
                  {(job.type || job.job_type) && <span className="badge badge-info">{job.type || job.job_type}</span>}
                  {job.platform && <span className="badge" style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>{job.platform}</span>}
                  {job.matchScore != null && job.matchScore > 0 && (
                    <span className={`badge ${job.matchScore >= 70 ? 'badge-success' : 'badge-warning'}`}>
                      {job.matchScore}% match
                    </span>
                  )}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                    {job.skills.slice(0, 5).map(s => (
                      <span key={s} className="skill-tag">{s}</span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="skill-tag" style={{ opacity: 0.5 }}>+{job.skills.length - 5}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

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
