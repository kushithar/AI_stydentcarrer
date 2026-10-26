"""
AI/ML Explainable Career Recommendation Engine
Combines vector cosine similarity (via scikit-learn), weighted multi-attribute
scoring, and gap analysis to generate transparent, personalized career recommendations.
"""

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from app.recommendation.career_knowledge import CAREER_PROJECTS, ROADMAP_TEMPLATES

DEFAULT_WEIGHTS = {
    'interest': 0.35,
    'skill': 0.30,
    'academic': 0.20,
    'work_style': 0.15
}

# Standardized Interest Universe
INTEREST_DOMAINS = [
    "Artificial Intelligence and Machine Learning",
    "Data Science and Analytics",
    "Software Development",
    "Cybersecurity",
    "Web and Mobile Development",
    "UI/UX and Design",
    "Business and Management",
    "Finance and Accounting",
    "Research and Academia",
    "Teaching and Education",
    "Digital Marketing",
    "Cloud Computing and DevOps"
]

# Mapping Careers to Primary Interest Domains
CAREER_INTEREST_MAP = {
    "Software Developer": ["Software Development", "Web and Mobile Development", "Cloud Computing and DevOps"],
    "Web Developer": ["Web and Mobile Development", "Software Development", "UI/UX and Design"],
    "Data Analyst": ["Data Science and Analytics", "Business and Management", "Finance and Accounting"],
    "Data Scientist": ["Data Science and Analytics", "Artificial Intelligence and Machine Learning", "Research and Academia"],
    "AI/ML Engineer": ["Artificial Intelligence and Machine Learning", "Data Science and Analytics", "Software Development"],
    "Cybersecurity Analyst": ["Cybersecurity", "Cloud Computing and DevOps", "Software Development"],
    "Cloud Engineer": ["Cloud Computing and DevOps", "Software Development", "Cybersecurity"],
    "UI/UX Designer": ["UI/UX and Design", "Web and Mobile Development", "Digital Marketing"],
    "Business Analyst": ["Business and Management", "Data Science and Analytics", "Finance and Accounting"],
    "Digital Marketing Specialist": ["Digital Marketing", "Business and Management", "UI/UX and Design"],
    "Financial Analyst": ["Finance and Accounting", "Data Science and Analytics", "Business and Management"],
    "Researcher": ["Research and Academia", "Data Science and Analytics", "Artificial Intelligence and Machine Learning"],
    "Teacher or Educator": ["Teaching and Education", "Research and Academia", "Software Development"],
    "Product Manager": ["Business and Management", "UI/UX and Design", "Software Development"]
}

