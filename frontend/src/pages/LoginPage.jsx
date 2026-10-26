import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, AlertCircle, LogIn, Sparkles, ShieldAlert, Check } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err) {
      console.error("Login failed:", err);
      const msg = err.response?.data?.error || 'Invalid credentials or server error. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@careerai.com');
      setPassword('AdminPassword123!');
    } else {
      setEmail('student@test.com');
      setPassword('Password123!');
    }
    setError('');
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #1e3a8a, #4338ca)',
            color: 'white',
            padding: '0.65rem',
            borderRadius: '12px',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 10px rgba(30, 58, 138, 0.25)'
          }}>
            <Compass size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sign in to continue your personalized career path</p>
        </div>

        {/* Demo Credentials Switcher */}
        <div style={{
          background: 'var(--bg-main)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          marginBottom: '1.5rem',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-subtle)' }}>
            <span>Quick Demo Fill:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('student')}
              style={{
                flex: 1,
                padding: '0.4rem 0.6rem',
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600,
                color: 'var(--primary-accent)'
              }}
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              style={{
                flex: 1,
                padding: '0.4rem 0.6rem',
                background: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#b45309'
              }}
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.75rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary-accent)' }}>
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};
