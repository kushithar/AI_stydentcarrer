import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CareerCard } from '../components/CareerCard';
import { 
  Sparkles, 
  RotateCcw, 
  Bookmark, 
  User, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your student career dashboard..." />;
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Dashboard Unavailable</h2>
        <p style={{ color: 'var(--text-muted)' }}>{error || "Could not load data."}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #4338ca 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <Award size={14} /> Student Career Portal
            </div>
            <h1 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '0.4rem' }}>
              Welcome back, {data.student_name}!
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
              {data.course_stream} • {data.education_level}
              {data.academic_percentage && ` • ${data.academic_percentage}% Marks`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/assessment" className="btn btn-accent btn-sm">
              <Sparkles size={16} /> Retake Assessment
            </Link>
            <Link to="/profile" className="btn btn-secondary btn-sm" style={{ background: 'white', color: 'var(--primary-navy)' }}>
              <User size={16} /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {/* Profile Completion */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Profile Completion</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-navy)', margin: '0.25rem 0 0.5rem' }}>
                {data.profile_completion}%
              </div>
            </div>
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: `${data.profile_completion}%` }} />
            </div>
          </div>

          {/* Assessments Taken */}
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Assessments Taken</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-accent)', margin: '0.25rem 0' }}>
              {data.total_assessments}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              {data.latest_assessment_date ? `Latest: ${new Date(data.latest_assessment_date).toLocaleDateString()}` : "None recorded"}
            </span>
          </div>

          {/* Saved Careers */}
          <div className="card">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Bookmarked Careers</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--teal-primary)', margin: '0.25rem 0' }}>
              {data.saved_careers_count}
            </div>
            <Link to="/saved-careers" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--teal-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              Manage bookmarks <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Top Recommendations Section */}
        {data.top_recommendations && data.top_recommendations.length > 0 ? (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)' }}>Your Latest Recommended Careers</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Calculated from your latest multi-vector assessment</p>
              </div>
              <Link to="/careers" className="btn btn-secondary btn-sm">
                Explore All Careers <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid-3">
              {data.top_recommendations.slice(0, 3).map((rec) => (
                <CareerCard
                  key={rec.id}
                  career={rec.career || { id: rec.career_id, title: "Career", description: rec.explanation }}
                  matchScore={rec.match_score}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
            <Sparkles size={36} color="var(--primary-accent)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Assessment Results Yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Complete our structured assessment wizard to unlock individualized career recommendations, skill gap breakdowns, and verified learning roadmaps.
            </p>
            <Link to="/assessment" className="btn btn-primary">
              <Sparkles size={16} /> Start Your Assessment
            </Link>
          </div>
        )}

        {/* Visual Analytics Chart: Evaluated Skills */}
        {data.skills_chart && data.skills_chart.length > 0 && (
          <div className="card" style={{ marginBottom: '2.5rem', padding: '1.75rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
                Your Evaluated Skills Profile
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                Visual distribution of your rated competencies on a 1-5 scale
              </p>
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.skills_chart} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="skill" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(val) => [`${val} / 5`, 'Proficiency Rating']}
                  />
                  <Bar dataKey="rating" fill="var(--primary-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Saved Careers Quick Grid */}
        {data.saved_careers && data.saved_careers.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)' }}>
                Bookmarked Careers for Further Review
              </h3>
              <Link to="/saved-careers" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-accent)' }}>
                Compare All ({data.saved_careers_count})
              </Link>
            </div>

            <div className="grid-2">
              {data.saved_careers.map((sc) => (
                <div key={sc.id} style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="badge badge-teal" style={{ marginBottom: '0.3rem' }}>{sc.career?.category}</span>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)' }}>{sc.career?.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                      Saved on {new Date(sc.saved_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Link to={`/careers/${sc.career_id}`} className="btn btn-outline btn-sm">
                    View Dossier
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
