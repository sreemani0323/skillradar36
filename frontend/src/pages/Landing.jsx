import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { TrendingUp, Search, Target, ArrowRight, Sun, Moon, Zap, BarChart3, FileText, Newspaper } from 'lucide-react';
import './Landing.css';

const FEATURES = [
  { icon: TrendingUp, title: 'Live Skill Trends', desc: 'See which skills are exploding in demand right now — updated daily from real job listings.', color: '#6366f1' },
  { icon: Search, title: 'Smart Job Matching', desc: 'Find internships scored against your skills. Filter by domain, location, and recency.', color: '#06b6d4' },
  { icon: Target, title: 'Gap Analysis', desc: 'Discover exactly which skills you are missing — and what to learn next to close the gap.', color: '#f59e0b' },
  { icon: FileText, title: 'Resume Tools', desc: 'Extract skills from your resume or build a professional one from scratch. Download as HTML.', color: '#ec4899' },
  { icon: Newspaper, title: 'Tech News Feed', desc: 'Stay updated with curated developer news from Hacker News and Dev.to.', color: '#3b82f6' },
  { icon: BarChart3, title: 'Application Tracker', desc: 'Kanban board to track your applications from saved → applied → interview → offer.', color: '#16a34a' },
];

const LIVE_SKILLS = [
  { name: 'LangChain', change: '+42%', hot: true },
  { name: 'React', change: '+8%', hot: false },
  { name: 'Python', change: '+12%', hot: false },
  { name: 'Docker', change: '+15%', hot: false },
  { name: 'RAG', change: '+67%', hot: true },
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-logo">SR</span>
          <span className="landing-name">SkillRadar</span>
        </div>
        <div className="landing-header-actions">
          <button className="btn btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
        </div>
      </header>

      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-badge-row">
            <span className="landing-badge">
              <Zap size={12} /> Real-time internship intelligence
            </span>
          </div>
          <h1 className="landing-title">
            Stop guessing.<br />
            <span className="landing-gradient-text">Know what skills matter.</span>
          </h1>
          <p className="landing-desc">
            SkillRadar scans 5+ job platforms daily, analyzes skill demand trends, and helps you focus on learning what actually gets you hired.
          </p>
          <div className="landing-cta-group">
            <Link to="/dashboard" className="btn btn-primary btn-lg landing-cta">
              Explore Dashboard <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </section>

        {/* Live Skill Ticker */}
        <section className="landing-ticker">
          <div className="landing-ticker-label">Trending now</div>
          <div className="landing-ticker-list">
            {LIVE_SKILLS.map(s => (
              <div key={s.name} className="landing-ticker-item">
                <span className="landing-ticker-name">{s.name}</span>
                <span className={`landing-ticker-change ${s.hot ? 'hot' : ''}`}>
                  {s.hot && <Zap size={10} />} {s.change}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="landing-features">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="landing-feature card interactive">
              <div className="landing-feature-icon" style={{ background: `${color}15`, color }}>
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </section>

        {/* Stats */}
        <section className="landing-stats">
          <div className="landing-stat">
            <span className="landing-stat-value">290+</span>
            <span className="landing-stat-label">Jobs Indexed</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-value">180+</span>
            <span className="landing-stat-label">Skills Tracked</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-value">5</span>
            <span className="landing-stat-label">Platforms</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-value">Daily</span>
            <span className="landing-stat-label">Auto-Scrape</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>Built for students who want to learn what matters. Open-source & transparent.</p>
      </footer>
    </div>
  );
}
