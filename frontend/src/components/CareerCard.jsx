import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import { savedCareerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CareerCard = ({ career, matchScore = null, isSavedInitial = false, onSaveToggled }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || isAdmin) return;

    try {
      setSaving(true);
      if (isSaved) {
        await savedCareerApi.removeSavedCareer(career.id);
        setIsSaved(false);
        if (onSaveToggled) onSaveToggled(career.id, false);
      } else {
        await savedCareerApi.saveCareer(career.id);
        setIsSaved(true);
        if (onSaveToggled) onSaveToggled(career.id, true);
      }
    } catch (err) {
      console.error("Error bookmarking career:", err);
    } finally {
      setSaving(false);
    }
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 65) return 'score-medium';
    return 'score-moderate';
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
        <div>
          <span className="badge badge-indigo" style={{ marginBottom: '0.4rem' }}>
            {career.category || 'Career Path'}
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
            {career.title}
          </h3>
        </div>

        {matchScore !== null ? (
          <div className={`match-score-badge ${getScoreBadgeClass(matchScore)}`} title="Estimated Profile Alignment">
            <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{Math.round(matchScore)}%</span>
            <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Match</span>
          </div>
        ) : isAuthenticated && !isAdmin ? (
          <button
            onClick={handleToggleSave}
            disabled={saving}
            style={{
              background: isSaved ? '#eff6ff' : 'white',
              border: '1px solid',
              borderColor: isSaved ? 'var(--primary-accent)' : 'var(--border-light)',
              color: isSaved ? 'var(--primary-accent)' : 'var(--text-subtle)',
              borderRadius: '8px',
              padding: '0.45rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title={isSaved ? "Bookmarked" : "Bookmark this career"}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        ) : null}
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {career.description}
      </p>

      {/* Quick stats pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
        {career.average_salary_range && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-main)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
            <DollarSign size={13} color="var(--teal-primary)" /> {career.average_salary_range}
          </span>
        )}
        {career.job_outlook && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-main)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
            <TrendingUp size={13} color="var(--primary-accent)" /> {career.job_outlook}
          </span>
        )}
      </div>

      {/* Skills Pill Preview */}
      {career.skills && career.skills.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Required Skills
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {career.skills.slice(0, 3).map((s, idx) => (
              <span key={idx} style={{ background: '#f1f5f9', color: 'var(--text-main)', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 500 }}>
                {s.skill_name || s.name}
              </span>
            ))}
            {career.skills.length > 3 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', alignSelf: 'center' }}>
                +{career.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={`/careers/${career.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
          View Details & Roadmap <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
