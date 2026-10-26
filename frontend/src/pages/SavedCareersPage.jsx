import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { savedCareerApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  BookOpen, 
  Layers,
  Save
} from 'lucide-react';

export const SavedCareersPage = () => {
  const [savedCareers, setSavedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await savedCareerApi.getSavedCareers();
      setSavedCareers(res.data.saved_careers || []);
    } catch (err) {
      console.error("Failed to fetch saved careers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (careerId) => {
    try {
      await savedCareerApi.removeSavedCareer(careerId);
      setSavedCareers((prev) => prev.filter((item) => item.career_id !== careerId));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  const startEditNote = (item) => {
    setEditingId(item.id);
    setNoteText(item.notes || '');
  };

  const saveNote = async (item) => {
    try {
      setSavingNote(true);
      await savedCareerApi.saveCareer(item.career_id, noteText);
      setSavedCareers((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, notes: noteText } : c))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your bookmarked careers..." />;
  }

  return (
    <div style={{ padding: '3rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
              Bookmarked Careers
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Compare your saved pathways and review personal exploration notes
            </p>
          </div>
          <Link to="/careers" className="btn btn-secondary">
            Browse All Careers
          </Link>
        </div>

        {savedCareers.length === 0 ? (
          <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <Bookmark size={42} color="var(--primary-accent)" style={{ marginBottom: '1rem', opacity: 0.6 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Saved Careers Yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.92rem' }}>
              Bookmark careers from your assessment recommendations or exploration catalog to compare them side-by-side.
            </p>
            <Link to="/careers" className="btn btn-primary">
              <Sparkles size={16} /> Explore Careers
            </Link>
          </div>
        ) : (
          <div>
            {/* Cards Grid */}
            <div className="grid-2" style={{ marginBottom: '3rem' }}>
              {savedCareers.map((item) => {
                const career = item.career || {};
                const isEditing = editingId === item.id;

                return (
                  <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <span className="badge badge-indigo" style={{ marginBottom: '0.35rem' }}>
                          {career.category || "Domain"}
                        </span>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)' }}>
                          {career.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleRemove(item.career_id)}
                        className="btn btn-danger btn-sm"
                        title="Remove bookmark"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1 }}>
                      {career.description}
                    </p>

                    {/* Metadata strip */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                      {career.average_salary_range && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <DollarSign size={13} color="var(--teal-primary)" /> {career.average_salary_range}
                        </span>
                      )}
                      {career.job_outlook && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <TrendingUp size={13} color="var(--primary-accent)" /> {career.job_outlook}
                        </span>
                      )}
                    </div>

                    {/* Student Personal Notes */}
                    <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                        My Notes
                      </span>
                      {isEditing ? (
                        <div>
                          <textarea
                            rows="2"
                            className="form-textarea"
                            style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}
                            placeholder="Add your personal notes or next steps..."
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                            <button onClick={() => saveNote(item)} disabled={savingNote} className="btn btn-primary btn-sm">
                              <Save size={12} /> Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ fontSize: '0.85rem', color: item.notes ? 'var(--text-main)' : 'var(--text-light)', fontStyle: item.notes ? 'normal' : 'italic' }}>
                            {item.notes || "No notes added yet."}
                          </p>
                          <button onClick={() => startEditNote(item)} style={{ background: 'none', border: 'none', color: 'var(--primary-accent)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    <Link to={`/careers/${item.career_id}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      View Details & Learning Resources <ArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Side-by-Side Comparison Matrix */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Layers size={22} color="var(--primary-accent)" />
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)' }}>
                  Side-by-Side Comparison Matrix
                </h3>
              </div>

              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      {savedCareers.map((sc) => (
                        <th key={sc.id} style={{ minWidth: '180px' }}>
                          {sc.career?.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>Category</td>
                      {savedCareers.map((sc) => (
                        <td key={sc.id}>{sc.career?.category}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>Salary Range</td>
                      {savedCareers.map((sc) => (
                        <td key={sc.id} style={{ fontWeight: 700, color: 'var(--teal-primary)' }}>
                          {sc.career?.average_salary_range || "Competitive"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>Growth Outlook</td>
                      {savedCareers.map((sc) => (
                        <td key={sc.id}>{sc.career?.job_outlook || "Steady"}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>Min Academic %</td>
                      {savedCareers.map((sc) => (
                        <td key={sc.id}>{sc.career?.min_academic_percentage || 50}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600, color: 'var(--text-subtle)' }}>Work Environment</td>
                      {savedCareers.map((sc) => (
                        <td key={sc.id}>{sc.career?.work_environment || "Collaborative"}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
