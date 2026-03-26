import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { ExternalLink, ChevronDown, Newspaper, MessageSquare, ThumbsUp, Clock } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI / ML' },
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
        <p>Curated headlines from Hacker News & Dev.to</p>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <Newspaper size={28} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
          <p>No articles found. Try a different category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displayed.map(article => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card interactive"
              style={{ padding: 16, textDecoration: 'none', display: 'block', color: 'inherit' }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                {article.title}
                <ExternalLink size={12} style={{ marginLeft: 6, opacity: 0.4, verticalAlign: 'middle' }} />
              </h3>
              {article.summary && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                  {article.summary.length > 140 ? article.summary.slice(0, 140) + '...' : article.summary}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-muted)' }}>
                <span className={`badge ${article.source === 'Hacker News' ? 'badge-warning' : 'badge-info'}`}>{article.source}</span>
                {article.date && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} /> {article.date}</span>}
                {article.points > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><ThumbsUp size={11} /> {article.points}</span>}
                {article.comments > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MessageSquare size={11} /> {article.comments}</span>}
                {article.author && <span>by {article.author}</span>}
              </div>
            </a>
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
