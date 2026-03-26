import { useState, useEffect } from 'react';

const HN_API = 'https://hn.algolia.com/api/v1/search';
const DEVTO_API = 'https://dev.to/api/articles';

const TECH_TAGS = ['ai', 'machine learning', 'react', 'python', 'javascript', 'typescript', 'docker', 'kubernetes', 'llm', 'gpt', 'rust', 'golang', 'nextjs', 'node', 'aws', 'devops', 'framework', 'programming'];

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

      try {
        // Hacker News — top tech stories
        const query = category === 'all' ? 'programming' : category;
        const hnResp = await fetch(`${HN_API}?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=15`);
        const hnData = await hnResp.json();

        (hnData.hits || []).forEach(hit => {
          if (!hit.title || !hit.url) return;
          results.push({
            id: `hn-${hit.objectID}`,
            title: hit.title,
            url: hit.url,
            source: 'Hacker News',
            date: hit.created_at ? new Date(hit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            points: hit.points || 0,
            summary: '',
          });
        });
      } catch (e) {
        console.warn('HN fetch failed:', e);
      }

      try {
        // Dev.to — latest articles
        const tag = category === 'all' ? '' : `&tag=${category}`;
        const devResp = await fetch(`${DEVTO_API}?per_page=10&top=7${tag}`);
        const devData = await devResp.json();

        (devData || []).forEach(item => {
          results.push({
            id: `dev-${item.id}`,
            title: item.title,
            url: item.url,
            source: 'Dev.to',
            date: item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            points: item.positive_reactions_count || 0,
            summary: item.description || '',
            author: item.user?.name || '',
          });
        });
      } catch (e) {
        console.warn('Dev.to fetch failed:', e);
      }

      // Sort by points/reactions (engagement)
      results.sort((a, b) => b.points - a.points);

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
