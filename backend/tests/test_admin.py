def test_admin_dashboard_stats(client, admin_auth_headers):
    res = client.get('/api/admin/dashboard', headers=admin_auth_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert "stats" in data
    assert data["stats"]["total_careers"] >= 14
    assert "career_popularity" in data

def test_admin_route_blocked_for_students(client, student_auth_headers):
    res = client.get('/api/admin/dashboard', headers=student_auth_headers)
    assert res.status_code == 403

def test_admin_career_crud(client, admin_auth_headers):
    # Create new career
    create_res = client.post('/api/admin/careers', headers=admin_auth_headers, json={
        "title": "Quantum Computing Researcher",
        "category": "Technology",
        "description": "Explores quantum algorithms, qubit simulation, and quantum cryptography.",
        "min_academic_percentage": 70.0,
        "skills": [{"skill_name": "Python", "designation": "required", "importance_weight": 1.5, "minimum_rating": 4}]
    })
    assert create_res.status_code == 201
    career_id = create_res.get_json()["career"]["id"]

    # Update career
    update_res = client.put(f'/api/admin/careers/{career_id}', headers=admin_auth_headers, json={
        "average_salary_range": "$120,000 - $190,000"
    })
    assert update_res.status_code == 200
    assert update_res.get_json()["career"]["average_salary_range"] == "$120,000 - $190,000"

    # Delete career
    delete_res = client.delete(f'/api/admin/careers/{career_id}', headers=admin_auth_headers)
    assert delete_res.status_code == 200

def test_admin_student_status_toggle(client, admin_auth_headers, student_auth_headers):
    # Look up students
    res = client.get('/api/admin/students', headers=admin_auth_headers)
    assert res.status_code == 200
    students = res.get_json()["students"]
    assert len(students) > 0
    target_student_id = students[0]["id"]

    # Toggle status to suspended
    toggle_res = client.put(f'/api/admin/students/{target_student_id}/status', headers=admin_auth_headers, json={
        "account_status": "suspended"
    })
    assert toggle_res.status_code == 200
    assert toggle_res.get_json()["student"]["account_status"] == "suspended"
