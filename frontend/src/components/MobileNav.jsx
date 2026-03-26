import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Newspaper, FileText, TrendingUp } from 'lucide-react';
import './MobileNav.css';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs' },
  { path: '/news', icon: Newspaper, label: 'News' },
  { path: '/resume', icon: FileText, label: 'Resume' },
  { path: '/trends', icon: TrendingUp, label: 'Trends' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={20} strokeWidth={1.8} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
