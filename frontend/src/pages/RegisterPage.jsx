import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, AlertCircle, Sparkles, GraduationCap } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    education_level: 'Undergraduate',
    course_stream: 'Computer Science'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await register(formData);
      // Direct newly registered student to take the assessment
      navigate('/assessment');
    } catch (err) {
      console.error("Registration error:", err);
      const msg = err.response?.data?.error || 'Registration failed. Please verify your inputs and try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #1e3a8a, #4338ca)',
            color: 'white',
            padding: '0.65rem',
            borderRadius: '12px',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 10px rgba(30, 58, 138, 0.25)'
          }}>
            <Compass size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>Create Student Profile</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Get personalized career recommendations tailored to your goals</p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              name="full_name"
              type="text"
              className="form-input"
              placeholder="e.g. Alex Morgan"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Min 6 chars"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                name="confirm_password"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-edu">Education Level</label>
              <select
                id="reg-edu"
                name="education_level"
                className="form-select"
                value={formData.education_level}
                onChange={handleChange}
              >
                <option value="High School">High School (10th/12th)</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="Undergraduate">Undergraduate (Bachelors)</option>
                <option value="Postgraduate">Postgraduate (Masters/PhD)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-stream">Course or Stream</label>
              <input
                id="reg-stream"
                name="course_stream"
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science, Commerce"
                value={formData.course_stream}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Creating Profile...' : (
              <>
                <Sparkles size={18} /> Complete Registration & Start Assessment
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary-accent)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
