import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { careerApi, savedCareerApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  Bookmark, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  Code,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CareerDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        setLoading(true);
        const res = await careerApi.getCareerDetails(id);
        setCareer(res.data.career);

        if (isAuthenticated && !isAdmin) {
          try {
            const savedRes = await savedCareerApi.getSavedCareers();
            const found = (savedRes.data.saved_careers || []).some((sc) => sc.career_id === parseInt(id));
            setIsSaved(found);
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.error("Failed to fetch career:", err);
        setError("Career details could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCareer();
    }
  }, [id, isAuthenticated, isAdmin]);

  const toggleSave = async () => {
    if (!isAuthenticated || isAdmin) return;
    try {
      setSaving(true);
      if (isSaved) {
        await savedCareerApi.removeSavedCareer(career.id);
        setIsSaved(false);
      } else {
        await savedCareerApi.saveCareer(career.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Save toggle error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching comprehensive career dossier..." />;
  }

  if (error || !career) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Career Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || "The requested career record could not be found."}</p>
        <Link to="/careers" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Careers Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/careers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-subtle)', fontSize: '0.9rem', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to all careers
          </Link>
        </div>

        {/* Hero Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
                {career.category}
              </span>
              <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-navy)', marginBottom: '0.75rem' }}>
                {career.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '750px', lineHeight: '1.6' }}>
                {career.description}
              </p>
            </div>

            {isAuthenticated && !isAdmin && (
              <button
                onClick={toggleSave}
                disabled={saving}
                className={`btn ${isSaved ? 'btn-accent' : 'btn-secondary'}`}
                style={{ padding: '0.75rem 1.25rem' }}
              >
                <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                <span>{isSaved ? 'Bookmarked' : 'Bookmark Career'}</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>Average Salary</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <DollarSign size={16} color="var(--teal-primary)" /> {career.average_salary_range || "Market Competitive"}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>Job Outlook</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <TrendingUp size={16} color="var(--primary-accent)" /> {career.job_outlook || "Steady"}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>Work Environment</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <Building size={16} color="var(--violet-primary)" /> {career.work_environment || "Collaborative"}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>Min Academic Benchmark</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem', display: 'block' }}>
                {career.min_academic_percentage}% Marks
              </span>
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Responsibilities */}
            {career.typical_responsibilities && career.typical_responsibilities.length > 0 && (
              <div className="card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-navy)' }}>
                  Typical Core Responsibilities
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {career.typical_responsibilities.map((resp, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                      <CheckCircle size={18} color="var(--teal-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curated Courses & Resources */}
            {career.courses && career.courses.length > 0 && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)' }}>
                    Accredited Free Learning Resources
                  </h3>
                  <span className="badge badge-teal">Verified Providers</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {career.courses.map((course, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div>
                          <span className="badge badge-primary" style={{ marginBottom: '0.3rem' }}>{course.provider}</span>
                          <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)' }}>{course.title}</h4>
                        </div>
                        <span className="badge badge-emerald">{course.cost_type || "Free"}</span>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        {course.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                        <span>Skill Taught: <strong>{course.skill_taught}</strong> • Level: <strong>{course.difficulty}</strong></span>
                        <a href={course.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          Start Learning <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Required Skills */}
            <div className="card">
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary-navy)' }}>
                Required & Preferred Skills
              </h4>

              {career.skills && career.skills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {career.skills.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-main)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{s.skill_name || s.name}</span>
                      <span className={`badge ${s.designation === 'required' ? 'badge-rose' : 'badge-indigo'}`} style={{ fontSize: '0.7rem' }}>
                        {s.designation}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{career.required_skills_summary || "Refer to course roadmap."}</p>
              )}
            </div>

            {/* Relevant Subjects */}
            {career.relevant_subjects && career.relevant_subjects.length > 0 && (
              <div className="card">
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary-navy)' }}>
                  Relevant Academic Subjects
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {career.relevant_subjects.map((subj, i) => (
                    <span key={i} className="badge badge-teal" style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Careers */}
            {career.related_careers && career.related_careers.length > 0 && (
              <div className="card">
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary-navy)' }}>
                  Alternative Related Careers
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {career.related_careers.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/careers/${rel.id}`}
                      style={{
                        padding: '0.6rem 0.85rem',
                        background: 'var(--bg-main)',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--text-main)'
                      }}
                    >
                      <span>{rel.title}</span>
                      <ArrowRight size={14} color="var(--primary-accent)" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
