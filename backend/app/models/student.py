from datetime import datetime, timezone
import json
from app.extensions import db

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    education_level = db.Column(db.String(50), nullable=True)  # High School, Undergraduate, Postgraduate, Diploma
    course_stream = db.Column(db.String(100), nullable=True)  # Computer Science, Commerce, Science, Arts, Engineering
    academic_percentage = db.Column(db.Float, nullable=True)  # 0.0 - 100.0
    preferred_subjects = db.Column(db.Text, nullable=True)    # JSON-encoded list of subjects
    bio = db.Column(db.Text, nullable=True)
    profile_completion = db.Column(db.Integer, default=20)    # 0 - 100%
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    skills = db.relationship('StudentSkill', backref='profile', cascade='all, delete-orphan', lazy='dynamic')
    interests = db.relationship('CareerInterest', backref='profile', cascade='all, delete-orphan', lazy='dynamic')

    def calculate_completion(self):
        score = 20  # Base user registration
        if self.education_level: score += 15
        if self.course_stream: score += 15
        if self.academic_percentage is not None: score += 15
        if self.preferred_subjects: score += 15
        if self.skills.count() > 0: score += 10
        if self.interests.count() > 0: score += 10
        self.profile_completion = min(score, 100)
        return self.profile_completion

    def to_dict(self):
        subjects = []
        if self.preferred_subjects:
            try:
                subjects = json.loads(self.preferred_subjects)
            except Exception:
                subjects = [s.strip() for s in self.preferred_subjects.split(',') if s.strip()]

        return {
            'id': self.id,
            'user_id': self.user_id,
            'education_level': self.education_level,
            'course_stream': self.course_stream,
            'academic_percentage': self.academic_percentage,
            'preferred_subjects': subjects,
            'bio': self.bio,
            'profile_completion': self.profile_completion,
            'skills': [s.to_dict() for s in self.skills],
            'interests': [i.to_dict() for i in self.interests],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class StudentSkill(db.Model):
    __tablename__ = 'student_skills'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_profile_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'), nullable=False)
    proficiency_rating = db.Column(db.Integer, nullable=False, default=1)  # 1-5 scale

    # Relationship to skill
    skill = db.relationship('Skill')

    def to_dict(self):
        return {
            'id': self.id,
            'skill_id': self.skill_id,
            'skill_name': self.skill.name if self.skill else None,
            'category': self.skill.category if self.skill else None,
            'proficiency_rating': self.proficiency_rating
        }


class CareerInterest(db.Model):
    __tablename__ = 'career_interests'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_profile_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id', ondelete='CASCADE'), nullable=False)
    interest_category = db.Column(db.String(100), nullable=False)
    preference_rating = db.Column(db.Integer, nullable=False, default=3)  # 1-5 scale

    def to_dict(self):
        return {
            'id': self.id,
            'interest_category': self.interest_category,
            'preference_rating': self.preference_rating
        }
