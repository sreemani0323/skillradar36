import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';

/* Eagerly load nav — always visible */
import MobileNav from './components/MobileNav';
import Sidebar from './components/Sidebar';

/* Lazy load every page */
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Trends = lazy(() => import('./pages/Trends'));
const SkillGap = lazy(() => import('./pages/SkillGap'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Tracker = lazy(() => import('./pages/Tracker'));
const Alerts = lazy(() => import('./pages/Alerts'));
const News = lazy(() => import('./pages/News'));
const Resume = lazy(() => import('./pages/Resume'));

function PageLoader() {
  return (
    <div className="page-wrapper">
      <div className="skeleton" style={{ height: 28, width: '40%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="skeleton" style={{ height: 100 }} />
        <div className="skeleton" style={{ height: 100 }} />
      </div>
      <div className="skeleton" style={{ height: 200, marginTop: 16 }} />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isPublic = location.pathname === '/' || location.pathname === '/login';

  if (isPublic) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/news" element={<News />} />
            <Route path="/resume" element={<Resume />} />
          </Routes>
        </Suspense>
      </main>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
