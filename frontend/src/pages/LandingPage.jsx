import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  Brain, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  LineChart, 
  Palette, 
  Briefcase, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Layers,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const categories = [
    { title: "Technology & Software", count: "4 Careers", icon: <Code2 size={24} color="#2563eb" />, desc: "Software engineering, web development, cloud computing, and cybersecurity." },
    { title: "Data & Artificial Intelligence", count: "3 Careers", icon: <Brain size={24} color="#7c3aed" />, desc: "Machine learning, data science, statistical modeling, and data analytics." },
    { title: "Design & User Experience", count: "1 Career", icon: <Palette size={24} color="#0d9488" />, desc: "UI/UX design, interactive prototyping, and accessible design systems." },
    { title: "Business & Management", count: "3 Careers", icon: <Briefcase size={24} color="#f59e0b" />, desc: "Product management, business analysis, and digital marketing strategy." },
    { title: "Finance & Economics", count: "1 Career", icon: <LineChart size={24} color="#10b981" />, desc: "Financial modeling, DCF valuation, and capital markets analytics." },
    { title: "Education & Research", count: "2 Careers", icon: <GraduationCap size={24} color="#ec4899" />, desc: "Scientific research, hypothesis testing, and academic pedagogy." },
  ];

  const steps = [
    { num: "01", title: "Complete Holistic Assessment", desc: "Share your academic performance, evaluate your technical & soft skills, and declare your domain interests." },
    { num: "02", title: "Explainable AI Evaluation", desc: "Our transparent hybrid recommendation engine analyzes your multi-attribute profile using cosine similarity and weighted scoring." },
    { num: "03", title: "Review Personalized Matches", desc: "Understand why each career was recommended with transparent matching skills, growth areas, and academic alignment." },
    { num: "04", title: "Follow Verified Roadmaps", desc: "Access 4-stage beginner-to-advanced learning roadmaps and accredited free courses to master missing skills." },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
        padding: '5rem 0 4rem',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0e7ff', color: '#4338ca', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={15} /> Transparent • Data-Driven • Explainable
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, color: 'var(--primary-navy)', maxWidth: '900px', margin: '0 auto 1.5rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Discover Your Ideal Career Pathway with <span style={{ background: 'linear-gradient(135deg, #1e3a8a, #4338ca, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Explainable AI</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Eliminate career uncertainty. Receive personalized recommendations tailored to your unique skills, academic strengths, and passions — with transparent reasoning, skill gap analysis, and verified learning roadmaps.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            {isAuthenticated ? (
              <Link to={isAdmin ? "/admin/dashboard" : "/dashboard"} className="btn btn-primary btn-lg">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  <Sparkles size={18} /> Take Career Assessment
                </Link>
                <Link to="/careers" className="btn btn-secondary btn-lg">
                  Explore Careers Catalog
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
            maxWidth: '920px',
            margin: '0 auto',
            background: 'white',
            padding: '1.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)'
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-navy)' }}>14+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Curated Career Profiles</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-accent)' }}>22+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Skills Evaluated</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--teal-primary)' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Transparent AI Reasoning</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--violet-primary)' }}>Free</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Open Educational Roadmaps</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Comparison */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>The Evolution</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Why Modern Career Guidance Needs AI</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Traditional generic counseling fails to bridge individual student attributes with rapidly changing industry expectations.
            </p>
          </div>

          <div className="grid-2">
            {/* Traditional */}
            <div className="card" style={{ borderLeft: '4px solid #ef4444', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#b91c1c', fontWeight: 700 }}>
                Traditional Career Guidance
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>❌ One-size-fits-all recommendations based purely on test scores.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>❌ Zero explanation of why a career was suggested.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>❌ Omits modern tech and design paths like Cloud Engineering or UI/UX.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>❌ No practical learning roadmaps or free course suggestions.</li>
              </ul>
            </div>

            {/* AI-Based Solution */}
            <div className="card" style={{ borderLeft: '4px solid #10b981', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#047857', fontWeight: 700 }}>
                CareerAI Recommendation System
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>✅ Multi-dimensional evaluation (Interests 35%, Skills 30%, Academics 20%, Work-Style 15%).</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>✅ Explainable match reasoning with detailed skill gap breakdown.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>✅ High-growth modern careers spanning AI, Software, Design, and Finance.</li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>✅ 4-stage actionable learning roadmaps linked to accredited free courses.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (4 Steps) */}
      <section className="section" style={{ backgroundColor: 'white', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>Methodology</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>How the Recommendation Engine Works</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              A systematic, transparent process translating your self-reported strengths into data-backed career roadmaps.
            </p>
          </div>

          <div className="grid-4">
            {steps.map((st, i) => (
              <div key={i} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: 'var(--primary-accent)',
                  marginBottom: '0.75rem',
                  opacity: 0.8
                }}>
                  {st.num}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: 'var(--primary-navy)' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Categories Showcase */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>Disciplines</span>
              <h2 style={{ fontSize: '2.2rem' }}>Explore Career Categories</h2>
              <p style={{ color: 'var(--text-muted)' }}>Diverse domains designed for high-impact 21st-century careers.</p>
            </div>
            <Link to="/careers" className="btn btn-secondary">
              View All 14 Careers <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {categories.map((cat, i) => (
              <div key={i} className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.6rem', borderRadius: '10px' }}>
                    {cat.icon}
                  </div>
                  <span className="badge badge-primary">{cat.count}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{cat.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', flex: 1 }}>{cat.desc}</p>
                <Link to={`/careers?category=${encodeURIComponent(cat.title.split(' ')[0])}`} style={{ fontSize: '0.88rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  Browse category <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        color: 'white',
        padding: '5rem 0',
        textAlign: 'center'
      }}>
        <div className="container container-narrow">
          <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to Find Your Purpose?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join students making informed, confident educational and career decisions through individualized, explainable guidance.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ background: 'white', color: '#1e3a8a' }}>
              <Sparkles size={18} /> Start Free Assessment
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
