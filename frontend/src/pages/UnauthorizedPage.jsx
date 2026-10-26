import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div style={{ padding: '6rem 1rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ShieldAlert size={64} color="var(--danger)" style={{ marginBottom: '1.25rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>403 - Access Denied</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '520px', marginBottom: '2rem', lineHeight: '1.5' }}>
        You do not possess the required administrator privileges to view this portal. Administrative actions are logged and restricted to authorized personnel.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Student Dashboard
      </Link>
    </div>
  );
};
