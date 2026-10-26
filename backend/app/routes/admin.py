import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.student import StudentProfile, StudentSkill
from app.models.career import Career, Skill, CareerSkill
from app.models.course import Course, CareerCourse
from app.models.assessment import Assessment
from app.models.recommendation import Recommendation
from app.models.saved_career import SavedCareer
from app.models.activity_log import ActivityLog
from app.utils.auth_helper import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required()
def admin_dashboard():
    total_students = User.query.filter_by(role='student').count()
    total_careers = Career.query.count()
    active_careers = Career.query.filter_by(is_active=True).count()
    total_assessments = Assessment.query.count()
    total_courses = Course.query.count()

    # Popular careers in recommendations
    career_recs = db.session.query(
        Career.title, db.func.count(Recommendation.id).label('rec_count')
    ).join(Recommendation, Recommendation.career_id == Career.id)\
     .group_by(Career.title)\
     .order_by(db.desc('rec_count'))\
     .limit(6).all()

    career_popularity = [{"title": cr[0], "count": cr[1]} for cr in career_recs]

    # Category distribution
    cat_counts = db.session.query(
        Career.category, db.func.count(Career.id)
    ).group_by(Career.category).all()
    categories_distribution = [{"category": cc[0], "count": cc[1]} for cc in cat_counts]

    # Recent activity logs
    logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).limit(8).all()

    return jsonify({
        "stats": {
            "total_students": total_students,
            "total_careers": total_careers,
            "active_careers": active_careers,
            "total_assessments": total_assessments,
            "total_courses": total_courses
        },
        "career_popularity": career_popularity,
        "categories_distribution": categories_distribution,
        "recent_logs": [l.to_dict() for l in logs]
    }), 200


