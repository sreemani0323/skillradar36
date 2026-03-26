import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import {
  LayoutDashboard, TrendingUp, Target, Briefcase,
  ListChecks, Bell, Newspaper, FileText, LogOut, LogIn, Sun, Moon,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs' },
  { path: '/trends', icon: TrendingUp, label: 'Skill Trends' },
  { path: '/skill-gap', icon: Target, label: 'Skill Gap' },
  { path: '/news', icon: Newspaper, label: 'Tech News' },
  { path: '/resume', icon: FileText, label: 'Resume' },
  { path: '/tracker', icon: ListChecks, label: 'Tracker' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">SR</span>
        <div>
          <div className="sidebar-title">SkillRadar</div>
          <div className="sidebar-subtitle">Internship Intel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {user ? (
          <button className="sidebar-link" onClick={signOut}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        ) : (
          <NavLink to="/login" className="sidebar-link">
            <LogIn size={18} />
            <span>Login</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
}
