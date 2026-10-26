import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assessmentApi, savedCareerApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Sparkles, 
  Bookmark, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  Code, 
  ExternalLink, 
  ArrowRight, 
  AlertTriangle,
  RotateCcw,
  Compass,
  DollarSign
} from 'lucide-react';

export const RecommendationResultsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [savedMap, setSavedMap] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await assessmentApi.getResults(id);
        setRecommendations(res.data.recommendations || []);

        // Also fetch saved careers to sync bookmark states
        try {
          const savedRes = await savedCareerApi.getSavedCareers();
          const map = {};
          (savedRes.data.saved_careers || []).forEach((sc) => {
            map[sc.career_id] = true;
          });
          setSavedMap(map);
        } catch (e) {
          // ignore
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Could not load recommendation results. Please verify the assessment ID or retake assessment.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResults();
    }
  }, [id]);

  const toggleSave = async (careerId) => {
    try {
      setSavingId(careerId);
      if (savedMap[careerId]) {
        await savedCareerApi.removeSavedCareer(careerId);
        setSavedMap((prev) => ({ ...prev, [careerId]: false }));
      } else {
        await savedCareerApi.saveCareer(careerId);
        setSavedMap((prev) => ({ ...prev, [careerId]: true }));
      }
    } catch (err) {
      console.error("Error saving career:", err);
    } finally {
      setSavingId(null);
    }
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 65) return 'score-medium';
    return 'score-moderate';
  };

  if (loading) {
    return <LoadingSpinner message="Loading and formatting your explainable recommendations..." />;
  }

  if (error || recommendations.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <AlertTriangle size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.75rem' }}>No Recommendations Available</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || "It appears an assessment has not been recorded yet. Take an assessment to unlock your personalized results."}
          </p>
          <Link to="/assessment" className="btn btn-primary">
            <Sparkles size={16} /> Take Career Assessment
          </Link>
        </div>
      </div>
    );
  }

  const topRec = recommendations[0];

  return (
    <div style={{ padding: '3rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Results Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <Sparkles size={14} /> Evaluation Complete
            </div>
            <h1 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              Your Top Match: {topRec.career?.title || "Career Pathway"}
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '640px', lineHeight: '1.5' }}>
              Based on your multi-attribute analysis, we estimated a profile alignment of {Math.round(topRec.match_score)}%. Review the detailed reasons and customized roadmaps below.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/assessment" className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none' }}>
              <RotateCcw size={14} /> Retake Assessment
            </Link>
            <Link to="/saved-careers" className="btn btn-primary btn-sm" style={{ background: 'white', color: 'var(--primary-navy)' }}>
              <Bookmark size={14} /> View Saved Careers
            </Link>
          </div>
        </div>

        {/* Recommendations List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {recommendations.map((rec, idx) => {
            const career = rec.career || {};
            const isSaved = !!savedMap[rec.career_id];

            return (
              <div key={rec.id || idx} className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-md)', border: idx === 0 ? '2px solid var(--border-accent)' : '1px solid var(--border-light)' }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: idx === 0 ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-subtle)',
                      color: idx === 0 ? 'white' : 'var(--primary-navy)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-display)'
                    }}>
                      #{rec.ranking}
                    </div>

                    <div>
                      <span className="badge badge-indigo" style={{ marginBottom: '0.3rem' }}>
                        {career.category || "Domain"}
                      </span>
                      <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)' }}>
                        {career.title}
                      </h2>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Match Score Badge */}
                    <div className={`match-score-badge ${getScoreBadgeClass(rec.match_score)}`}>
                      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{Math.round(rec.match_score)}%</span>
                      <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Match</span>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleSave(rec.career_id)}
                      disabled={savingId === rec.career_id}
                      className={`btn ${isSaved ? 'btn-accent' : 'btn-secondary'} btn-sm`}
                      title={isSaved ? "Saved to bookmarks" : "Save this career"}
                    >
                      <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                      <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Explanation Callout */}
                <div style={{
                  background: '#f8fafc',
                  borderLeft: '4px solid var(--primary-accent)',
                  padding: '1.2rem',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                  marginBottom: '1.5rem',
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  color: 'var(--text-main)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--primary-accent)', marginBottom: '0.4rem', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.04em' }}>
                    <Sparkles size={14} /> AI Recommendation Reasoning
                  </div>
                  <p>{rec.explanation}</p>
                </div>

                {/* Skills Analysis Grid */}
                <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                  {/* Matching Strengths */}
                  <div style={{ background: '#ecfdf5', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                    <h4 style={{ color: '#065f46', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle size={16} /> Matching Strengths ({rec.matching_skills?.length || 0})
                    </h4>
                    {rec.matching_skills && rec.matching_skills.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {rec.matching_skills.map((s, si) => (
                          <span key={si} style={{ background: 'white', color: '#047857', border: '1px solid #6ee7b7', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600 }}>
                            {s.skill} • {s.status || `${s.student_rating}/5`}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: '#065f46' }}>Focus on foundational prerequisites in the learning roadmap.</p>
                    )}
                  </div>

                  {/* Skills to Improve */}
                  <div style={{ background: '#fffbeb', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
                    <h4 style={{ color: '#92400e', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <TrendingUp size={16} /> Skills to Develop ({rec.skills_to_improve?.length || 0})
                    </h4>
                    {rec.skills_to_improve && rec.skills_to_improve.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {rec.skills_to_improve.slice(0, 4).map((s, si) => (
                          <span key={si} style={{ background: 'white', color: '#b45309', border: '1px solid #fcd34d', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600 }}>
                            {s.skill} ({s.priority} priority)
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: '#92400e' }}>You meet or exceed all baseline core skill ratings for this role!</p>
                    )}
                  </div>
                </div>

                {/* 4-Stage Learning Roadmap preview */}
                {rec.learning_roadmap && rec.learning_roadmap.length > 0 && (
                  <div style={{ marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.85rem' }}>
                      Suggested Learning Roadmap
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {rec.learning_roadmap.map((stage, sIdx) => (
                        <div key={sIdx} style={{ background: 'white', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-accent)', display: 'block', marginBottom: '0.25rem' }}>
                            {stage.phase}
                          </span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {stage.focus}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                    {career.average_salary_range && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <DollarSign size={14} color="var(--teal-primary)" /> {career.average_salary_range}
                      </span>
                    )}
                    {career.job_outlook && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <TrendingUp size={14} color="var(--primary-accent)" /> {career.job_outlook}
                      </span>
                    )}
                  </div>

                  <Link to={`/careers/${rec.career_id}`} className="btn btn-outline btn-sm">
                    Detailed Roadmap & Courses <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
