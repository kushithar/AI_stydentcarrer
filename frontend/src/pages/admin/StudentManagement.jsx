import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Users, Search, CheckCircle, Ban, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStudents({ search, page, limit: 15 });
      setStudents(res.data.students || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.account_status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to mark ${student.email} as ${newStatus}?`)) {
      return;
    }

    try {
      setUpdatingId(student.id);
      await adminApi.updateStudentStatus(student.id, newStatus);
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, account_status: newStatus } : s))
      );
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update student status.");
    } finally {
      setUpdatingId(null);
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

        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)' }}>Student Account Management</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Inspect registered students, monitor profile completion, and manage account statuses.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search by student full name or email address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner message="Fetching student records..." />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Education & Stream</th>
                    <th>Assessments</th>
                    <th>Profile %</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((st) => (
                      <tr key={st.id}>
                        <td style={{ fontWeight: 600 }}>{st.full_name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{st.email}</td>
                        <td>
                          {st.profile?.education_level || "Not specified"}
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                            {st.profile?.course_stream || "No stream"}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-primary">{st.assessments_count || 0} taken</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>
                            {st.profile?.profile_completion || 20}%
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${st.account_status === 'active' ? 'badge-emerald' : 'badge-rose'}`}>
                            {st.account_status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleStatus(st)}
                            disabled={updatingId === st.id}
                            className={`btn btn-sm ${st.account_status === 'active' ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ fontSize: '0.78rem' }}
                          >
                            {st.account_status === 'active' ? (
                              <>
                                <Ban size={13} /> Suspend
                              </>
                            ) : (
                              <>
                                <CheckCircle size={13} /> Activate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                        No student accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border-light)' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
