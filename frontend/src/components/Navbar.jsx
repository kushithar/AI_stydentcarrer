import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  LayoutDashboard, 
  ClipboardCheck, 
  Bookmark, 
  BookOpen, 
  Briefcase, 
  ShieldAlert, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container flex-between">
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #4338ca)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(30, 58, 138, 0.25)'
          }}>
            <Compass size={22} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)', letterSpacing: '-0.02em' }}>
              Career<span style={{ color: 'var(--primary-accent)' }}>AI</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-subtle)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Recommendation Engine
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="desktop-links">
          <Link to="/careers" className={`nav-link ${isActive('/careers') ? 'active' : ''}`}>
            <Briefcase size={16} /> Explore Careers
          </Link>
          <Link to="/courses" className={`nav-link ${isActive('/courses') ? 'active' : ''}`}>
            <BookOpen size={16} /> Courses
          </Link>

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link to="/assessment" className={`nav-link ${isActive('/assessment') ? 'active' : ''}`}>
                    <ClipboardCheck size={16} /> Take Assessment
                  </Link>
                  <Link to="/saved-careers" className={`nav-link ${isActive('/saved-careers') ? 'active' : ''}`}>
                    <Bookmark size={16} /> Saved Careers
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link to="/admin/dashboard" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} style={{ color: '#b45309', fontWeight: 600, background: '#fef3c7' }}>
                  <ShieldAlert size={16} /> Admin Portal
                </Link>
              )}
            </>
          ) : null}
        </div>

        {/* User Account / Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {!isAdmin && (
                <Link to="/profile" className="btn btn-secondary btn-sm" title="My Profile">
                  <User size={15} />
                  <span style={{ display: 'none' }} className="username-display">{user?.full_name?.split(' ')[0]}</span>
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Sign Out">
                <LogOut size={15} />
                <span style={{ display: 'none' }} className="logout-display">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <Sparkles size={14} /> Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '0.4rem' }}
            className="mobile-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ padding: '1rem 1.5rem', background: 'white', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/careers" onClick={() => setMobileMenuOpen(false)} className="nav-link">
            <Briefcase size={16} /> Explore Careers
          </Link>
          <Link to="/courses" onClick={() => setMobileMenuOpen(false)} className="nav-link">
            <BookOpen size={16} /> Courses
          </Link>
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-link">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/assessment" onClick={() => setMobileMenuOpen(false)} className="nav-link">
                <ClipboardCheck size={16} /> Assessment
              </Link>
              <Link to="/saved-careers" onClick={() => setMobileMenuOpen(false)} className="nav-link">
                <Bookmark size={16} /> Saved Careers
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="nav-link">
                <User size={16} /> My Profile
              </Link>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ background: '#fef3c7', color: '#b45309' }}>
              <ShieldAlert size={16} /> Admin Dashboard
            </Link>
          )}
        </div>
      )}

      {/* Inline styles for responsive breakpoints */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .username-display, .logout-display { display: inline !important; }
        }
        @media (max-width: 767px) {
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