@admin_bp.route('/students', methods=['GET'])
@admin_required()
def list_students():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 15, type=int)
    search = request.args.get('search', '').strip().lower()

    query = User.query.filter_by(role='student')

    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%"))
        )

    pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)

    student_list = []
    for u in pagination.items:
        u_dict = u.to_dict(include_profile=True)
        u_dict['assessments_count'] = u.assessments.count()
        u_dict['saved_careers_count'] = u.saved_careers.count()
        student_list.append(u_dict)

    return jsonify({
        "students": student_list,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200


@admin_bp.route('/students/<int:student_id>/status', methods=['PUT'])
@admin_required()
def toggle_student_status(student_id):
    student = User.query.get(student_id)
    if not student or student.role != 'student':
        return jsonify({"error": "Student not found"}), 404

    data = request.get_json() or {}
    new_status = data.get('account_status')
    if new_status not in ['active', 'suspended']:
        return jsonify({"error": "Invalid status. Must be 'active' or 'suspended'"}), 400

    student.account_status = new_status

    admin_id = get_jwt_identity()
    log = ActivityLog(
        actor_id=admin_id,
        action="UPDATE_STUDENT_STATUS",
        details=f"Admin updated student {student.email} status to {new_status}"
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "message": f"Student account status updated to {new_status}",
        "student": student.to_dict(include_profile=True)
    }), 200


@admin_bp.route('/careers', methods=['GET'])
@admin_required()
def list_all_careers():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    search = request.args.get('search', '').strip().lower()

    query = Career.query

    if search:
        query = query.filter(
            (Career.title.ilike(f"%{search}%")) |
            (Career.category.ilike(f"%{search}%"))
        )

    pagination = query.order_by(Career.title.asc()).paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "careers": [c.to_dict(include_details=True) for c in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200


@admin_bp.route('/careers', methods=['POST'])
@admin_required()
def create_career():
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    category = data.get('category', '').strip()
    description = data.get('description', '').strip()

    if not title or not category or not description:
        return jsonify({"error": "Title, category, and description are required"}), 400

    if Career.query.filter_by(title=title).first():
        return jsonify({"error": "A career with this title already exists"}), 409

    career = Career(
        title=title,
        category=category,
        description=description,
        typical_responsibilities=json.dumps(data.get('typical_responsibilities', [])),
        required_skills_summary=data.get('required_skills_summary', ''),
        preferred_skills_summary=data.get('preferred_skills_summary', ''),
        relevant_subjects=json.dumps(data.get('relevant_subjects', [])),
        prerequisites=data.get('prerequisites', ''),
        min_academic_percentage=float(data.get('min_academic_percentage', 50.0)),
        average_salary_range=data.get('average_salary_range', '$60,000 - $110,000'),
        job_outlook=data.get('job_outlook', 'High Growth'),
        work_environment=data.get('work_environment', 'Collaborative, Technology-focused'),
        is_active=bool(data.get('is_active', True))
    )
    db.session.add(career)
    db.session.flush()

    # Add career skills if provided
    skills_data = data.get('skills', [])
    for s_item in skills_data:
        s_name = s_item.get('skill_name')
        if s_name:
            skill = Skill.query.filter_by(name=s_name.strip()).first()
            if not skill:
                skill = Skill(name=s_name.strip(), category=s_item.get('category', 'Technical'))
                db.session.add(skill)
                db.session.flush()
            db.session.add(CareerSkill(
                career_id=career.id,
                skill_id=skill.id,
                designation=s_item.get('designation', 'required'),
                importance_weight=float(s_item.get('importance_weight', 1.0)),
                minimum_rating=int(s_item.get('minimum_rating', 3))
            ))

    admin_id = get_jwt_identity()
    db.session.add(ActivityLog(
        actor_id=admin_id,
        action="CREATE_CAREER",
        details=f"Admin created career: {career.title}"
    ))
    db.session.commit()

    return jsonify({
        "message": "Career created successfully",
        "career": career.to_dict(include_details=True)
    }), 201


@admin_bp.route('/careers/<int:career_id>', methods=['PUT'])
@admin_required()
def update_career(career_id):
    career = Career.query.get(career_id)
    if not career:
        return jsonify({"error": "Career not found"}), 404

    data = request.get_json() or {}

    if 'title' in data and data['title'].strip():
        existing = Career.query.filter(Career.title == data['title'].strip(), Career.id != career.id).first()
        if existing:
            return jsonify({"error": "Another career with this title already exists"}), 409
        career.title = data['title'].strip()

    if 'category' in data: career.category = data['category'].strip()
    if 'description' in data: career.description = data['description'].strip()
    if 'typical_responsibilities' in data:
        career.typical_responsibilities = json.dumps(data['typical_responsibilities'])
    if 'relevant_subjects' in data:
        career.relevant_subjects = json.dumps(data['relevant_subjects'])
    if 'min_academic_percentage' in data:
        career.min_academic_percentage = float(data['min_academic_percentage'])
    if 'average_salary_range' in data: career.average_salary_range = data['average_salary_range']
    if 'job_outlook' in data: career.job_outlook = data['job_outlook']
    if 'work_environment' in data: career.work_environment = data['work_environment']
    if 'is_active' in data: career.is_active = bool(data['is_active'])

    admin_id = get_jwt_identity()
    db.session.add(ActivityLog(
        actor_id=admin_id,
        action="UPDATE_CAREER",
        details=f"Admin updated career: {career.title}"
    ))
    db.session.commit()

    return jsonify({
        "message": "Career updated successfully",
        "career": career.to_dict(include_details=True)
    }), 200


@admin_bp.route('/careers/<int:career_id>', methods=['DELETE'])
@admin_required()
def delete_career(career_id):
    career = Career.query.get(career_id)
    if not career:
        return jsonify({"error": "Career not found"}), 404

    admin_id = get_jwt_identity()
    title = career.title
    db.session.delete(career)
    db.session.add(ActivityLog(
        actor_id=admin_id,
        action="DELETE_CAREER",
        details=f"Admin deleted career: {title}"
    ))
    db.session.commit()

    return jsonify({"message": f"Career '{title}' deleted successfully"}), 200


@admin_bp.route('/skills', methods=['GET', 'POST'])
@admin_required()
def manage_skills():
    if request.method == 'POST':
        data = request.get_json() or {}
        name = data.get('name', '').strip()
        category = data.get('category', 'Technical').strip()
        description = data.get('description', '').strip()

        if not name:
            return jsonify({"error": "Skill name is required"}), 400

        if Skill.query.filter_by(name=name).first():
            return jsonify({"error": "Skill with this name already exists"}), 409

        skill = Skill(name=name, category=category, description=description)
        db.session.add(skill)
        db.session.commit()

        return jsonify({"message": "Skill created", "skill": skill.to_dict()}), 201

    skills = Skill.query.order_by(Skill.category.asc(), Skill.name.asc()).all()
    return jsonify({"skills": [s.to_dict() for s in skills]}), 200


@admin_bp.route('/resources', methods=['GET', 'POST'])
@admin_required()
def manage_resources():
    if request.method == 'POST':
        data = request.get_json() or {}
        title = data.get('title', '').strip()
        provider = data.get('provider', '').strip()
        url = data.get('url', '').strip()
        if not title or not provider or not url:
            return jsonify({"error": "Title, provider, and url are required"}), 400

        course = Course(
            title=title,
            provider=provider,
            url=url,
            description=data.get('description', ''),
            difficulty=data.get('difficulty', 'Beginner'),
            duration=data.get('duration', 'Self-paced'),
            skill_taught=data.get('skill_taught', ''),
            cost_type=data.get('cost_type', 'Free'),
            is_active=bool(data.get('is_active', True))
        )
        db.session.add(course)
        db.session.flush()

        career_id = data.get('career_id')
        if career_id:
            c = Career.query.get(career_id)
            if c:
                db.session.add(CareerCourse(
                    career_id=c.id,
                    course_id=course.id,
                    relevance_stage=data.get('relevance_stage', 'Core')
                ))

        db.session.commit()
        return jsonify({"message": "Learning resource created", "course": course.to_dict()}), 201

    courses = Course.query.order_by(Course.title.asc()).all()
    return jsonify({"courses": [c.to_dict() for c in courses]}), 200


@admin_bp.route('/resources/<int:course_id>', methods=['PUT', 'DELETE'])
@admin_required()
def update_or_delete_resource(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    if request.method == 'DELETE':
        db.session.delete(course)
        db.session.commit()
        return jsonify({"message": "Course deleted successfully"}), 200

    data = request.get_json() or {}
    if 'title' in data: course.title = data['title']
    if 'provider' in data: course.provider = data['provider']
    if 'url' in data: course.url = data['url']
    if 'difficulty' in data: course.difficulty = data['difficulty']
    if 'duration' in data: course.duration = data['duration']
    if 'skill_taught' in data: course.skill_taught = data['skill_taught']
    if 'cost_type' in data: course.cost_type = data['cost_type']
    if 'is_active' in data: course.is_active = bool(data['is_active'])

    db.session.commit()
    return jsonify({"message": "Course updated", "course": course.to_dict()}), 200


@admin_bp.route('/analytics', methods=['GET'])
@admin_required()
def get_analytics():
    # Top rated student skills
    top_skills = db.session.query(
        Skill.name, db.func.avg(StudentSkill.proficiency_rating).label('avg_rating'), db.func.count(StudentSkill.id).label('student_count')
    ).join(StudentSkill, StudentSkill.skill_id == Skill.id)\
     .group_by(Skill.name)\
     .order_by(db.desc('avg_rating'))\
     .limit(8).all()

    skills_analytics = [
        {"skill": ts[0], "avg_rating": round(float(ts[1]), 2), "students_count": ts[2]}
        for ts in top_skills
    ]

    # Education levels distribution
    edu_dist = db.session.query(
        StudentProfile.education_level, db.func.count(StudentProfile.id)
    ).filter(StudentProfile.education_level.isnot(None))\
     .group_by(StudentProfile.education_level).all()

    education_levels = [{"level": ed[0], "count": ed[1]} for ed in edu_dist]

    # Top recommended careers
    top_recommended = db.session.query(
        Career.title, db.func.avg(Recommendation.match_score).label('avg_score'), db.func.count(Recommendation.id).label('total_recs')
    ).join(Recommendation, Recommendation.career_id == Career.id)\
     .group_by(Career.title)\
     .order_by(db.desc('total_recs'))\
     .limit(6).all()

    recommendations_analytics = [
        {"career": tr[0], "avg_score": round(float(tr[1]), 1), "recommendation_count": tr[2]}
        for tr in top_recommended
    ]

    return jsonify({
        "skills_analytics": skills_analytics,
        "education_levels": education_levels,
        "recommendations_analytics": recommendations_analytics
    }), 200


@admin_bp.route('/logs', methods=['GET'])
@admin_required()
def get_activity_logs():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 25, type=int)

    pagination = ActivityLog.query.order_by(ActivityLog.timestamp.desc())\
        .paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "logs": [l.to_dict() for l in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200
