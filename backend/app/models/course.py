from datetime import datetime, timezone
from app.extensions import db

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    provider = db.Column(db.String(100), nullable=False)  # freeCodeCamp, Kaggle, MDN, Microsoft Learn, AWS, Coursera, etc.
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(500), nullable=False)
    difficulty = db.Column(db.String(30), nullable=False, default='Beginner')  # Beginner, Intermediate, Advanced
    duration = db.Column(db.String(50), nullable=True)     # e.g., '10 hours', '4 weeks'
    skill_taught = db.Column(db.String(100), nullable=True)
    cost_type = db.Column(db.String(20), default='Free')   # Free, Paid, Freemium
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'provider': self.provider,
            'description': self.description,
            'url': self.url,
            'difficulty': self.difficulty,
            'duration': self.duration,
            'skill_taught': self.skill_taught,
            'cost_type': self.cost_type,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class CareerCourse(db.Model):
    __tablename__ = 'career_courses'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    relevance_stage = db.Column(db.String(30), default='Core')  # Foundation, Core, Advanced, Capstone

    # Relationship to course
    course = db.relationship('Course')

    def to_dict(self):
        return {
            'id': self.id,
            'career_id': self.career_id,
            'course_id': self.course_id,
            'relevance_stage': self.relevance_stage,
            'course': self.course.to_dict() if self.course else None
        }
