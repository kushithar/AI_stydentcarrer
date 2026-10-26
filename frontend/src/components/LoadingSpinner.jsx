import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = "Loading data..." }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', minHeight: '40vh' }}>
      <Loader2 size={38} className="animate-spin" style={{ color: 'var(--primary-accent)', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
