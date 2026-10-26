import React, { useEffect, useState } from 'react';
import { studentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { User, CheckCircle2, AlertCircle, Save, BookOpen, GraduationCap } from 'lucide-react';

export const StudentProfilePage = () => {
  const { updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    education_level: '',
    course_stream: '',
    academic_percentage: '',
    preferred_subjects: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getProfile();
        const p = res.data.profile;
        setProfile(p);
        setFormData({
          education_level: p.education_level || 'Undergraduate',
          course_stream: p.course_stream || '',
          academic_percentage: p.academic_percentage !== null ? String(p.academic_percentage) : '',
          preferred_subjects: Array.isArray(p.preferred_subjects) ? p.preferred_subjects.join(', ') : '',
          bio: p.bio || ''
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatusMsg({ type: '', text: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const payload = {
        education_level: formData.education_level,
        course_stream: formData.course_stream,
        academic_percentage: formData.academic_percentage ? parseFloat(formData.academic_percentage) : null,
        preferred_subjects: formData.preferred_subjects.split(',').map((s) => s.trim()).filter(Boolean),
        bio: formData.bio
      };

      const res = await studentApi.updateProfile(payload);
      setProfile(res.data.profile);
      updateUserProfile(res.data.profile);
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error("Save error:", err);
      setStatusMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div style={{ padding: '3rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container container-narrow">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
              Student Profile & Academics
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Manage your academic background, stream, and learning focus
            </p>
          </div>

          <div style={{ background: 'white', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Profile Completion</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-accent)' }}>
                {profile?.profile_completion || 20}%
              </div>
            </div>
            <div className="progress-bar-container" style={{ width: '100px', height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: `${profile?.profile_completion || 20}%` }} />
            </div>
          </div>
        </div>

        {statusMsg.text && (
          <div style={{
            background: statusMsg.type === 'success' ? '#ecfdf5' : '#fee2e2',
            border: `1px solid ${statusMsg.type === 'success' ? '#a7f3d0' : '#fca5a5'}`,
            color: statusMsg.type === 'success' ? '#047857' : '#b91c1c',
            padding: '0.85rem 1.2rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prof-edu">Education Level</label>
                <select
                  id="prof-edu"
                  name="education_level"
                  className="form-select"
                  value={formData.education_level}
                  onChange={handleChange}
                >
                  <option value="High School">High School (10th/12th)</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Undergraduate">Undergraduate (Bachelors / B.Tech / B.Sc)</option>
                  <option value="Postgraduate">Postgraduate (Masters / MBA / M.Tech)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-stream">Degree, Course or Stream</label>
                <input
                  id="prof-stream"
                  name="course_stream"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science, Mechanical Engineering"
                  value={formData.course_stream}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="prof-pct">Academic Percentage / Marks (%)</label>
                <input
                  id="prof-pct"
                  name="academic_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 82.5"
                  value={formData.academic_percentage}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-subjs">Preferred Subjects</label>
                <input
                  id="prof-subjs"
                  name="preferred_subjects"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mathematics, Programming, Economics"
                  value={formData.preferred_subjects}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-bio">Short Academic Bio or Career Goals</label>
              <textarea
                id="prof-bio"
                name="bio"
                rows="3"
                className="form-textarea"
                placeholder="Share your aspirational fields or projects you wish to work on..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
