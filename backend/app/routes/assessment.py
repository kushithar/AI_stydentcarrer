import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.assessment import Assessment
from app.models.recommendation import Recommendation
from app.models.career import Career, Skill
from app.models.student import StudentProfile, StudentSkill, CareerInterest
from app.models.activity_log import ActivityLog
from app.recommendation.engine import RecommendationEngine

assessment_bp = Blueprint('assessment', __name__, url_prefix='/api/assessments')

@assessment_bp.route('', methods=['POST'])
@jwt_required()
def submit_assessment():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}

    # Gather skills across all assessment categories
    all_skills_input = {}
    total_rated_count = 0

    # Handle skill groups
    skill_groups = ['technical_skills', 'analytical_skills', 'communication_skills', 'creative_skills', 'leadership_skills', 'skills']
    for group in skill_groups:
        items = data.get(group, {})
        if isinstance(items, dict):
            for k, v in items.items():
                try:
                    all_skills_input[k.strip()] = max(1, min(5, int(v)))
                    total_rated_count += 1
                except (ValueError, TypeError):
                    pass
        elif isinstance(items, list):
            for itm in items:
                name = itm.get('skill_name') or itm.get('name')
                val = itm.get('proficiency_rating') or itm.get('rating', 1)
                if name:
                    try:
                        all_skills_input[name.strip()] = max(1, min(5, int(val)))
                        total_rated_count += 1
                    except (ValueError, TypeError):
                        pass

    # Interests
    raw_interests = data.get('interests', [])
    parsed_interests = []
    top_interest_name = None
    max_int_val = 0

    if isinstance(raw_interests, list):
        for itm in raw_interests:
            cat = itm.get('interest_category') or itm.get('category') or itm.get('name')
            rat = itm.get('preference_rating') or itm.get('rating', 3)
            if cat:
                try:
                    r_num = max(1, min(5, int(rat)))
                    parsed_interests.append({"interest_category": cat.strip(), "preference_rating": r_num})
                    if r_num > max_int_val:
                        max_int_val = r_num
                        top_interest_name = cat.strip()
                except (ValueError, TypeError):
                    pass
    elif isinstance(raw_interests, dict):
        for cat, rat in raw_interests.items():
            try:
                r_num = max(1, min(5, int(rat)))
                parsed_interests.append({"interest_category": cat.strip(), "preference_rating": r_num})
                if r_num > max_int_val:
                    max_int_val = r_num
                    top_interest_name = cat.strip()
            except (ValueError, TypeError):
                pass

    academic_percentage = data.get('academic_percentage')
    if academic_percentage is not None and academic_percentage != '':
        try:
            academic_percentage = float(academic_percentage)
            academic_percentage = max(0.0, min(100.0, academic_percentage))
        except (ValueError, TypeError):
            academic_percentage = None
    else:
        academic_percentage = None

    preferred_subjects = data.get('preferred_subjects', [])
    if isinstance(preferred_subjects, str):
        preferred_subjects = [s.strip() for s in preferred_subjects.split(',') if s.strip()]

    work_style = data.get('work_style', {})

    # Create Assessment record
    assessment = Assessment(
        user_id=user.id,
        structured_input=json.dumps(data),
        completion_status='completed',
        total_skills_rated=total_rated_count,
        top_interest=top_interest_name
    )
    db.session.add(assessment)
    db.session.flush()

    # Update or sync student profile
    profile = user.profile
    if not profile:
        profile = StudentProfile(user_id=user.id)
        db.session.add(profile)
        db.session.flush()

    if academic_percentage is not None:
        profile.academic_percentage = academic_percentage
    if preferred_subjects:
        profile.preferred_subjects = json.dumps(preferred_subjects)

    # Sync skills to student_skills table
    for s_name, rating in all_skills_input.items():
        skill_obj = Skill.query.filter_by(name=s_name).first()
        if not skill_obj:
            # Create skill if it doesn't exist
            skill_obj = Skill(name=s_name, category='General', description=f"{s_name} competency")
            db.session.add(skill_obj)
            db.session.flush()

        # Update or add student skill
        s_skill = StudentSkill.query.filter_by(student_profile_id=profile.id, skill_id=skill_obj.id).first()
        if s_skill:
            s_skill.proficiency_rating = rating
        else:
            db.session.add(StudentSkill(student_profile_id=profile.id, skill_id=skill_obj.id, proficiency_rating=rating))

    # Sync interests
    CareerInterest.query.filter_by(student_profile_id=profile.id).delete()
    for item in parsed_interests:
        db.session.add(CareerInterest(
            student_profile_id=profile.id,
            interest_category=item['interest_category'],
            preference_rating=item['preference_rating']
        ))

    profile.calculate_completion()

    # Run AI Recommendation Engine
    engine = RecommendationEngine()
    careers = Career.query.filter_by(is_active=True).all()

    student_data = {
        'skills': all_skills_input,
        'interests': parsed_interests,
        'academic_percentage': academic_percentage,
        'preferred_subjects': preferred_subjects,
        'work_style': work_style
    }

    recommendations_list = engine.generate_recommendations(student_data, careers, top_n=10)

    # Persist recommendations to database
    db_recommendations = []
    for rec in recommendations_list:
        db_rec = Recommendation(
            user_id=user.id,
            assessment_id=assessment.id,
            career_id=rec['career_id'],
            match_score=rec['match_score'],
            ranking=rec['ranking'],
            matched_interests=json.dumps(rec.get('matched_interests', [])),
            matching_skills=json.dumps(rec.get('matching_skills', [])),
            skills_to_improve=json.dumps(rec.get('skills_to_improve', [])),
            academic_strengths=json.dumps(rec.get('academic_strengths', [])),
            explanation=rec.get('explanation', ''),
            learning_roadmap=json.dumps(rec.get('learning_roadmap', []))
        )
        db.session.add(db_rec)
        db_recommendations.append(db_rec)

    # Activity log
    log = ActivityLog(
        actor_id=user.id,
        action="ASSESSMENT_COMPLETED",
        details=f"Assessment #{assessment.id} completed. Generated {len(recommendations_list)} recommendations."
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "message": "Assessment submitted and evaluated successfully",
        "assessment_id": assessment.id,
        "recommendations": recommendations_list
    }), 201


