import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { careerApi } from '../services/api';
import { CareerCard } from '../components/CareerCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Search, Filter, Briefcase } from 'lucide-react';

export const CareersExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  const categories = [
    "All Categories",
    "Technology",
    "Data & AI",
    "Design",
    "Business & Management",
    "Finance",
    "Education & Research"
  ];

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory && selectedCategory !== "All Categories") {
        params.category = selectedCategory;
      }
      const res = await careerApi.listCareers(params);
      setCareers(res.data.careers || []);
    } catch (err) {
      console.error("Failed to load careers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCareers();
  };

  return (
    <div style={{ padding: '3rem 0 5rem', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>Directory</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
            Explore Career Pathways
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Discover industry-benchmarked career profiles, prerequisite skills, salary outlooks, and learning tracks.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search careers by title, description, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            {categories.map((cat) => {
              const active = (!selectedCategory && cat === "All Categories") || selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === "All Categories" ? "" : cat)}
                  style={{
                    background: active ? 'var(--primary-navy)' : 'var(--bg-subtle)',
                    color: active ? 'white' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <LoadingSpinner message="Searching career profiles..." />
        ) : careers.length > 0 ? (
          <div className="grid-3">
            {careers.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <Briefcase size={40} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
            <h3>No Careers Match Your Criteria</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try clearing your filters or searching for broader terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};
