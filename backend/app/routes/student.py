import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.student import StudentProfile, StudentSkill, CareerInterest
from app.models.career import Skill
from app.models.assessment import Assessment
from app.models.recommendation import Recommendation
from app.models.saved_career import SavedCareer

student_bp = Blueprint('student', __name__, url_prefix='/api/student')

@student_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile:
        profile = StudentProfile(user_id=user.id)
        db.session.add(profile)
        db.session.commit()

    return jsonify({
        "user": user.to_dict(),
        "profile": profile.to_dict()
    }), 200


@student_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile:
        profile = StudentProfile(user_id=user.id)
        db.session.add(profile)

    data = request.get_json() or {}

    # Update basic profile fields
    if 'education_level' in data:
        profile.education_level = data['education_level']
    if 'course_stream' in data:
        profile.course_stream = data['course_stream']
    if 'bio' in data:
        profile.bio = data['bio']
    if 'academic_percentage' in data:
        pct = data['academic_percentage']
        if pct is not None and pct != '':
            try:
                p_val = float(pct)
                if 0 <= p_val <= 100:
                    profile.academic_percentage = p_val
                else:
                    return jsonify({"error": "Academic percentage must be between 0 and 100"}), 400
            except ValueError:
                return jsonify({"error": "Invalid academic percentage format"}), 400
        else:
            profile.academic_percentage = None

    if 'preferred_subjects' in data:
        subjs = data['preferred_subjects']
        if isinstance(subjs, list):
            profile.preferred_subjects = json.dumps(subjs)
        elif isinstance(subjs, str):
            profile.preferred_subjects = json.dumps([s.strip() for s in subjs.split(',') if s.strip()])

    # Update skills if provided
    if 'skills' in data and isinstance(data['skills'], list):
        # Clear existing student skills
        StudentSkill.query.filter_by(student_profile_id=profile.id).delete()
        for s_item in data['skills']:
            s_id = s_item.get('skill_id')
            rating = s_item.get('proficiency_rating', 1)
            # Find or fallback by skill_name
            if not s_id and s_item.get('skill_name'):
                skill_obj = Skill.query.filter_by(name=s_item['skill_name'].strip()).first()
                if skill_obj:
                    s_id = skill_obj.id

            if s_id:
                try:
                    r_int = max(1, min(5, int(rating)))
                    new_skill = StudentSkill(
                        student_profile_id=profile.id,
                        skill_id=s_id,
                        proficiency_rating=r_int
                    )
                    db.session.add(new_skill)
                except ValueError:
                    pass

    # Update interests if provided
    if 'interests' in data and isinstance(data['interests'], list):
        CareerInterest.query.filter_by(student_profile_id=profile.id).delete()
        for i_item in data['interests']:
            cat = i_item.get('interest_category') or i_item.get('category')
            rat = i_item.get('preference_rating', 3)
            if cat:
                try:
                    r_int = max(1, min(5, int(rat)))
                    new_interest = CareerInterest(
                        student_profile_id=profile.id,
                        interest_category=cat.strip(),
                        preference_rating=r_int
                    )
                    db.session.add(new_interest)
                except ValueError:
                    pass

    profile.calculate_completion()
    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "profile": profile.to_dict()
    }), 200


@student_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile:
        profile = StudentProfile(user_id=user.id)
        db.session.add(profile)
        db.session.commit()

    # Assessments count
    assessments_count = user.assessments.count()
    latest_assessment = user.assessments.order_by(Assessment.assessment_date.desc()).first()

    # Latest recommendations
    latest_recs = []
    if latest_assessment:
        recs = Recommendation.query.filter_by(assessment_id=latest_assessment.id)\
            .order_by(Recommendation.ranking.asc()).limit(5).all()
        latest_recs = [r.to_dict() for r in recs]

    # Saved careers count
    saved_careers_count = user.saved_careers.count()
    saved_items = user.saved_careers.order_by(SavedCareer.saved_at.desc()).limit(4).all()

    # Skills summary for chart
    skills_data = []
    for ss in profile.skills.all():
        if ss.skill:
            skills_data.append({
                "skill": ss.skill.name,
                "category": ss.skill.category,
                "rating": ss.proficiency_rating
            })

    return jsonify({
        "student_name": user.full_name,
        "email": user.email,
        "profile_completion": profile.profile_completion,
        "education_level": profile.education_level or "Not specified",
        "course_stream": profile.course_stream or "Not specified",
        "academic_percentage": profile.academic_percentage,
        "total_assessments": assessments_count,
        "latest_assessment_date": latest_assessment.assessment_date.isoformat() if latest_assessment else None,
        "saved_careers_count": saved_careers_count,
        "saved_careers": [s.to_dict() for s in saved_items],
        "top_recommendations": latest_recs,
        "skills_chart": skills_data[:8]
    }), 200
