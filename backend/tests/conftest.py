import pytest
from app import create_app
from app.config import TestConfig
from app.extensions import db
from app.seed import seed_database, create_admin_user
from app.models.user import User

@pytest.fixture
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        seed_database()
        create_admin_user(email="testadmin@careerai.com", password="AdminPassword123!", name="Test Admin")
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def student_auth_headers(client):
    # Register and log in a student
    client.post('/api/auth/register', json={
        "full_name": "Test Student",
        "email": "student@test.com",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "education_level": "Undergraduate",
        "course_stream": "Computer Science"
    })
    res = client.post('/api/auth/login', json={
        "email": "student@test.com",
        "password": "Password123!"
    })
    token = res.get_json()['access_token']
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_auth_headers(client):
    res = client.post('/api/auth/login', json={
        "email": "testadmin@careerai.com",
        "password": "AdminPassword123!"
    })
    token = res.get_json()['access_token']
    return {"Authorization": f"Bearer {token}"}
