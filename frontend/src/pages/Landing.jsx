import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radar, ArrowRight, TrendingUp, Target, Briefcase,
  Zap, Shield, BarChart3, Sparkles, Star, ChevronRight,
  Users, Globe, LineChart, Sun, Moon,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import './Landing.css';

const features = [
  { icon: BarChart3, title: 'Live Skill Dashboard', desc: 'See which skills are trending across 20+ platforms right now — not last month, today.', color: '#6c5ce7' },
  { icon: Target, title: 'Skill Gap Analyzer', desc: 'Enter your skills, get a match score per domain, know exactly what to learn next.', color: '#00cec9' },
  { icon: LineChart, title: 'Trend Tracker', desc: 'Historical trend curves for 500+ skills. See if LangChain is rising or Angular is declining.', color: '#fdcb6e' },
  { icon: Briefcase, title: 'Jobs Browser', desc: 'All internships from 20+ platforms in one searchable, filterable table.', color: '#fd79a8' },
  { icon: Shield, title: 'Application Tracker', desc: 'Kanban board to track applications: Saved → Applied → Interview → Offer.', color: '#e17055' },
  { icon: Zap, title: 'Smart Alerts', desc: 'Get notified only when high-match jobs appear. Email or Telegram, your choice.', color: '#74b9ff' },
];

const stats = [
  { value: '20+', label: 'Platforms Scraped' },
  { value: '500+', label: 'Skills Tracked' },
  { value: '₹0', label: 'Monthly Cost' },
  { value: '3.8K+', label: 'Jobs Indexed' },
];

const testimonials = [
  { name: 'Priya Sharma', role: '3rd Year, IIT Delhi', text: 'SkillRadar showed me LangChain was trending 42% up. I learned it, and got 3 interview calls in 2 weeks.', avatar: 'PS' },
  { name: 'Arjun Reddy', role: '4th Year, BITS Pilani', text: 'The skill gap analyzer told me exactly which 3 skills to learn. I went from 55% to 85% match score.', avatar: 'AR' },
  { name: 'Sneha Patel', role: 'Placement Officer, VIT', text: 'We use SkillRadar data to guide our curriculum. The trend data is something no other free tool provides.', avatar: 'SP' },
];

export default function Landing() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon"><Radar size={22} /></div>
            <span className="landing-logo-text">SkillRadar</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#stats">Impact</a>
            <a href="#testimonials">Stories</a>
          </div>
          <div className="landing-nav-actions">
            <button
              className="btn btn-icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{ padding: '8px', width: '36px', height: '36px' }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="btn btn-ghost">Log In</Link>
            <Link to="/dashboard" className="btn btn-primary">
              Launch App <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-orb hero-orb-4" />
          <div className="hero-grid-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Powered by NLP · Updated Every Scrape Cycle</span>
          </div>
          <h1 className="hero-title">
            Stop Guessing.<br />
            <span className="hero-gradient-text">Start Tracking Skills</span><br />
            That Actually Matter.
          </h1>
          <p className="hero-subtitle">
            SkillRadar scrapes 20+ job platforms, extracts in-demand skills using NLP,
            and shows you exactly what to learn to land your dream internship — all for free.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary btn-lg hero-cta">
              Explore Dashboard <ArrowRight size={18} />
            </Link>
            <Link to="/skill-gap" className="btn btn-secondary btn-lg">
              Analyze My Skills <Target size={18} />
            </Link>
          </div>
          <div className="hero-trust">
            <div className="hero-trust-avatars">
              {['PS', 'AR', 'SP', 'MK', 'VR'].map((a, i) => (
                <div key={i} className="trust-avatar" style={{ animationDelay: `${i * 0.1}s` }}>{a}</div>
              ))}
            </div>
            <span className="hero-trust-text">Trusted by <strong>2,400+</strong> students across India</span>
          </div>
        </div>

        {/* Floating skill chips */}
        <div className="hero-floating-skills">
          {['Python ↑12%', 'LangChain ↑42%', 'React ↑8%', 'Docker ↑15%', 'RAG ↑67%'].map((s, i) => (
            <div key={i} className="floating-skill" style={{ animationDelay: `${i * 0.8}s` }}>{s}</div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="landing-stat" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="landing-stat-value">{s.value}</div>
              <div className="landing-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <div className="section-badge"><Star size={14} /> 6 Core Modules</div>
          <h2 className="section-title">Everything You Need to<br /><span className="hero-gradient-text">Land That Internship</span></h2>
          <p className="section-subtitle">From real-time skill tracking to personalized gap analysis — all free, all automated.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`feature-card glass-card ${hoveredFeature === i ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon-wrapper" style={{ background: `${f.color}20` }}>
                  <Icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-link">
                  Learn more <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <div className="section-badge"><Users size={14} /> Success Stories</div>
          <h2 className="section-title">Students Who <span className="hero-gradient-text">Made The Shift</span></h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card glass-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-bg-orb" />
          <h2 className="cta-title">Ready to See What the Market Actually Wants?</h2>
          <p className="cta-desc">Join 2,400+ students who stopped guessing and started tracking.</p>
          <div className="cta-actions">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Launch SkillRadar <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="landing-logo">
              <div className="landing-logo-icon"><Radar size={18} /></div>
              <span className="landing-logo-text" style={{ fontSize: '16px' }}>SkillRadar</span>
            </div>
            <p className="footer-desc">The internship intelligence platform for Indian B.Tech students. Free forever.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/trends">Trends</Link>
              <Link to="/skill-gap">Skill Gap</Link>
              <Link to="/jobs">Jobs</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#">API Docs</a>
              <a href="#">GitHub</a>
              <a href="#">Blog</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 SkillRadar · Built with ❤️ for B.Tech students</span>
        </div>
      </footer>
    </div>
  );
}
