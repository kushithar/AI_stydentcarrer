import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', marginTop: 'auto', padding: '3.5rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--primary-blue)', color: 'white', padding: '0.4rem', borderRadius: '8px' }}>
                <Compass size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                Career<span style={{ color: 'var(--primary-accent)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
              Empowering students with explainable, data-driven career recommendations, transparent skill analysis, and verified learning roadmaps.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#047857', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
              <ShieldCheck size={14} /> Explainable ML Engine
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-navy)' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/careers" style={{ color: 'var(--text-muted)' }}>Explore All Careers</Link></li>
              <li><Link to="/courses" style={{ color: 'var(--text-muted)' }}>Free Learning Resources</Link></li>
              <li><Link to="/assessment" style={{ color: 'var(--text-muted)' }}>Career Assessment Wizard</Link></li>
              <li><Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Methodology */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-navy)' }}>Recommendation Methodology</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li>Interest Alignment (35%)</li>
              <li>Skill Proficiency Match (30%)</li>
              <li>Academic & Subject Fit (20%)</li>
              <li>Work-Style & Aptitude (15%)</li>
            </ul>
          </div>

          {/* Ethical AI Notice */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-navy)' }}>Safeguards & Ethics</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', lineHeight: '1.5' }}>
              Recommendations represent estimated profile alignments based on student self-ratings, not guaranteed employment or admissions. No external paid APIs or opaque black-box models are utilized.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
          <p>© 2026 AI-Based Student Career Recommendation System. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with modern web standards & ethical AI
          </p>
        </div>
      </div>
    </footer>
  );
};
