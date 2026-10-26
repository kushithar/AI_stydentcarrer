# AI-Based Student Career Recommendation System

A production-grade, full-stack web application that evaluates student academic performance, technical and soft skills, domain interests, and work-style preferences to generate personalized, transparent, and explainable career recommendations backed by accredited learning roadmaps.

---

## 1. Project Overview & Architecture

### System Highlights:
- **Explainable Hybrid AI/ML Engine**: Combines normalized vector space cosine similarity (`scikit-learn` + `NumPy`), weighted multi-attribute scoring, and gap analysis.
- **Accredited Free Learning Roadmaps**: Maps recommended careers to 4-stage beginner-to-advanced roadmaps and free certified courses from freeCodeCamp, Kaggle, MDN, Microsoft Learn, and AWS.
- **Dual Role Experience**: Dedicated portals for **Students** (assessments, recommendations, bookmarks, skill charts, profiles) and **Administrators** (metrics dashboard, career management, student oversight, resource control, cohort analytics).
- **Security & Data Isolation**: Password hashing with Bcrypt, JWT authentication tokens, parameterized SQLAlchemy ORM, and student-to-student data boundary enforcement.
- **Modern Responsive Design**: Custom CSS design system adhering to professional navy blue, indigo, teal, and soft violet palettes with accessible contrast.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Recharts, Lucide React, Modern CSS3 |
| **Backend** | Python 3.13, Flask 3, Flask-CORS, SQLAlchemy 2, Flask-JWT-Extended, Flask-Bcrypt |
| **AI/ML Engine** | scikit-learn, NumPy, pandas, SciPy (Explainable Vector Cosine Similarity) |
| **Database** | MySQL (with seamless fallback to local SQLite for development/testing) |
| **Testing** | pytest (Backend REST API, ML Engine & Admin Auth), Vite build verification |

---

## 3. Project Directory Structure

```
student-career/
├── frontend/                     # React 18 + Vite client application
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProtectedRoute, CareerCard, RatingInput
│   │   ├── context/              # AuthContext (JWT management & session state)
│   │   ├── pages/                # Landing, Login, Register, Dashboard, Assessment, etc.
│   │   │   └── admin/            # AdminDashboard, CareerManagement, StudentManagement, etc.
│   │   ├── services/             # Axios API client modules
│   │   ├── styles/               # index.css design system tokens & responsive classes
│   │   ├── App.jsx               # Application route declarations
│   │   └── main.jsx              # React DOM bootstrap
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Flask REST API backend
│   ├── app/
│   │   ├── models/               # SQLAlchemy models (User, StudentProfile, Career, etc.)
│   │   ├── routes/               # API Blueprints (auth, student, assessment, admin, etc.)
│   │   ├── recommendation/       # Explainable AI recommendation engine & knowledge base
│   │   ├── utils/                # Auth decorators and helper utilities
│   │   ├── config.py             # MySQL configuration and graceful SQLite fallback
│   │   ├── extensions.py         # db, jwt, bcrypt, cors instances
│   │   ├── seed.py               # Database seeder & admin creator script
│   │   └── __init__.py           # Flask application factory
│   ├── tests/                    # pytest test suite
│   ├── requirements.txt          # Python dependencies
│   └── run.py                    # CLI application runner and admin initializer
│
├── database/
│   ├── schema.sql                # Production MySQL relational DDL script
│   └── seed_data.sql             # MySQL native seed insert script
│
├── docs/
│   ├── architecture.md           # System design and database relationship diagrams
│   ├── api-documentation.md      # Complete REST API reference
│   └── recommendation-method.md  # Mathematical formulations & explainability logic
│
├── .env.example                  # Environment configuration template
├── .gitignore                    # Version control ignore definitions
└── README.md                     # Comprehensive project documentation
```

---

## 4. Setup & Installation Instructions

### Prerequisites:
- Python 3.10+ (Verified on Python 3.13)
- Node.js 18+ (Verified on Node.js v20.18 LTS)
- (Optional) MySQL Server 8.0+

---

### Step 1: Backend Setup & Database Initialization

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Install Python dependencies:
   ```powershell
   py -3 -m pip install -r requirements.txt
   ```

