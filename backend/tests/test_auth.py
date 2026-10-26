def test_register_success(client):
    res = client.post('/api/auth/register', json={
        "full_name": "Alice Wonder",
        "email": "alice@example.com",
        "password": "SecurePassword123!",
        "confirm_password": "SecurePassword123!"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert "access_token" in data
    assert data["user"]["email"] == "alice@example.com"
    assert data["user"]["role"] == "student"  # Strictly 'student'

def test_register_duplicate_email(client):
    client.post('/api/auth/register', json={
        "full_name": "Bob Stone",
        "email": "bob@example.com",
        "password": "Password123!"
    })
    res = client.post('/api/auth/register', json={
        "full_name": "Bob Stone Duplicate",
        "email": "bob@example.com",
        "password": "AnotherPassword123!"
    })
    assert res.status_code == 409
    assert "already exists" in res.get_json()["error"]

def test_login_success(client):
    client.post('/api/auth/register', json={
        "full_name": "Charlie Chaplin",
        "email": "charlie@example.com",
        "password": "Password123!"
    })
    res = client.post('/api/auth/login', json={
        "email": "charlie@example.com",
        "password": "Password123!"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "access_token" in data
    assert data["user"]["role"] == "student"

def test_login_invalid_credentials(client):
    res = client.post('/api/auth/login', json={
        "email": "nonexistent@example.com",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401

def test_protected_route_unauthorized(client):
    res = client.get('/api/student/dashboard')
    assert res.status_code == 401
