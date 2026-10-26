import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Briefcase, Plus, Edit, Trash2, Search, ArrowLeft, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CareerManagement = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const initialForm = {
    title: '',
    category: 'Technology',
    description: '',
    min_academic_percentage: 50,
    average_salary_range: '$70,000 - $120,000',
    job_outlook: 'High Growth',
    work_environment: 'Collaborative / Hybrid',
    is_active: true
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCareers({ search, limit: 50 });
      setCareers(res.data.careers || []);
    } catch (err) {
      console.error("Failed to load careers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const openCreateModal = () => {
    setEditingCareer(null);
    setFormData(initialForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCareer(c);
    setFormData({
      title: c.title,
      category: c.category,
      description: c.description,
      min_academic_percentage: c.min_academic_percentage || 50,
      average_salary_range: c.average_salary_range || '',
      job_outlook: c.job_outlook || '',
      work_environment: c.work_environment || '',
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
      if (editingCareer) {
        await adminApi.updateCareer(editingCareer.id, formData);
      } else {
        await adminApi.createCareer(formData);
      }
      setModalOpen(false);
      fetchCareers();
    } catch (err) {
      console.error("Career save error:", err);
      setFormError(err.response?.data?.error || "Failed to save career record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete career: "${title}"?`)) {
      return;
    }

    try {
      await adminApi.deleteCareer(id);
      setCareers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete career record.");
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
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)' }}>Career Records & Eligibility</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Add, update, activate or deactivate career listings evaluated by the recommendation engine.
            </p>
          </div>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} /> Add New Career
          </button>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search careers by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCareers()}
            />
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner message="Fetching career records..." />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Salary Range</th>
                    <th>Growth Outlook</th>
                    <th>Min %</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {careers.length > 0 ? (
                    careers.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{c.title}</td>
                        <td><span className="badge badge-indigo">{c.category}</span></td>
                        <td>{c.average_salary_range}</td>
                        <td>{c.job_outlook}</td>
                        <td>{c.min_academic_percentage}%</td>
                        <td>
                          <span className={`badge ${c.is_active ? 'badge-emerald' : 'badge-rose'}`}>
                            {c.is_active ? 'Active' : 'Inactive'}
                          </span>
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
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                        No career records match the filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{editingCareer ? "Edit Career Profile" : "Create New Career"}</h3>
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
                  <label className="form-label">Career Title</label>
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
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Data & AI">Data & AI</option>
                      <option value="Design">Design</option>
                      <option value="Business & Management">Business & Management</option>
                      <option value="Finance">Finance</option>
                      <option value="Education & Research">Education & Research</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Min Academic Marks (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-input"
                      value={formData.min_academic_percentage}
                      onChange={(e) => setFormData({ ...formData, min_academic_percentage: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Salary Range</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. $80,000 - $130,000"
                      value={formData.average_salary_range}
                      onChange={(e) => setFormData({ ...formData, average_salary_range: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Outlook</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. High Growth (15%)"
                      value={formData.job_outlook}
                      onChange={(e) => setFormData({ ...formData, job_outlook: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Work Environment</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Collaborative, Remote"
                    value={formData.work_environment}
                    onChange={(e) => setFormData({ ...formData, work_environment: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                  <input
                    type="checkbox"
                    id="is_active_check"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label htmlFor="is_active_check" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Active in Recommendation Engine</label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    <Save size={16} /> {submitting ? "Saving..." : "Save Career"}
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
