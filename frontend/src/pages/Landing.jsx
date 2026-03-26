import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { TrendingUp, Search, Target, ArrowRight, Sun, Moon } from 'lucide-react';
import './Landing.css';

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Skill Trends',
    desc: 'Track which skills are growing in demand across the market.',
  },
  {
    icon: Search,
    title: 'Job Matching',
    desc: 'Browse jobs scored against your skill set for relevance.',
  },
  {
    icon: Target,
    title: 'Gap Analysis',
    desc: 'Identify the skills you need to learn to stay competitive.',
  },
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
        <section className="landing-hero">
          <span className="landing-badge">Real-time internship intelligence</span>
          <h1 className="landing-title">
            Know which skills<br />the market wants
          </h1>
          <p className="landing-desc">
            SkillRadar scans 5+ job platforms daily and tells you exactly which skills are in demand — so you learn what matters.
          </p>
          <Link to="/dashboard" className="btn btn-primary btn-lg landing-cta">
            Get Started
            <ArrowRight size={18} />
          </Link>
        </section>

        <section className="landing-features">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="landing-feature card">
              <div className="landing-feature-icon">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </section>

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
        </section>
      </main>

      <footer className="landing-footer">
        <p>Built for students, by students. Not affiliated with any job platform.</p>
      </footer>
    </div>
  );
}
