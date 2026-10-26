import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentApi } from '../services/api';
import { SkillRatingInput } from '../components/SkillRatingInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  GraduationCap, 
  Code2, 
  BrainCircuit, 
  Users2, 
  Compass, 
  AlertCircle 
} from 'lucide-react';

export const AssessmentPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Academics
  const [academics, setAcademics] = useState({
    education_level: 'Undergraduate',
    course_stream: 'Computer Science',
    academic_percentage: '82',
    preferred_subjects: 'Computer Science, Mathematics, Algorithms'
  });

  // Step 2: Technical Skills
  const [technicalSkills, setTechnicalSkills] = useState({
    "Python": 4,
    "JavaScript": 3,
    "SQL & Relational Databases": 4,
    "HTML5 & Modern CSS": 3,
    "React.js": 3,
    "Machine Learning Algorithms": 3,
    "Deep Learning & Neural Networks": 2,
    "Cloud Computing & AWS": 2,
    "Network Security & Cryptography": 2,
    "Docker & Containerization": 2,
    "API & Microservice Design": 3
  });

  // Step 3: Analytical & Problem Solving
  const [analyticalSkills, setAnalyticalSkills] = useState({
    "Algorithmic Problem Solving": 4,
    "Statistical Analysis & Hypothesis Testing": 3,
    "Data Visualization & Dashboards": 3,
    "Financial Modeling & Valuation": 1
  });

  // Step 4: Soft Skills, Design & Leadership
  const [softSkills, setSoftSkills] = useState({
    "UI/UX & Wireframing": 2,
    "Design Systems & Accessibility": 2,
    "Technical Writing & Documentation": 4,
    "Agile Teamwork & Collaboration": 4,
    "Project Leadership & Organization": 3,
    "Product Strategy & Roadmapping": 2,
    "Digital Marketing & SEO": 2
  });

  // Step 5: Career Domain Interests (1-5 scale)
  const [interests, setInterests] = useState({
    "Software Development": 5,
    "Artificial Intelligence and Machine Learning": 5,
    "Data Science and Analytics": 4,
    "Web and Mobile Development": 4,
    "Cloud Computing and DevOps": 3,
    "Cybersecurity": 2,
    "UI/UX and Design": 3,
    "Business and Management": 3,
    "Finance and Accounting": 2,
    "Research and Academia": 3
  });

  // Step 6: Work Style & Aptitude (1-5 scale)
  const [workStyle, setWorkStyle] = useState({
    analytical_depth: 4,
    teamwork: 4,
    creativity: 3,
    leadership: 3
  });

  const totalSteps = 6;

  const handleNext = () => {
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    // Format payload
    const parsedSubjects = academics.preferred_subjects
      ? academics.preferred_subjects.split(',').map((s) => s.strip ? s.strip() : s.trim()).filter(Boolean)
      : [];

    const interestList = Object.entries(interests).map(([cat, val]) => ({
      interest_category: cat,
      preference_rating: val
    }));

    const payload = {
      education_level: academics.education_level,
      course_stream: academics.course_stream,
      academic_percentage: academics.academic_percentage ? parseFloat(academics.academic_percentage) : null,
      preferred_subjects: parsedSubjects,
      technical_skills: technicalSkills,
      analytical_skills: analyticalSkills,
      soft_skills: softSkills,
      interests: interestList,
      work_style: workStyle
    };

    try {
      const res = await assessmentApi.submitAssessment(payload);
      const assessmentId = res.data.assessment_id;
      // Navigate to results
      navigate(`/assessments/${assessmentId}/results`);
    } catch (err) {
      console.error("Submission failed:", err);
      setError(err.response?.data?.error || "Failed to evaluate assessment. Please try again.");
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <LoadingSpinner message="Evaluating multi-vector profile alignment with scikit-learn recommendation engine..." />
        <p style={{ marginTop: '1rem', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
          Analyzing interest similarities, calculating skill gap matrices, and mapping personalized course roadmaps...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container container-narrow">
        {/* Wizard Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <span className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
            Multi-Attribute Evaluation • Step {currentStep} of {totalSteps}
          </span>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
            Comprehensive Career Assessment
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Rate your skills honestly. Beginner ratings are welcomed and help identify targeted growth opportunities.
          </p>

          {/* Progress Bar */}
          <div className="progress-bar-container" style={{ marginTop: '1.5rem', height: '10px' }}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Academic Background */}
        {currentStep === 1 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <GraduationCap size={24} color="var(--primary-accent)" />
              <h2 style={{ fontSize: '1.3rem' }}>Academic Background & Interests</h2>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Current Education Level</label>
                <select
                  className="form-select"
                  value={academics.education_level}
                  onChange={(e) => setAcademics({ ...academics, education_level: e.target.value })}
                >
                  <option value="High School">High School (10th/12th)</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Undergraduate">Undergraduate (Bachelors / B.Tech / B.Sc)</option>
                  <option value="Postgraduate">Postgraduate (Masters / M.Tech / MBA)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Degree, Course or Stream</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science, Commerce"
                  value={academics.course_stream}
                  onChange={(e) => setAcademics({ ...academics, course_stream: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Academic Marks / Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g. 78.5 (Optional)"
                  value={academics.academic_percentage}
                  onChange={(e) => setAcademics({ ...academics, academic_percentage: e.target.value })}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  Missing marks will not penalize your recommendations.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Academic Subjects</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Comma separated: Mathematics, Coding, Statistics"
                  value={academics.preferred_subjects}
                  onChange={(e) => setAcademics({ ...academics, preferred_subjects: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Technical Skills */}
        {currentStep === 2 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <Code2 size={24} color="var(--primary-accent)" />
              <div>
                <h2 style={{ fontSize: '1.3rem' }}>Technical Skills Rating</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Rate your current comfort on a 1-5 scale (1 = Beginner, 5 = Expert)</p>
              </div>
            </div>

            {Object.entries(technicalSkills).map(([skill, val]) => (
              <SkillRatingInput
                key={skill}
                label={skill}
                category="Technical"
                value={val}
                onChange={(newVal) => setTechnicalSkills({ ...technicalSkills, [skill]: newVal })}
              />
            ))}
          </div>
        )}

        {/* Step 3: Analytical & Problem Solving */}
        {currentStep === 3 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <BrainCircuit size={24} color="var(--teal-primary)" />
              <div>
                <h2 style={{ fontSize: '1.3rem' }}>Analytical & Problem Solving Abilities</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Quantitative thinking, logic, statistical inquiry, and data modeling</p>
              </div>
            </div>

            {Object.entries(analyticalSkills).map(([skill, val]) => (
              <SkillRatingInput
                key={skill}
                label={skill}
                category="Analytical"
                value={val}
                onChange={(newVal) => setAnalyticalSkills({ ...analyticalSkills, [skill]: newVal })}
              />
            ))}
          </div>
        )}

        {/* Step 4: Soft Skills, Design & Leadership */}
        {currentStep === 4 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <Users2 size={24} color="var(--violet-primary)" />
              <div>
                <h2 style={{ fontSize: '1.3rem' }}>Design, Communication & Leadership</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>User empathy, writing, teamwork, and project organization</p>
              </div>
            </div>

            {Object.entries(softSkills).map(([skill, val]) => (
              <SkillRatingInput
                key={skill}
                label={skill}
                category="Interpersonal & Design"
                value={val}
                onChange={(newVal) => setSoftSkills({ ...softSkills, [skill]: newVal })}
              />
            ))}
          </div>
        )}

        {/* Step 5: Career Interests & Domain Focus */}
        {currentStep === 5 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <Compass size={24} color="var(--primary-accent)" />
              <div>
                <h2 style={{ fontSize: '1.3rem' }}>Career Interests & Preferred Domains</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>What industries and problem spaces genuinely excite you?</p>
              </div>
            </div>

            {Object.entries(interests).map(([domain, val]) => (
              <SkillRatingInput
                key={domain}
                label={domain}
                category="Domain Interest"
                value={val}
                onChange={(newVal) => setInterests({ ...interests, [domain]: newVal })}
              />
            ))}
          </div>
        )}

        {/* Step 6: Work Style & Review */}
        {currentStep === 6 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <CheckCircle2 size={24} color="var(--teal-primary)" />
              <div>
                <h2 style={{ fontSize: '1.3rem' }}>Work Style & Ready to Generate</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Final work environment preferences before calculating recommendations</p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <SkillRatingInput
                label="Analytical Depth"
                category="Preference"
                description="I enjoy deep problem-solving, researching data, and technical intricacies"
                value={workStyle.analytical_depth}
                onChange={(v) => setWorkStyle({ ...workStyle, analytical_depth: v })}
              />
              <SkillRatingInput
                label="Collaborative Teamwork"
                category="Preference"
                description="I thrive when brainstorming, communicating, and building alongside peers"
                value={workStyle.teamwork}
                onChange={(v) => setWorkStyle({ ...workStyle, teamwork: v })}
              />
              <SkillRatingInput
                label="Creative Freedom"
                category="Preference"
                description="I value designing new visual concepts, experimenting, and innovating"
                value={workStyle.creativity}
                onChange={(v) => setWorkStyle({ ...workStyle, creativity: v })}
              />
              <SkillRatingInput
                label="Leadership & Ownership"
                category="Preference"
                description="I enjoy coordinating timelines, aligning requirements, and taking strategic initiative"
                value={workStyle.leadership}
                onChange={(v) => setWorkStyle({ ...workStyle, leadership: v })}
              />
            </div>

            {/* Assessment Summary Box */}
            <div style={{ background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>Ready for Evaluation</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Your self-assessed attributes will be evaluated across 14 industry career profiles using scikit-learn cosine similarity and weighted attribute matching.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          {currentStep > 1 ? (
            <button type="button" onClick={handlePrev} className="btn btn-secondary">
              <ArrowLeft size={16} /> Previous
            </button>
          ) : <div />}

          {currentStep < totalSteps ? (
            <button type="button" onClick={handleNext} className="btn btn-primary">
              Next Section <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn btn-accent btn-lg">
              <Sparkles size={18} /> Generate Recommendations
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
