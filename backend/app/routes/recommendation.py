from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.assessment import Assessment
from app.models.recommendation import Recommendation
from app.models.career import Career
from app.recommendation.engine import RecommendationEngine

recommendation_bp = Blueprint('recommendation', __name__, url_prefix='/api')

@recommendation_bp.route('/recommendations/latest', methods=['GET'])
@jwt_required()
def get_latest_recommendations():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    latest_assessment = user.assessments.order_by(Assessment.assessment_date.desc()).first()
    if not latest_assessment:
        return jsonify({
            "message": "No assessment completed yet",
            "recommendations": []
        }), 200

    recs = Recommendation.query.filter_by(assessment_id=latest_assessment.id)\
        .order_by(Recommendation.ranking.asc()).all()

    return jsonify({
        "assessment_id": latest_assessment.id,
        "assessment_date": latest_assessment.assessment_date.isoformat(),
        "recommendations": [r.to_dict() for r in recs]
    }), 200


@recommendation_bp.route('/recommendations/<int:rec_id>', methods=['GET'])
@jwt_required()
def get_recommendation(rec_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    rec = Recommendation.query.get(rec_id)

    if not rec:
        return jsonify({"error": "Recommendation not found"}), 404

    if rec.user_id != user.id and user.role != 'admin':
        return jsonify({"error": "Unauthorized access to recommendation"}), 403

    return jsonify({
        "recommendation": rec.to_dict()
    }), 200


@recommendation_bp.route('/recommendations/generate', methods=['POST'])
@jwt_required()
def generate_from_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile:
        return jsonify({"error": "Profile not initialized. Please complete assessment."}), 400

    # Build student data from profile
    student_skills = {}
    for ss in profile.skills.all():
        if ss.skill:
            student_skills[ss.skill.name.lower()] = ss.proficiency_rating

    student_interests = []
    for ci in profile.interests.all():
        student_interests.append({
            "interest_category": ci.interest_category,
            "preference_rating": ci.preference_rating
        })

    student_data = {
        'skills': student_skills,
        'interests': student_interests,
        'academic_percentage': profile.academic_percentage,
        'preferred_subjects': profile.to_dict().get('preferred_subjects', []),
        'work_style': {}
    }

    careers = Career.query.filter_by(is_active=True).all()
    engine = RecommendationEngine()
    results = engine.generate_recommendations(student_data, careers, top_n=10)

    return jsonify({
        "message": "Recommendations generated",
        "recommendations": results
    }), 200


@recommendation_bp.route('/careers', methods=['GET'])
def list_careers():
    category = request.args.get('category', '').strip()
    search = request.args.get('search', '').strip().lower()
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)

    query = Career.query.filter_by(is_active=True)

    if category:
        query = query.filter(Career.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            db.or_(
                Career.title.ilike(f"%{search}%"),
                Career.description.ilike(f"%{search}%"),
                Career.category.ilike(f"%{search}%")
            )
        )

    pagination = query.order_by(Career.title.asc()).paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "careers": [c.to_dict(include_details=True) for c in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200


@recommendation_bp.route('/careers/<int:career_id>', methods=['GET'])
def get_career_details(career_id):
    career = Career.query.get(career_id)
    if not career:
        return jsonify({"error": "Career not found"}), 404

    # Related careers in same category
    related = Career.query.filter(
        Career.category == career.category,
        Career.id != career.id,
        Career.is_active == True
    ).limit(3).all()

    career_data = career.to_dict(include_details=True)
    career_data['related_careers'] = [r.to_dict(include_details=False) for r in related]

    return jsonify({
        "career": career_data
    }), 200
