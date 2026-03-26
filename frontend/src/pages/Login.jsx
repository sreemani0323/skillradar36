import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Radar, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp, signInWithGoogle, signInWithGitHub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const fn = isLogin ? signIn : signUp;
    const { error: err } = await fn(email, password);
    setSubmitting(false);
    if (err) {
      setError(err.message);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogle = async () => {
    setError('');
    await signInWithGoogle();
  };

  const handleGitHub = async () => {
    setError('');
    await signInWithGitHub();
  };

  return (
    <div className="login-page">
      {/* Background effects */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid-overlay" />
      </div>

      <div className="login-container">
        {/* Left side - branding */}
        <div className="login-branding">
          <Link to="/" className="login-logo">
            <div className="login-logo-icon"><Radar size={28} /></div>
            <span className="login-logo-text">SkillRadar</span>
          </Link>
          <h2 className="login-title">
            {isLogin ? 'Welcome Back' : 'Join SkillRadar'}
          </h2>
          <p className="login-subtitle">
            {isLogin
              ? 'Track skill trends, analyze gaps, and land your dream internship.'
              : 'Start tracking skills that matter. Free forever.'}
          </p>

          <div className="login-features">
            {[
              'Personalized skill gap reports',
              'Smart job match alerts',
              'Application tracking board',
              'Real-time trend data',
            ].map((f, i) => (
              <div key={i} className="login-feature" style={{ animationDelay: `${i * 0.1}s` }}>
                <Sparkles size={14} color="var(--accent-primary-light)" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - form */}
        <div className="login-form-wrapper">
          <div className="login-card glass-card">
            <div className="login-card-header">
              <div className="login-tabs">
                <button className={`login-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Log In</button>
                <button className={`login-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Google OAuth */}
              <button type="button" className="btn btn-secondary login-google-btn" onClick={handleGoogle}>
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>

              {/* GitHub OAuth */}
              <button type="button" className="btn btn-secondary login-github-btn" onClick={handleGitHub}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                Continue with GitHub
              </button>

              <div className="login-divider">
                <span>or continue with email</span>
              </div>

              {/* Email */}
              <div className="login-field">
                <label>Email</label>
                <div className="input-group">
                  <input
                    type="email"
                    className="input"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '42px' }}
                  />
                  <Mail size={16} className="input-icon" />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <label>Password</label>
                <div className="input-group" style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  />
                  <Lock size={16} className="input-icon" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                  <a href="#" style={{ fontSize: '13px', color: 'var(--accent-primary-light)' }}>Forgot password?</a>
                </div>
              )}

              {error && (
                <div style={{ color: '#e17055', fontSize: '13px', textAlign: 'center', padding: '8px', background: 'rgba(225,112,85,0.1)', borderRadius: '8px' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="spin" /> : null}
                {isLogin ? 'Log In' : 'Create Account'}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="login-footer">
              <span>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary-light)', cursor: 'pointer', fontWeight: 500 }}>
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
