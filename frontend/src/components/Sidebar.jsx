import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Briefcase,
  Kanban,
  Bell,
  Radar,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  User,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/trends', label: 'Skill Trends', icon: TrendingUp },
  { path: '/skill-gap', label: 'Skill Gap', icon: Target },
  { path: '/jobs', label: 'Jobs Browser', icon: Briefcase },
  { path: '/tracker', label: 'App Tracker', icon: Kanban },
  { path: '/alerts', label: 'Smart Alerts', icon: Bell },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Radar size={24} />
        </div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-name">SkillRadar</span>
            <span className="logo-tagline">Internship Intelligence</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{!collapsed && 'MENU'}</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              data-tooltip={collapsed ? item.label : undefined}
            >
              <div className="nav-icon-wrapper">
                <Icon size={20} />
                {isActive && <div className="nav-active-dot" />}
              </div>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {isActive && !collapsed && (
                <div className="nav-active-indicator" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Upgrade card */}
      {!collapsed && (
        <div className="sidebar-card">
          <div className="card-sparkle">
            <Sparkles size={18} />
          </div>
          <div className="card-title">Pro Alerts</div>
          <div className="card-desc">Get instant Telegram & email alerts for high-match jobs</div>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '10px' }}>
            Enable Alerts
          </button>
        </div>
      )}

      {/* Bottom actions */}
      <div className="sidebar-bottom">
        {/* Theme toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          data-tooltip={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          <div className="theme-toggle-icon">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </div>
          {!collapsed && (
            <span className="nav-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>

        {user ? (
          <button className="nav-item" onClick={handleSignOut} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%' }}>
            <div className="nav-icon-wrapper">
              <LogOut size={20} />
            </div>
            {!collapsed && <span className="nav-label">Sign Out</span>}
          </button>
        ) : (
          <NavLink to="/login" className="nav-item">
            <div className="nav-icon-wrapper">
              <LogIn size={20} />
            </div>
            {!collapsed && <span className="nav-label">Login</span>}
          </NavLink>
        )}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
