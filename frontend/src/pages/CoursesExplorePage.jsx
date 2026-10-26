import React, { useEffect, useState } from 'react';
import { courseApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BookOpen, ExternalLink, Search, Filter, CheckCircle2 } from 'lucide-react';

export const CoursesExplorePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [costType, setCostType] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (difficulty) params.difficulty = difficulty;
      if (costType) params.cost_type = costType;

      const res = await courseApi.listCourses(params);
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [difficulty, costType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div style={{ padding: '3rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>Accredited & Open</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
            Verified Learning Resources & Courses
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
            Curated high-quality, free and open certifications from leading global institutions (freeCodeCamp, Kaggle, MDN, Microsoft Learn, AWS).
          </p>
        </div>

        {/* Filter bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search by topic, skill, or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div style={{ minWidth: '160px' }}>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Beginner-Intermediate">Beginner-Intermediate</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div style={{ minWidth: '140px' }}>
              <select
                className="form-select"
                value={costType}
                onChange={(e) => setCostType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Filter
            </button>
          </form>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <LoadingSpinner message="Fetching verified learning resources..." />
        ) : courses.length > 0 ? (
          <div className="grid-3">
            {courses.map((course) => (
              <div key={course.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{course.provider}</span>
                  <span className="badge badge-emerald">{course.cost_type || "Free"}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                  {course.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1 }}>
                  {course.description}
                </p>

                <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '1.25rem' }}>
                  <div style={{ marginBottom: '0.2rem' }}>Skill: <strong>{course.skill_taught}</strong></div>
                  <div>Level: <strong>{course.difficulty}</strong> • Duration: <strong>{course.duration || "Self-paced"}</strong></div>
                </div>

                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%' }}
                >
                  Start Course <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <BookOpen size={40} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
            <h3>No Courses Match Your Criteria</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
