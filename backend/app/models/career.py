from datetime import datetime, timezone
import json
from app.extensions import db

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False)  # Technical, Analytical, Communication, Design, Leadership, Business
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description
        }


class Career(db.Model):
    __tablename__ = 'careers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(120), unique=True, nullable=False, index=True)
    category = db.Column(db.String(80), nullable=False, index=True)  # Technology, Data & AI, Design, Business, Finance, etc.
    description = db.Column(db.Text, nullable=False)
    typical_responsibilities = db.Column(db.Text, nullable=True)     # JSON array or text
    required_skills_summary = db.Column(db.Text, nullable=True)
    preferred_skills_summary = db.Column(db.Text, nullable=True)
    relevant_subjects = db.Column(db.Text, nullable=True)            # JSON array or comma separated
    prerequisites = db.Column(db.Text, nullable=True)
    min_academic_percentage = db.Column(db.Float, default=50.0)
    average_salary_range = db.Column(db.String(80), nullable=True)
    job_outlook = db.Column(db.String(80), nullable=True)            # High growth, Steady, Very high demand
    work_environment = db.Column(db.String(120), nullable=True)      # Remote, Hybrid, Office, Collaborative, Analytical
    is_active = db.Column(db.Boolean, default=True, index=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    career_skills = db.relationship('CareerSkill', backref='career', cascade='all, delete-orphan', lazy='joined')
    career_courses = db.relationship('CareerCourse', backref='career', cascade='all, delete-orphan', lazy='joined')

    def to_dict(self, include_details=True):
        def parse_json_or_list(raw):
            if not raw:
                return []
            try:
                val = json.loads(raw)
                return val if isinstance(val, list) else [val]
            except Exception:
                return [s.strip() for s in raw.split('\n') if s.strip()] or [s.strip() for s in raw.split(',') if s.strip()]

        data = {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'min_academic_percentage': self.min_academic_percentage,
            'average_salary_range': self.average_salary_range,
            'job_outlook': self.job_outlook,
            'work_environment': self.work_environment,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

        if include_details:
            data['typical_responsibilities'] = parse_json_or_list(self.typical_responsibilities)
            data['relevant_subjects'] = parse_json_or_list(self.relevant_subjects)
            data['prerequisites'] = self.prerequisites
            data['required_skills_summary'] = self.required_skills_summary
            data['preferred_skills_summary'] = self.preferred_skills_summary
            data['skills'] = [cs.to_dict() for cs in self.career_skills]
            data['courses'] = [cc.to_dict() for cc in self.career_courses if cc.course and cc.course.is_active]

        return data


class CareerSkill(db.Model):
    __tablename__ = 'career_skills'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id', ondelete='CASCADE'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id', ondelete='CASCADE'), nullable=False)
    designation = db.Column(db.String(20), nullable=False, default='required')  # 'required' or 'preferred'
    importance_weight = db.Column(db.Float, default=1.0)                        # 0.5 to 2.0
    minimum_rating = db.Column(db.Integer, default=3)                           # 1-5 expected baseline

    # Relationship to skill
    skill = db.relationship('Skill')

    def to_dict(self):
        return {
            'id': self.id,
            'skill_id': self.skill_id,
            'skill_name': self.skill.name if self.skill else None,
            'category': self.skill.category if self.skill else None,
            'designation': self.designation,
            'importance_weight': self.importance_weight,
            'minimum_rating': self.minimum_rating
        }
