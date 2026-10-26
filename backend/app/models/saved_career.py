from datetime import datetime, timezone
from app.extensions import db

class SavedCareer(db.Model):
    __tablename__ = 'saved_careers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), nullable=False, index=True)
    notes = db.Column(db.Text, nullable=True)
    saved_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    career = db.relationship('Career')

    # Ensure unique save per user and career
    __table_args__ = (
        db.UniqueConstraint('user_id', 'career_id', name='unique_user_career_save'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'career_id': self.career_id,
            'career': self.career.to_dict(include_details=True) if self.career else None,
            'notes': self.notes,
            'saved_at': self.saved_at.isoformat() if self.saved_at else None
        }