@assessment_bp.route('', methods=['GET'])
@jwt_required()
def get_assessments():
    user_id = get_jwt_identity()
    assessments = Assessment.query.filter_by(user_id=user_id)\
        .order_by(Assessment.assessment_date.desc()).all()

    return jsonify({
        "assessments": [a.to_dict(include_input=False) for a in assessments]
    }), 200


@assessment_bp.route('/<int:assessment_id>', methods=['GET'])
@jwt_required()
def get_assessment(assessment_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    assessment = Assessment.query.get(assessment_id)

    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    # Enforce data isolation: students cannot access other students' assessments
    if assessment.user_id != user.id and user.role != 'admin':
        return jsonify({"error": "Unauthorized access to assessment record"}), 403

    return jsonify({
        "assessment": assessment.to_dict(include_input=True)
    }), 200


@assessment_bp.route('/<int:assessment_id>/results', methods=['GET'])
@jwt_required()
def get_assessment_results(assessment_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    assessment = Assessment.query.get(assessment_id)

    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

    if assessment.user_id != user.id and user.role != 'admin':
        return jsonify({"error": "Unauthorized access to assessment results"}), 403

    recs = Recommendation.query.filter_by(assessment_id=assessment.id)\
        .order_by(Recommendation.ranking.asc()).all()

    return jsonify({
        "assessment_id": assessment.id,
        "assessment_date": assessment.assessment_date.isoformat(),
        "recommendations": [r.to_dict() for r in recs]
    }), 200
