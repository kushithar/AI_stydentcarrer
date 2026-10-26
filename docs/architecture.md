# System Architecture & Technical Design

## 1. High-Level Architecture Overview

The **AI-Based Student Career Recommendation System** follows a decoupled, three-tier architecture ensuring clean separation of concerns, scalability, and maintainability:

```
[ Client Tier: React 18 + Vite ]
               │  HTTP / REST (JSON) + JWT
               ▼
[ Application Tier: Flask 3 REST API ]
  ├── Authentication & Authorization Service (JWT + Bcrypt)
  ├── Student Assessment & Profile Service
  ├── Explainable AI Recommendation Engine (scikit-learn + NumPy)
  ├── Course & Learning Resource Catalog Service
  └── Protected Administrator Management Service
               │  SQLAlchemy 2.0 ORM
               ▼
[ Data Tier: MySQL Database / SQLite Dev Fallback ]
  ├── Users & Role RBAC
  ├── Student Profiles & Skills
  ├── Industry Career Catalog & Skill Weights
  ├── Historical Assessments & Recommendations
  ├── Bookmarks (Saved Careers)
  └── Audit Activity Logs
```

---

## 2. Component Structure

### Frontend (React.js + Vite)
- **State Management & Context**: `AuthContext.jsx` provides global reactive state for JWT token persistence, user profile, and role verification.
- **Client Routing**: `react-router-dom` v6 with declarative `ProtectedRoute` guards for student isolation and administrative gatekeeping.
- **HTTP Client**: Axios with automatic request interception for `Authorization: Bearer <token>` and response interceptors for graceful session handling.
- **Visualization**: Recharts for dynamic visual skill distributions, cohort analytics, and career recommendation frequency metrics.
- **Design System**: Vanilla CSS tokens in `src/styles/index.css` following curated navy blue, indigo, teal, and soft violet palettes with responsive desktop/tablet/mobile layouts.

### Backend (Python 3 + Flask REST API)
- **Application Factory**: `create_app()` initializes configuration, cross-origin resource sharing (`flask-cors`), and blueprints.
- **Security & Authorization**: Role-based access control (`@admin_required` decorator) ensuring student accounts cannot access administrative endpoints or alter their own roles.
- **Relational ORM**: SQLAlchemy with parameterized queries preventing SQL injection vulnerabilities.

---

## 3. Database Architecture & Schema Relationships

```
+----------------+       1:1       +--------------------+
|     users      |-----------------|  student_profiles  |
+----------------+                 +--------------------+
| id (PK)        |                           | 1:N
| email (UQ)     |                           +---------------------+
| password_hash  |                           |                     |
| role           |                           v                     v
| account_status |                 +------------------+  +-----------------+
+----------------+                 |  student_skills  |  | career_interests|
        | 1:N                      +------------------+  +-----------------+
        |                                    | N:1
        |                                    v
        |                              +------------+
        |                              |   skills   |
        |                              +------------+
        |                                    ^
        |                                    | N:1
        |                          +--------------------+
        |                          |   career_skills    |
        |                          +--------------------+
        |                                    | N:1
        |                                    v
        |                          +--------------------+
        +------------------------->|      careers       |<-----+
        |                          +--------------------+      |
        |                                    | 1:N             |
        |                                    v                 |
        | 1:N                      +--------------------+      |
        +------------------------->|   recommendations  |      |
        |                          +--------------------+      |
        |                                    | N:1             |
        | 1:N                                v                 |
        +------------------------->|    assessments     |      |
        |                          +--------------------+      |
        |                                                      |
        | 1:N                                                  |
        +------------------------------------------------------+
        |                                                      |
        v 1:N                                                  v 1:N
+----------------+                                     +--------------------+
| saved_careers  |                                     |   career_courses   |
+----------------+                                     +--------------------+
                                                               | N:1
                                                               v
                                                       +--------------------+
                                                       |      courses       |
                                                       +--------------------+
```

---

## 4. Security & Data Protection Measures

1. **Authentication**: Bcrypt one-way password hashing with salt. No plaintext credentials stored or transmitted.
2. **Access Control**: Strict backend verification of JWT claims. Role cannot be manipulated by frontend fields.
3. **Data Isolation**: Database queries strictly filter by `user_id = get_jwt_identity()` so students cannot read or tamper with another student's assessment history.
4. **Resilient Connectivity**: Graceful database fallback mechanism that checks MySQL server connectivity and safely falls back to local SQLite if MySQL service is not currently active on the host machine.
