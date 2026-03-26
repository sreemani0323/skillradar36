import { useState, useEffect } from 'react';

const HN_API = 'https://hn.algolia.com/api/v1/search';
const DEVTO_API = 'https://dev.to/api/articles';

const CATEGORY_QUERIES = {
  all: 'programming OR developer OR software',
  ai: 'artificial intelligence OR machine learning OR deep learning OR GPT OR LLM',
  python: 'python programming',
  react: 'react framework OR reactjs',
  javascript: 'javascript OR typescript OR nodejs',
  devops: 'devops OR docker OR kubernetes OR cloud',
  rust: 'rust programming language',
};

/**
 * Fetch tech news from Hacker News + Dev.to
 */
export function useNews(category = 'all') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchNews() {
      setLoading(true);
      const results = [];

      // Hacker News
      try {
        const query = CATEGORY_QUERIES[category] || CATEGORY_QUERIES.all;
        const hnResp = await fetch(`${HN_API}?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=15&numericFilters=points>10`);
        if (hnResp.ok) {
          const hnData = await hnResp.json();
          (hnData.hits || []).forEach(hit => {
            // Skip items without valid URL
            const url = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
            if (!hit.title) return;
            results.push({
              id: `hn-${hit.objectID}`,
              title: hit.title,
              url,
              source: 'Hacker News',
              date: hit.created_at ? new Date(hit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
              timestamp: hit.created_at ? new Date(hit.created_at).getTime() : 0,
              points: hit.points || 0,
              comments: hit.num_comments || 0,
              summary: '',
            });
          });
        }
      } catch (e) {
        console.warn('HN fetch failed:', e);
      }

      // Dev.to
      try {
        const tag = category === 'all' ? '' : `&tag=${category}`;
        const devResp = await fetch(`${DEVTO_API}?per_page=12&top=7${tag}`);
        if (devResp.ok) {
          const devData = await devResp.json();
          (devData || []).forEach(item => {
            if (!item.title || !item.url) return;
            results.push({
              id: `dev-${item.id}`,
              title: item.title,
              url: item.url,
              source: 'Dev.to',
              date: item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
              timestamp: item.published_at ? new Date(item.published_at).getTime() : 0,
              points: item.positive_reactions_count || 0,
              comments: item.comments_count || 0,
              summary: item.description || '',
              author: item.user?.name || '',
            });
          });
        }
      } catch (e) {
        console.warn('Dev.to fetch failed:', e);
      }

      // Sort by recency first, then engagement
      results.sort((a, b) => b.timestamp - a.timestamp);

      if (!cancelled) {
        setArticles(results);
        setLoading(false);
      }
    }

    fetchNews();
    return () => { cancelled = true; };
  }, [category]);

  return { articles, loading };
}
