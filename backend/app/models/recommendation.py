from datetime import datetime, timezone
import json
from app.extensions import db

class Recommendation(db.Model):
    __tablename__ = 'recommendations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False, index=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), nullable=False, index=True)
    match_score = db.Column(db.Float, nullable=False)     # 0.0 - 100.0%
    ranking = db.Column(db.Integer, nullable=False)       # 1, 2, 3...
    matched_interests = db.Column(db.Text, nullable=True) # JSON list
    matching_skills = db.Column(db.Text, nullable=True)   # JSON list of {skill, rating}
    skills_to_improve = db.Column(db.Text, nullable=True) # JSON list of {skill, current, target}
    academic_strengths = db.Column(db.Text, nullable=True)# JSON list
    explanation = db.Column(db.Text, nullable=False)      # AI reasoning narrative
    learning_roadmap = db.Column(db.Text, nullable=True)  # JSON roadmap stages
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    career = db.relationship('Career')

    def to_dict(self):
        def parse_json(raw, fallback):
            if not raw:
                return fallback
            try:
                return json.loads(raw)
            except Exception:
                return fallback

        return {
            'id': self.id,
            'user_id': self.user_id,
            'assessment_id': self.assessment_id,
            'career_id': self.career_id,
            'career': self.career.to_dict(include_details=True) if self.career else None,
            'match_score': round(self.match_score, 1),
            'ranking': self.ranking,
            'matched_interests': parse_json(self.matched_interests, []),
            'matching_skills': parse_json(self.matching_skills, []),
            'skills_to_improve': parse_json(self.skills_to_improve, []),
            'academic_strengths': parse_json(self.academic_strengths, []),
            'explanation': self.explanation,
            'learning_roadmap': parse_json(self.learning_roadmap, []),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
