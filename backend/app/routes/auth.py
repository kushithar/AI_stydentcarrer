import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.student import StudentProfile
from app.models.activity_log import ActivityLog

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')
    education_level = data.get('education_level', '').strip()
    course_stream = data.get('course_stream', '').strip()

    # Validations
    if not full_name:
        return jsonify({"error": "Full name is required"}), 400
    if len(full_name) < 2:
        return jsonify({"error": "Full name must be at least 2 characters long"}), 400
    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Please provide a valid email address"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400
    if confirm_password and password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Check for existing email
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    # Enforce student role on public registration (security: never allow role escalation)
    user = User(
        full_name=full_name,
        email=email,
        role='student',
        account_status='active'
    )
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    # Create associated student profile
    profile = StudentProfile(
        user_id=user.id,
        education_level=education_level if education_level else None,
        course_stream=course_stream if course_stream else None,
        profile_completion=35 if education_level or course_stream else 20
    )
    db.session.add(profile)

    # Activity log
    log = ActivityLog(
        actor_id=user.id,
        action="STUDENT_REGISTER",
        details=f"New student registration: {user.email}"
    )
    db.session.add(log)
    db.session.commit()

    # Generate JWT
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Registration successful",
        "access_token": access_token,
        "user": user.to_dict(include_profile=True)
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    if user.account_status != 'active':
        return jsonify({"error": "Your account has been deactivated. Please contact support."}), 403

    # Activity log
    log = ActivityLog(
        actor_id=user.id,
        action="USER_LOGIN",
        details=f"User {user.email} logged in ({user.role})"
    )
    db.session.add(log)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict(include_profile=True)
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        log = ActivityLog(
            actor_id=user.id,
            action="USER_LOGOUT",
            details=f"User {user.email} logged out"
        )
        db.session.add(log)
        db.session.commit()

    return jsonify({"message": "Successfully logged out"}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": user.to_dict(include_profile=True)
    }), 200
