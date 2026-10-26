import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <HelpCircle size={64} color="var(--primary-accent)" style={{ marginBottom: '1.25rem', opacity: 0.8 }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '480px', marginBottom: '2rem', lineHeight: '1.5' }}>
        The page you requested could not be located. It may have been moved, updated, or does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Homepage
      </Link>
    </div>
  );
};
