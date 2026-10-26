import React from 'react';
import { Star } from 'lucide-react';

const RATING_LABELS = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert"
};

export const SkillRatingInput = ({ label, category, value = 1, onChange, description }) => {
  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem',
      marginBottom: '0.75rem',
      transition: 'all 0.2s ease',
      boxShadow: 'var(--shadow-xs)'
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-accent)'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{label}</span>
            {category && (
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>{category}</span>
            )}
          </div>
          {description && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>{description}</p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Star clickers */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  color: star <= value ? '#eab308' : '#cbd5e1',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                title={`Rate ${star}: ${RATING_LABELS[star]}`}
              >
                <Star size={20} fill={star <= value ? '#eab308' : 'none'} strokeWidth={2} />
              </button>
            ))}
          </div>

          <span style={{
            minWidth: '90px',
            textAlign: 'right',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: value >= 4 ? 'var(--primary-accent)' : value >= 3 ? 'var(--teal-primary)' : 'var(--text-subtle)'
          }}>
            {RATING_LABELS[value] || "Beginner"} ({value}/5)
          </span>
        </div>
      </div>
    </div>
  );
};
