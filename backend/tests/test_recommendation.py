import pytest
from app.recommendation.engine import RecommendationEngine
from app.models.career import Career

def test_engine_scores_within_bounds(app):
    with app.app_context():
        careers = Career.query.all()
        engine = RecommendationEngine()
        student_data = {
            "skills": {"python": 5, "sql & relational databases": 4, "algorithmic problem solving": 4},
            "interests": [{"interest_category": "Software Development", "preference_rating": 5}],
            "academic_percentage": 85.0,
            "preferred_subjects": ["Computer Science", "Algorithms"]
        }
        recs = engine.generate_recommendations(student_data, careers, top_n=5)
        assert len(recs) > 0
        for r in recs:
            assert 0.0 <= r['match_score'] <= 100.0
            assert 'explanation' in r
            assert len(r['explanation']) > 10
            assert 'learning_roadmap' in r

def test_engine_profile_differentiation(app):
    with app.app_context():
        careers = Career.query.all()
        engine = RecommendationEngine()

        # 1. Tech profile
        tech_data = {
            "skills": {"python": 5, "javascript": 5, "react.js": 4},
            "interests": [{"interest_category": "Software Development", "preference_rating": 5}],
            "academic_percentage": 80.0
        }
        tech_recs = engine.generate_recommendations(tech_data, careers, top_n=3)
        top_tech_titles = [r['career_title'] for r in tech_recs]
        assert any("Developer" in t for t in top_tech_titles)

        # 2. Design profile
        design_data = {
            "skills": {"ui/ux & wireframing": 5, "design systems & accessibility": 5},
            "interests": [{"interest_category": "UI/UX and Design", "preference_rating": 5}],
            "academic_percentage": 75.0
        }
        design_recs = engine.generate_recommendations(design_data, careers, top_n=3)
        assert design_recs[0]['career_title'] == "UI/UX Designer"

        # Verify that tech and design top recommendations are different
        assert tech_recs[0]['career_title'] != design_recs[0]['career_title']

def test_engine_missing_marks_safe(app):
    with app.app_context():
        careers = Career.query.all()
        engine = RecommendationEngine()
        # Missing academic percentage and missing skills
        empty_data = {
            "skills": {},
            "interests": [],
            "academic_percentage": None,
            "preferred_subjects": []
        }
        recs = engine.generate_recommendations(empty_data, careers, top_n=5)
        assert len(recs) > 0
        for r in recs:
            assert 0.0 <= r['match_score'] <= 100.0

def test_assessment_api_and_recommendations(client, student_auth_headers):
    # Submit assessment
    res = client.post('/api/assessments', headers=student_auth_headers, json={
        "technical_skills": {"Python": 5, "Machine Learning Algorithms": 4},
        "interests": [{"interest_category": "Artificial Intelligence and Machine Learning", "preference_rating": 5}],
        "academic_percentage": 90.0,
        "preferred_subjects": ["Computer Science", "Artificial Intelligence"]
    })
    assert res.status_code == 201
    data = res.get_json()
    assert "assessment_id" in data
    assert len(data["recommendations"]) > 0

    # Retrieve assessment results
    assessment_id = data["assessment_id"]
    res_results = client.get(f'/api/assessments/{assessment_id}/results', headers=student_auth_headers)
    assert res_results.status_code == 200
    results_data = res_results.get_json()
    assert len(results_data["recommendations"]) > 0
    assert results_data["recommendations"][0]["ranking"] == 1

def test_student_data_isolation(client, student_auth_headers):
    # Student 1 creates assessment
    res = client.post('/api/assessments', headers=student_auth_headers, json={
        "technical_skills": {"Python": 4},
        "interests": [{"interest_category": "Software Development", "preference_rating": 4}]
    })
    assessment_id = res.get_json()["assessment_id"]

    # Student 2 registers and tries to access Student 1's assessment
    client.post('/api/auth/register', json={
        "full_name": "Second Student",
        "email": "student2@test.com",
        "password": "Password123!"
    })
    res_login2 = client.post('/api/auth/login', json={
        "email": "student2@test.com",
        "password": "Password123!"
    })
    headers2 = {"Authorization": f"Bearer {res_login2.get_json()['access_token']}"}

    # Should be rejected with 403 Forbidden
    res_unauthorized = client.get(f'/api/assessments/{assessment_id}', headers=headers2)
    assert res_unauthorized.status_code == 403
