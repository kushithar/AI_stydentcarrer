import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BookOpen, Plus, Edit, Trash2, ArrowLeft, ExternalLink, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResourceManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const initialForm = {
    title: '',
    provider: 'freeCodeCamp',
    url: '',
    difficulty: 'Beginner',
    duration: 'Self-paced',
    skill_taught: 'Python',
    cost_type: 'Free',
    description: '',
    is_active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getResources();
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData(initialForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCourse(c);
    setFormData({
      title: c.title,
      provider: c.provider,
      url: c.url,
      difficulty: c.difficulty || 'Beginner',
      duration: c.duration || '',
      skill_taught: c.skill_taught || '',
      cost_type: c.cost_type || 'Free',
      description: c.description || '',
      is_active: c.is_active ?? true
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      if (editingCourse) {
        await adminApi.updateResource(editingCourse.id, formData);
      } else {
        await adminApi.createResource(formData);
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error("Resource save error:", err);
      setFormError(err.response?.data?.error || "Failed to save learning resource.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete course: "${title}"?`)) {
      return;
    }

    try {
      await adminApi.deleteResource(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete resource.");
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-subtle)', fontSize: '0.9rem', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to Admin Console
          </Link>
        </div>

        {/* Title & Add Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)' }}>Learning Resources & Courses</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Manage verified learning resources associated with career roadmaps.
            </p>
          </div>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} /> Add Learning Resource
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner message="Fetching courses..." />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Title & Provider</th>
                    <th>Skill Taught</th>
                    <th>Difficulty</th>
                    <th>Cost</th>
                    <th>Link</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{c.title}</div>
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{c.provider}</span>
                        </td>
                        <td>{c.skill_taught}</td>
                        <td>{c.difficulty}</td>
                        <td>
                          <span className="badge badge-emerald">{c.cost_type}</span>
                        </td>
                        <td>
                          <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                            Visit <ExternalLink size={12} />
                          </a>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button onClick={() => openEditModal(c)} className="btn btn-secondary btn-sm" title="Edit">
                              <Edit size={13} />
                            </button>
                            <button onClick={() => handleDelete(c.id, c.title)} className="btn btn-danger btn-sm" title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                        No learning resources registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{editingCourse ? "Edit Resource" : "Add Learning Resource"}</h3>
                <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Provider Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. freeCodeCamp, Kaggle, MDN"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Skill Taught</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Python, SQL"
                      value={formData.skill_taught}
                      onChange={(e) => setFormData({ ...formData, skill_taught: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Resource URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-select"
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Beginner-Intermediate">Beginner-Intermediate</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cost</label>
                    <select
                      className="form-select"
                      value={formData.cost_type}
                      onChange={(e) => setFormData({ ...formData, cost_type: e.target.value })}
                    >
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    <Save size={16} /> {submitting ? "Saving..." : "Save Resource"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