class RecommendationEngine:
    def __init__(self, weights=None):
        self.weights = weights or DEFAULT_WEIGHTS.copy()
        # Ensure weights sum to 1.0
        total_w = sum(self.weights.values())
        if total_w > 0:
            self.weights = {k: v / total_w for k, v in self.weights.items()}

    def _normalize_rating(self, val, min_val=1.0, max_val=5.0):
        """Normalizes 1-5 scale to [0.2, 1.0]. None returns neutral prior 0.4"""
        if val is None:
            return 0.4
        try:
            v = float(val)
            v = max(min_val, min(v, max_val))
            return 0.2 + (v - 1.0) * (0.8 / 4.0)
        except (ValueError, TypeError):
            return 0.4

    def _build_interest_vector(self, student_interests):
        """
        Builds a normalized vector of interests over INTEREST_DOMAINS using scikit-learn vector form.
        """
        vec = []
        # student_interests can be dict of {domain_name: 1-5} or list of {interest_category, preference_rating}
        interest_lookup = {}
        if isinstance(student_interests, list):
            for item in student_interests:
                if isinstance(item, dict):
                    name = item.get('interest_category') or item.get('category') or item.get('name')
                    rating = item.get('preference_rating') or item.get('rating', 3)
                    if name:
                        interest_lookup[name.strip().lower()] = float(rating)
        elif isinstance(student_interests, dict):
            for k, v in student_interests.items():
                interest_lookup[k.strip().lower()] = float(v)

        for domain in INTEREST_DOMAINS:
            d_lower = domain.lower()
            matched_rating = None
            for key, score in interest_lookup.items():
                if key in d_lower or d_lower in key:
                    matched_rating = score
                    break
            vec.append(self._normalize_rating(matched_rating) if matched_rating is not None else 0.3)

        return np.array(vec).reshape(1, -1)

    def _build_career_interest_vector(self, career_title, career_category):
        """Constructs target interest feature vector for a career"""
        primary_domains = CAREER_INTEREST_MAP.get(career_title, [])
        vec = []
        for domain in INTEREST_DOMAINS:
            if domain in primary_domains:
                vec.append(1.0)
            elif career_category and career_category.lower() in domain.lower():
                vec.append(0.8)
            else:
                vec.append(0.15)
        return np.array(vec).reshape(1, -1)

    def _calculate_interest_score(self, student_vec, career_vec):
        """Computes cosine similarity between student and career interest vectors"""
        sim = cosine_similarity(student_vec, career_vec)[0][0]
        # Map cosine similarity [-1, 1] to [0, 1]
        return float(max(0.0, min(1.0, (sim + 1.0) / 2.0)))

    def _calculate_skill_score(self, student_skills, career_skills):
        """
        Calculates skill alignment, matching skills, and skills to improve.
        student_skills: dict {skill_name_lower: rating 1-5}
        career_skills: list of CareerSkill objects or dicts
        """
        if not career_skills:
            return 0.7, [], []

        total_weight = 0.0
        weighted_score = 0.0
        matching_skills = []
        skills_to_improve = []

        for cs in career_skills:
            # cs can be CareerSkill model or dict
            if hasattr(cs, 'skill') and cs.skill:
                s_name = cs.skill.name
                s_category = cs.skill.category
                is_req = cs.designation == 'required'
                imp_w = cs.importance_weight or 1.0
                min_rating = cs.minimum_rating or 3
            elif isinstance(cs, dict):
                s_name = cs.get('skill_name') or cs.get('name')
                s_category = cs.get('category', 'Technical')
                is_req = cs.get('designation', 'required') == 'required'
                imp_w = cs.get('importance_weight', 1.0)
                min_rating = cs.get('minimum_rating', 3)
            else:
                continue

            if not s_name:
                continue

            w = imp_w * (1.5 if is_req else 1.0)
            total_weight += w

            # Student rating lookup
            s_lower = s_name.strip().lower()
            student_rating = student_skills.get(s_lower)

            if student_rating is not None:
                rating_num = float(student_rating)
                # Normalized ratio against expected min_rating
                ratio = min(1.3, rating_num / max(1.0, float(min_rating)))
                # Base score for this skill
                skill_alignment = min(1.0, ratio)
                weighted_score += skill_alignment * w

                if rating_num >= min_rating:
                    matching_skills.append({
                        "skill": s_name,
                        "category": s_category,
                        "student_rating": int(rating_num),
                        "required_level": int(min_rating),
                        "status": "Proficient" if rating_num > min_rating else "Meets Baseline"
                    })
                else:
                    skills_to_improve.append({
                        "skill": s_name,
                        "category": s_category,
                        "student_rating": int(rating_num),
                        "required_level": int(min_rating),
                        "gap": round(min_rating - rating_num, 1),
                        "priority": "High" if is_req else "Medium"
                    })
            else:
                # Unreported skill: neutral prior 0.4, do not penalize as 0
                weighted_score += 0.4 * w
                skills_to_improve.append({
                    "skill": s_name,
                    "category": s_category,
                    "student_rating": 1,
                    "required_level": int(min_rating),
                    "gap": int(min_rating) - 1,
                    "priority": "High" if is_req else "Medium"
                })

        overall_skill_score = weighted_score / max(0.001, total_weight)
        return float(max(0.0, min(1.0, overall_skill_score))), matching_skills, skills_to_improve

    def _calculate_academic_score(self, student_percentage, preferred_subjects, career_subjects, min_academic_pct):
        """Calculates academic performance and subject affinity alignment"""
        # Academic score handling: missing marks does NOT equal zero
        if student_percentage is not None:
            try:
                pct = float(student_percentage)
                min_pct = float(min_academic_pct or 50.0)
                if pct >= min_pct:
                    perf_score = 0.7 + 0.3 * min(1.0, (pct - min_pct) / max(10.0, 100.0 - min_pct))
                else:
                    # Mild reduction, not exclusion
                    perf_score = max(0.4, 0.7 - 0.3 * ((min_pct - pct) / min_pct))
            except (ValueError, TypeError):
                perf_score = 0.7
        else:
            perf_score = 0.7  # Neutral prior for missing academic percentage

        # Subject overlap
        subject_score = 0.6  # Default neutral
        academic_strengths = []
        if preferred_subjects and career_subjects:
            student_subjs = {s.strip().lower() for s in preferred_subjects if s and s.strip()}
            career_subjs = {s.strip().lower() for s in career_subjects if s and s.strip()}

            overlap = student_subjs.intersection(career_subjs)
            for s in student_subjs:
                for cs in career_subjs:
                    if s in cs or cs in s:
                        overlap.add(s)

            if career_subjs:
                subject_score = min(1.0, 0.4 + 0.6 * (len(overlap) / max(1, len(career_subjs))))
                academic_strengths = [s.title() for s in overlap]

        total_academic = 0.5 * perf_score + 0.5 * subject_score
        return float(max(0.0, min(1.0, total_academic))), academic_strengths

    def _calculate_work_style_score(self, student_work_style, career_work_environment):
        """Aligns student work style (teamwork, leadership, analytical, creative) with career environment"""
        if not student_work_style:
            return 0.75  # Neutral default

        env_lower = (career_work_environment or "").lower()
        score = 0.7

        # Evaluate preferences
        analytical_pref = self._normalize_rating(student_work_style.get('analytical_depth', 3))
        team_pref = self._normalize_rating(student_work_style.get('teamwork', 3))
        creative_pref = self._normalize_rating(student_work_style.get('creativity', 3))
        leadership_pref = self._normalize_rating(student_work_style.get('leadership', 3))

        components = []
        if 'analytical' in env_lower or 'data' in env_lower or 'research' in env_lower:
            components.append(analytical_pref)
        if 'collaborative' in env_lower or 'team' in env_lower or 'cross-functional' in env_lower:
            components.append(team_pref)
        if 'creative' in env_lower or 'design' in env_lower or 'innovative' in env_lower:
            components.append(creative_pref)
        if 'lead' in env_lower or 'management' in env_lower:
            components.append(leadership_pref)

        if components:
            score = float(np.mean(components))

        return float(max(0.2, min(1.0, score)))

    def _generate_explanation(self, career_title, match_score, interest_score, skill_score, academic_score, matching_skills, skills_to_improve, matched_interests):
        """Synthesizes human-readable, transparent explanation for the recommendation"""
        sentences = []

        # Opening summary with safeguard notice
        score_pct = round(match_score, 1)
        if score_pct >= 80:
            sentences.append(f"We estimated a strong profile alignment of {score_pct}% for {career_title}.")
        elif score_pct >= 65:
            sentences.append(f"You exhibit a promising profile alignment of {score_pct}% with the {career_title} pathway.")
        else:
            sentences.append(f"The {career_title} role aligns moderately ({score_pct}%) with your foundational attributes and presents a viable growth opportunity.")

        # Interest narrative
        if matched_interests:
            top_ints = ", ".join(matched_interests[:3])
            sentences.append(f"Your declared interests in {top_ints} directly reflect the core challenges and daily focus of this field.")
        elif interest_score > 0.6:
            sentences.append("Your broader technical and professional preferences show strong natural resonance with this field's problem domain.")

        # Skills narrative
        if matching_skills:
            prof_names = [f"{s['skill']} ({s['status']})" for s in matching_skills[:3]]
            sentences.append(f"Key skill strengths that already support your candidacy include {', '.join(prof_names)}.")

        # Growth area narrative
        if skills_to_improve:
            top_gaps = [s['skill'] for s in skills_to_improve[:3]]
            sentences.append(f"To reach full readiness for competitive roles, prioritize developing proficiency in: {', '.join(top_gaps)}.")

        # Disclaimer safeguard
        sentences.append("Note: This recommendation is an estimated profile alignment based on your self-reported inputs, not a guarantee of employment or admission.")

        return " ".join(sentences)

    def generate_recommendations(self, student_profile_data, careers, all_skills=None, top_n=10):
        """
        Main recommendation generation entrypoint.
        student_profile_data: dict containing:
          - 'interests': list of {interest_category, preference_rating} or dict
          - 'skills': list of {skill_name, proficiency_rating} or dict {skill_name: rating}
          - 'academic_percentage': float or None
          - 'preferred_subjects': list of strings
          - 'work_style': dict of ratings {teamwork, creativity, analytical_depth, leadership}
        careers: list of Career objects
        """
        if not careers:
            return []

        # Parse student inputs
        raw_skills = student_profile_data.get('skills', {})
        student_skills = {}
        if isinstance(raw_skills, list):
            for s in raw_skills:
                if isinstance(s, dict):
                    name = s.get('skill_name') or s.get('name')
                    rating = s.get('proficiency_rating') or s.get('rating', 1)
                    if name:
                        student_skills[name.strip().lower()] = float(rating)
        elif isinstance(raw_skills, dict):
            for k, v in raw_skills.items():
                student_skills[k.strip().lower()] = float(v)

        student_interests = student_profile_data.get('interests', [])
        student_vec = self._build_interest_vector(student_interests)

        student_pct = student_profile_data.get('academic_percentage')
        preferred_subjects = student_profile_data.get('preferred_subjects', [])
        work_style = student_profile_data.get('work_style', {})

        results = []

        for career in careers:
            if hasattr(career, 'is_active') and not career.is_active:
                continue

            c_title = career.title
            c_category = career.category
            c_skills = career.career_skills if hasattr(career, 'career_skills') else []

            # 1. Interest Score
            career_vec = self._build_career_interest_vector(c_title, c_category)
            interest_score = self._calculate_interest_score(student_vec, career_vec)

            # Matched interests identification
            matched_domains = []
            target_domains = CAREER_INTEREST_MAP.get(c_title, [c_category])
            if isinstance(student_interests, list):
                for item in student_interests:
                    cat = item.get('interest_category') or item.get('category') or ''
                    rat = item.get('preference_rating') or item.get('rating', 3)
                    if rat >= 3 and any(cat.lower() in td.lower() or td.lower() in cat.lower() for td in target_domains):
                        matched_domains.append(cat)
            elif isinstance(student_interests, dict):
                for cat, rat in student_interests.items():
                    if rat >= 3 and any(cat.lower() in td.lower() or td.lower() in cat.lower() for td in target_domains):
                        matched_domains.append(cat)

            # 2. Skill Score & Gap Analysis
            skill_score, matching_skills, skills_to_improve = self._calculate_skill_score(student_skills, c_skills)

            # 3. Academic Score
            c_subjects = career.to_dict().get('relevant_subjects', []) if hasattr(career, 'to_dict') else []
            min_pct = getattr(career, 'min_academic_percentage', 50.0)
            academic_score, academic_strengths = self._calculate_academic_score(
                student_pct, preferred_subjects, c_subjects, min_pct
            )

            # 4. Work-Style Score
            work_env = getattr(career, 'work_environment', '')
            work_style_score = self._calculate_work_style_score(work_style, work_env)

            # Multi-component Composite Score
            raw_composite = (
                self.weights['interest'] * interest_score +
                self.weights['skill'] * skill_score +
                self.weights['academic'] * academic_score +
                self.weights['work_style'] * work_style_score
            )

            # Scale to 0-100%
            match_score = round(float(raw_composite * 100.0), 1)
            # Ensure within strict bounds [0.0, 100.0]
            match_score = max(0.0, min(100.0, match_score))

            # Synthesize explanation
            explanation = self._generate_explanation(
                c_title, match_score, interest_score, skill_score, academic_score,
                matching_skills, skills_to_improve, matched_domains
            )

            # Suggested portfolio projects
            suggested_projects = CAREER_PROJECTS.get(c_title, [
                {"title": f"Applied {c_title} Portfolio Project", "difficulty": "Intermediate", "tech": "Standard Industry Tools", "description": f"Build a practical, showcase-worthy case study demonstrating end-to-end competency in {c_title}."}
            ])

            # Roadmap selection
            roadmap = ROADMAP_TEMPLATES.get(c_category, ROADMAP_TEMPLATES['Default'])

            # Linked courses
            courses = []
            if hasattr(career, 'career_courses'):
                for cc in career.career_courses:
                    if cc.course and cc.course.is_active:
                        c_dict = cc.course.to_dict()
                        c_dict['relevance_stage'] = cc.relevance_stage
                        courses.append(c_dict)

            results.append({
                'career_id': career.id,
                'career_title': c_title,
                'career_category': c_category,
                'career': career.to_dict(include_details=True) if hasattr(career, 'to_dict') else None,
                'match_score': match_score,
                'component_breakdown': {
                    'interest_score': round(interest_score * 100.0, 1),
                    'skill_score': round(skill_score * 100.0, 1),
                    'academic_score': round(academic_score * 100.0, 1),
                    'work_style_score': round(work_style_score * 100.0, 1)
                },
                'matched_interests': matched_domains,
                'matching_skills': matching_skills,
                'skills_to_improve': skills_to_improve,
                'academic_strengths': academic_strengths,
                'explanation': explanation,
                'suggested_projects': suggested_projects,
                'learning_roadmap': roadmap,
                'courses': courses
            })

        # Sort descending by match_score
        results.sort(key=lambda x: x['match_score'], reverse=True)

        # Assign rankings (1, 2, 3...)
        for idx, item in enumerate(results):
            item['ranking'] = idx + 1

        return results[:top_n]
