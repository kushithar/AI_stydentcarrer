from flask import Blueprint, request, jsonify
from app.models.course import Course, CareerCourse
from app.models.career import Career

course_bp = Blueprint('course', __name__, url_prefix='/api')

@course_bp.route('/courses', methods=['GET'])
def list_courses():
    search = request.args.get('search', '').strip().lower()
    difficulty = request.args.get('difficulty', '').strip()
    provider = request.args.get('provider', '').strip()
    cost_type = request.args.get('cost_type', '').strip()

    query = Course.query.filter_by(is_active=True)

    if search:
        query = query.filter(
            (Course.title.ilike(f"%{search}%")) |
            (Course.skill_taught.ilike(f"%{search}%")) |
            (Course.description.ilike(f"%{search}%"))
        )
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    if provider:
        query = query.filter(Course.provider.ilike(f"%{provider}%"))
    if cost_type:
        query = query.filter_by(cost_type=cost_type)

    courses = query.order_by(Course.title.asc()).all()

    return jsonify({
        "courses": [c.to_dict() for c in courses],
        "total": len(courses)
    }), 200


@course_bp.route('/careers/<int:career_id>/resources', methods=['GET'])
def get_career_resources(career_id):
    career = Career.query.get(career_id)
    if not career:
        return jsonify({"error": "Career not found"}), 404

    career_courses = CareerCourse.query.filter_by(career_id=career.id).all()
    resources = []
    for cc in career_courses:
        if cc.course and cc.course.is_active:
            c_dict = cc.course.to_dict()
            c_dict['relevance_stage'] = cc.relevance_stage
            resources.append(c_dict)

    return jsonify({
        "career_id": career.id,
        "career_title": career.title,
        "resources": resources
    }), 200
