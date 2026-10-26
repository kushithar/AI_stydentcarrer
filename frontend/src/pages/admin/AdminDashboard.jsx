import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { 
  Users, 
  Briefcase, 
  ClipboardCheck, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
        setError("Failed to load admin metrics. Ensure your session has administrator privileges.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading administrator analytics..." />;
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Administrator Error</h2>
        <p style={{ color: 'var(--text-muted)' }}>{error}</p>
      </div>
    );
  }

  const { stats, career_popularity, categories_distribution, recent_logs } = data;

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fef3c7', color: '#b45309', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              <ShieldCheck size={14} /> Protected Admin Console
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)' }}>
              System Administration & Analytics
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link to="/admin/careers" className="btn btn-secondary btn-sm">
              <Briefcase size={15} /> Manage Careers
            </Link>
            <Link to="/admin/students" className="btn btn-secondary btn-sm">
              <Users size={15} /> Manage Students
            </Link>
            <Link to="/admin/resources" className="btn btn-secondary btn-sm">
              <BookOpen size={15} /> Manage Courses
            </Link>
            <Link to="/admin/analytics" className="btn btn-primary btn-sm">
              <BarChart3 size={15} /> Full Analytics
            </Link>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Total Students</span>
              <Users size={18} color="var(--primary-accent)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              {stats.total_students}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Active Careers</span>
              <Briefcase size={18} color="var(--teal-primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teal-primary)' }}>
              {stats.active_careers}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Assessments Taken</span>
              <ClipboardCheck size={18} color="var(--violet-primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--violet-primary)' }}>
              {stats.total_assessments}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase' }}>Learning Resources</span>
              <BookOpen size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
              {stats.total_courses}
            </div>
          </div>
        </div>

        {/* Charts & Activity Stream */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Career Popularity Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              Career Recommendation Frequency
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
              How frequently specific careers are generated by the AI engine
            </p>

            {career_popularity && career_popularity.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={career_popularity} margin={{ top: 10, right: 15, left: -15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="title" angle={-15} textAnchor="end" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <Bar dataKey="count" name="Recommendations" fill="var(--teal-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                No recommendation evaluations recorded yet.
              </div>
            )}
          </div>

          {/* Audit Activity Stream */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)' }}>Recent Audit Logs</h3>
              <Activity size={16} color="var(--primary-accent)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', maxHeight: '280px' }}>
              {recent_logs && recent_logs.length > 0 ? (
                recent_logs.map((log) => (
                  <div key={log.id} style={{ background: 'var(--bg-main)', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--primary-navy)', marginBottom: '0.2rem' }}>
                      <span>{log.action}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 400 }}>
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{log.details}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', textAlign: 'center', margin: 'auto 0' }}>
                  No recent activity recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
