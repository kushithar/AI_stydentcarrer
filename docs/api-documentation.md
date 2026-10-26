# REST API Reference Documentation

Base URL: `http://127.0.0.1:5000/api`

All protected endpoints require the HTTP header:
```
Authorization: Bearer <jwt_access_token>
```

---

## 1. Authentication Endpoints

### Register Student
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Public**: Yes
- **Payload**:
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "confirm_password": "Password123!",
  "education_level": "Undergraduate",
  "course_stream": "Computer Science"
}
```
- **Response (201 Created)**:
```json
{
  "message": "Registration successful",
  "access_token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student",
    "account_status": "active"
  }
}
```

### Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Public**: Yes
- **Payload**:
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK)**:
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOi...",
  "user": { ... }
}
```

### Logout
- **Method**: `POST`
- **Endpoint**: `/api/auth/logout`
- **Auth Required**: Yes

### Current User
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Auth Required**: Yes

---

## 2. Student Profile & Dashboard

### Get Profile
- **Method**: `GET`
- **Endpoint**: `/api/student/profile`
- **Auth Required**: Yes

### Update Profile
- **Method**: `PUT`
- **Endpoint**: `/api/student/profile`
- **Auth Required**: Yes
- **Payload**:
```json
{
  "education_level": "Undergraduate",
  "course_stream": "Information Systems",
  "academic_percentage": 84.5,
  "preferred_subjects": ["Algorithms", "Database Systems"],
  "bio": "Aspiring Cloud Architect"
}
```

### Student Dashboard Summary
- **Method**: `GET`
- **Endpoint**: `/api/student/dashboard`
- **Auth Required**: Yes
- **Returns**: Profile completion %, total assessments taken, top 3 recommendations, saved careers, skills chart data.

---

## 3. Assessments & Recommendations

### Submit Assessment
- **Method**: `POST`
- **Endpoint**: `/api/assessments`
- **Auth Required**: Yes
- **Payload**:
```json
{
  "education_level": "Undergraduate",
  "course_stream": "Computer Science",
  "academic_percentage": 82.0,
  "preferred_subjects": ["Coding", "Mathematics"],
  "technical_skills": {
    "Python": 5,
    "SQL & Relational Databases": 4
  },
  "analytical_skills": {
    "Algorithmic Problem Solving": 4
  },
  "interests": [
    { "interest_category": "Software Development", "preference_rating": 5 }
  ],
  "work_style": {
    "teamwork": 4,
    "analytical_depth": 4
  }
}
```
- **Response (201 Created)**: Returns `assessment_id` and ranked `recommendations` list with match scores, component breakdown, matching skills, gaps, explanations, and learning roadmaps.

### Assessment History
- **Method**: `GET`
- **Endpoint**: `/api/assessments`
- **Auth Required**: Yes

### Assessment Results
- **Method**: `GET`
- **Endpoint**: `/api/assessments/<id>/results`
- **Auth Required**: Yes (isolated to the owning student or admin)

---

## 4. Careers & Courses Catalog

### List Careers
- **Method**: `GET`
- **Endpoint**: `/api/careers?search=data&category=Technology&page=1&limit=20`
- **Public**: Yes

### Career Details
- **Method**: `GET`
- **Endpoint**: `/api/careers/<id>`
- **Public**: Yes

### List Courses
- **Method**: `GET`
- **Endpoint**: `/api/courses?difficulty=Beginner`
- **Public**: Yes

---

## 5. Bookmarks (Saved Careers)

### Get Saved Careers
- **Method**: `GET`
- **Endpoint**: `/api/saved-careers`
- **Auth Required**: Yes

### Save / Bookmark Career
- **Method**: `POST`
- **Endpoint**: `/api/saved-careers`
- **Auth Required**: Yes
- **Payload**: `{"career_id": 1, "notes": "Target for internship"}`

### Remove Bookmark
- **Method**: `DELETE`
- **Endpoint**: `/api/saved-careers/<career_id>`
- **Auth Required**: Yes

---

## 6. Administration (Admin Access Required)

- `GET /api/admin/dashboard` - Total students, active careers, assessments, and activity logs
- `GET /api/admin/students` - Paginated student directory with search
- `PUT /api/admin/students/<id>/status` - Toggle account status (`active` / `suspended`)
- `GET /api/admin/careers` - Full list of careers including inactive
- `POST /api/admin/careers` - Create new career record
- `PUT /api/admin/careers/<id>` - Update existing career record
- `DELETE /api/admin/careers/<id>` - Delete career record
- `GET /api/admin/resources` - Course catalog management
- `POST /api/admin/resources` - Add verified course
- `PUT /api/admin/resources/<id>` - Edit course
- `DELETE /api/admin/resources/<id>` - Delete course
- `GET /api/admin/analytics` - Cohort skill averages and recommendation distributions
- `GET /api/admin/logs` - System audit activity logs
