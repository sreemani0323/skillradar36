import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { ExternalLink, ChevronDown, Newspaper } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI' },
  { key: 'python', label: 'Python' },
  { key: 'react', label: 'React' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'devops', label: 'DevOps' },
  { key: 'rust', label: 'Rust' },
];

const ITEMS_PER_PAGE = 8;

export default function News() {
  const [category, setCategory] = useState('all');
  const { articles, loading } = useNews(category);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const displayed = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Tech News</h1>
        <p>Latest updates in tech, AI, frameworks, and developer tools</p>
      </div>

      {/* Category Filters */}
      <div className="filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`filter-chip ${category === cat.key ? 'active' : ''}`}
            onClick={() => { setCategory(cat.key); setVisibleCount(ITEMS_PER_PAGE); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <Newspaper size={28} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
          <p>No articles found for this category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displayed.map(article => (
            <article key={article.id} className="card interactive" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.4 }}>
                    {article.title}
                  </h3>
                  {article.summary && (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }} className="truncate" title={article.summary}>
                      {article.summary.length > 120 ? article.summary.slice(0, 120) + '...' : article.summary}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)' }}>
                    <span className="badge badge-info">{article.source}</span>
                    {article.date && <span>{article.date}</span>}
                    {article.points > 0 && <span>{article.points} points</span>}
                    {article.author && <span>by {article.author}</span>}
                  </div>
                </div>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  Read <ExternalLink size={14} />
                </a>
              </div>
            </article>
          ))}

          {hasMore && (
            <button
              className="view-more-btn"
              onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
            >
              Load More ({articles.length - visibleCount} remaining)
              <ChevronDown size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
