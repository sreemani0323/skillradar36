import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/trends': 'Skill Trends',
  '/skill-gap': 'Skill Gap',
  '/jobs': 'Jobs Browser',
  '/tracker': 'App Tracker',
  '/alerts': 'Smart Alerts',
};

const quickLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/trends', label: 'Trends' },
  { path: '/skill-gap', label: 'Gap' },
  { path: '/jobs', label: 'Jobs' },
  { path: '/tracker', label: 'Tracker' },
  { path: '/alerts', label: 'Alerts' },
];

export default function TopHeader() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const currentPage = pageNames[location.pathname] || 'Dashboard';

  return (
    <div className="top-header">
      <div className="top-header-nav">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)', padding: '6px 10px' }}>
          <Home size={14} />
        </NavLink>
        <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
        {quickLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={location.pathname === link.path ? 'active' : ''}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="top-header-right">
        <button
          className="btn btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{ padding: '6px', width: '32px', height: '32px', borderRadius: '50%' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}
