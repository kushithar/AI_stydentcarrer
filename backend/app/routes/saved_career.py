from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.saved_career import SavedCareer
from app.models.career import Career

saved_bp = Blueprint('saved_career', __name__, url_prefix='/api/saved-careers')

@saved_bp.route('', methods=['GET'])
@jwt_required()
def get_saved_careers():
    user_id = get_jwt_identity()
    saved_items = SavedCareer.query.filter_by(user_id=user_id)\
        .order_by(SavedCareer.saved_at.desc()).all()

    return jsonify({
        "saved_careers": [s.to_dict() for s in saved_items]
    }), 200


@saved_bp.route('', methods=['POST'])
@jwt_required()
def save_career():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    career_id = data.get('career_id')
    notes = data.get('notes', '').strip()

    if not career_id:
        return jsonify({"error": "career_id is required"}), 400

    career = Career.query.get(career_id)
    if not career:
        return jsonify({"error": "Career not found"}), 404

    existing = SavedCareer.query.filter_by(user_id=user_id, career_id=career_id).first()
    if existing:
        if notes:
            existing.notes = notes
            db.session.commit()
        return jsonify({
            "message": "Career already saved",
            "saved_career": existing.to_dict()
        }), 200

    new_saved = SavedCareer(
        user_id=user_id,
        career_id=career_id,
        notes=notes if notes else None
    )
    db.session.add(new_saved)
    db.session.commit()

    return jsonify({
        "message": "Career bookmarked successfully",
        "saved_career": new_saved.to_dict()
    }), 201


@saved_bp.route('/<int:career_id>', methods=['DELETE'])
@jwt_required()
def remove_saved_career(career_id):
    user_id = get_jwt_identity()
    item = SavedCareer.query.filter_by(user_id=user_id, career_id=career_id).first()

    if not item:
        return jsonify({"error": "Saved career bookmark not found"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({
        "message": "Career bookmark removed successfully"
    }), 200