3. (Optional) Configure MySQL in your `.env` file:
   ```ini
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=student_career_db
   DB_USER=root
   DB_PASSWORD=your_password
   ```
   *Note: If MySQL is not running on your machine, the application will automatically log an informational message and initialize a local SQLite database (`instance/career_recommendation.db`) so the entire system works out of the box without crashing.*

4. Initialize the database schema and populate seed careers:
   ```powershell
   py -3 run.py init-db
   ```

5. Initialize the first Administrator account safely:
   ```powershell
   py -3 run.py init-admin --email admin@careerai.com --password Admin@12345 --name "System Administrator"
   ```

6. Start the Flask backend server:
   ```powershell
   py -3 run.py
   ```
   *Backend REST API runs on: `http://127.0.0.1:5000`*

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   *Frontend application runs on: `http://localhost:5173`*

---

## 5. Default Demonstration Credentials

For seamless verification and testing, the application includes the following demo accounts:

### Student Account:
- **Email**: `student@test.com`
- **Password**: `Password123!`
- *(Or click **"Demo Student"** on the Login screen for instant autofill!)*

### Administrator Account:
- **Email**: `admin@careerai.com`
- **Password**: `Admin@12345`
- *(Or click **"Demo Admin"** on the Login screen for instant autofill!)*

---

## 6. Automated Testing & Verification

### Running Backend & Recommendation Tests:
Execute the full test suite using `pytest`:
```powershell
cd backend
py -3 -m pytest tests/ -v
```
**Results**:
```
tests/test_admin.py::test_admin_dashboard_stats PASSED
tests/test_admin.py::test_admin_route_blocked_for_students PASSED
tests/test_admin.py::test_admin_career_crud PASSED
tests/test_admin.py::test_admin_student_status_toggle PASSED
tests/test_auth.py::test_register_success PASSED
tests/test_auth.py::test_register_duplicate_email PASSED
tests/test_auth.py::test_login_success PASSED
tests/test_auth.py::test_login_invalid_credentials PASSED
tests/test_auth.py::test_protected_route_unauthorized PASSED
tests/test_recommendation.py::test_engine_scores_within_bounds PASSED
tests/test_recommendation.py::test_engine_profile_differentiation PASSED
tests/test_recommendation.py::test_engine_missing_marks_safe PASSED
tests/test_recommendation.py::test_assessment_api_and_recommendations PASSED
tests/test_recommendation.py::test_student_data_isolation PASSED

====================== 14 passed in 10.34s =======================
```

### Running Frontend Production Build Check:
```powershell
cd frontend
npm run build
```
**Result**:
`✓ built in 9.96s` with exit code 0.

---

## 7. Recommendation Engine Methodology & Formula

The recommendation engine calculates a normalized multi-component composite match score:

$$\text{MatchScore}(s, c) = 100 \times \left( 0.35 \cdot S_{\text{interest}} + 0.30 \cdot S_{\text{skill}} + 0.20 \cdot S_{\text{academic}} + 0.15 \cdot S_{\text{workstyle}} \right)$$

1. **Interest Alignment (35%)**: High-dimensional vector cosine similarity via `scikit-learn` between student domain interest ratings and target career profiles.
2. **Skill Proficiency Match (30%)**: Weighted comparison of student ratings against required (1.5x weight) and preferred baseline competencies, with gap identification. Unreported skills utilize a neutral prior ($0.4$) instead of harsh zero penalties.
3. **Academic Alignment (20%)**: Combines academic marks thresholds with Jaccard subject affinity. Missing marks default to neutral prior ($0.7$).
4. **Work-Style Alignment (15%)**: Evaluates analytical depth, collaborative teamwork, creative freedom, and leadership ownership against the career's operational environment.

---

## 8. Important Recommendation Safeguards
- Match scores represent **estimated profile alignment**, not guaranteed employment or salary probabilities.
- Recommendations never make inferences based on sensitive personal characteristics.
- Students are never permanently excluded from exploring any career solely due to low current skills.
- Skill gaps are separated from formal eligibility requirements and paired with verified free courses.
