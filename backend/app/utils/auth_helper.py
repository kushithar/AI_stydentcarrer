from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                return jsonify({"error": "Authentication required", "details": str(e)}), 401

            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.role != 'admin':
                return jsonify({"error": "Admin access required. Unauthorized."}), 403

            if user.account_status != 'active':
                return jsonify({"error": "Admin account is suspended or inactive."}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper

def get_current_user():
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        return User.query.get(user_id)
    except Exception:
        return None
