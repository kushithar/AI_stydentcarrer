from datetime import datetime, timezone
import json
from app.extensions import db

class Assessment(db.Model):
    __tablename__ = 'assessments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    assessment_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    structured_input = db.Column(db.Text, nullable=False)  # JSON-encoded answers snapshot
    completion_status = db.Column(db.String(30), default='completed')  # completed, in_progress
    total_skills_rated = db.Column(db.Integer, default=0)
    top_interest = db.Column(db.String(100), nullable=True)

    # Relationships
    recommendations = db.relationship('Recommendation', backref='assessment', cascade='all, delete-orphan', lazy='dynamic')

    def to_dict(self, include_input=True):
        parsed_input = {}
        if include_input and self.structured_input:
            try:
                parsed_input = json.loads(self.structured_input)
            except Exception:
                parsed_input = {}

        return {
            'id': self.id,
            'user_id': self.user_id,
            'assessment_date': self.assessment_date.isoformat() if self.assessment_date else None,
            'completion_status': self.completion_status,
            'total_skills_rated': self.total_skills_rated,
            'top_interest': self.top_interest,
            'structured_input': parsed_input if include_input else None,
            'recommendations_count': self.recommendations.count()
        }
