import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BarChart3, ArrowLeft, TrendingUp, Users, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getAnalytics();
        setData(res.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating cohort analytics and ML distribution metrics..." />;
  }

  const { skills_analytics = [], education_levels = [], recommendations_analytics = [] } = data || {};

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
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
            System Analytics & Cohort Insights
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Aggregated metrics on student skill averages, academic distributions, and AI career rankings.
          </p>
        </div>

        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          {/* Average Skill Ratings Chart */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Brain size={20} color="var(--primary-accent)" />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>
                Average Skill Proficiencies (1-5 Scale)
              </h3>
            </div>

            {skills_analytics.length > 0 ? (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skills_analytics} margin={{ top: 10, right: 15, left: -15, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="skill" angle={-20} textAnchor="end" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                    <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                    <Bar dataKey="avg_rating" name="Average Rating" fill="var(--primary-accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={{ color: 'var(--text-light)', padding: '2rem 0', textAlign: 'center' }}>
                No student skill ratings recorded yet.
              </p>
            )}
          </div>

          {/* Education Level Breakdown */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Users size={20} color="var(--teal-primary)" />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)' }}>
                Student Education Demographics
              </h3>
            </div>

            {education_levels.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {education_levels.map((ed, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>{ed.level}</span>
                    <span className="badge badge-indigo" style={{ fontSize: '0.82rem' }}>{ed.count} students</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-light)', padding: '2rem 0', textAlign: 'center' }}>
                No education demographic records available.
              </p>
            )}
          </div>
        </div>

        {/* Top Recommended Careers Table */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
            Top Recommended Careers Across Cohort
          </h3>

          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Career Pathway</th>
                  <th>Total AI Recommendations</th>
                  <th>Average Estimated Alignment</th>
                </tr>
              </thead>
              <tbody>
                {recommendations_analytics.length > 0 ? (
                  recommendations_analytics.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700 }}>{r.career}</td>
                      <td>
                        <span className="badge badge-teal">{r.recommendation_count} times</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: 'var(--primary-accent)' }}>
                          {r.avg_score}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-light)' }}>
                      No recommendation data compiled yet. Complete student assessments to populate.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
