-- AI-Based Student Career Recommendation System
-- MySQL Relational Database Schema DDL

CREATE DATABASE IF NOT EXISTS student_career_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE student_career_db;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    account_status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Student Profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    education_level VARCHAR(50) NULL,
    course_stream VARCHAR(100) NULL,
    academic_percentage FLOAT NULL,
    preferred_subjects TEXT NULL,
    bio TEXT NULL,
    profile_completion INT DEFAULT 20,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT NULL,
    INDEX idx_skill_name (name),
    INDEX idx_skill_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Student Skills table
CREATE TABLE IF NOT EXISTS student_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_profile_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency_rating INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_student_skills_profile FOREIGN KEY (student_profile_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_skill (student_profile_id, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Career Interests table
CREATE TABLE IF NOT EXISTS career_interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_profile_id INT NOT NULL,
    interest_category VARCHAR(100) NOT NULL,
    preference_rating INT NOT NULL DEFAULT 3,
    CONSTRAINT fk_interests_profile FOREIGN KEY (student_profile_id) REFERENCES student_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Careers table
CREATE TABLE IF NOT EXISTS careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    typical_responsibilities TEXT NULL,
    required_skills_summary TEXT NULL,
    preferred_skills_summary TEXT NULL,
    relevant_subjects TEXT NULL,
    prerequisites TEXT NULL,
    min_academic_percentage FLOAT DEFAULT 50.0,
    average_salary_range VARCHAR(80) NULL,
    job_outlook VARCHAR(80) NULL,
    work_environment VARCHAR(120) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_career_title (title),
    INDEX idx_career_category (category),
    INDEX idx_career_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Career Skills table
CREATE TABLE IF NOT EXISTS career_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_id INT NOT NULL,
    skill_id INT NOT NULL,
    designation VARCHAR(20) NOT NULL DEFAULT 'required',
    importance_weight FLOAT DEFAULT 1.0,
    minimum_rating INT DEFAULT 3,
    CONSTRAINT fk_career_skills_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    CONSTRAINT fk_career_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY uq_career_skill (career_id, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assessment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    structured_input LONGTEXT NOT NULL,
    completion_status VARCHAR(30) DEFAULT 'completed',
    total_skills_rated INT DEFAULT 0,
    top_interest VARCHAR(100) NULL,
    CONSTRAINT fk_assessment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_assessment_date (assessment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assessment_id INT NOT NULL,
    career_id INT NOT NULL,
    match_score FLOAT NOT NULL,
    ranking INT NOT NULL,
    matched_interests TEXT NULL,
    matching_skills TEXT NULL,
    skills_to_improve TEXT NULL,
    academic_strengths TEXT NULL,
    explanation TEXT NOT NULL,
    learning_roadmap TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rec_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_assessment FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    INDEX idx_rec_user (user_id),
    INDEX idx_rec_assessment (assessment_id),
    INDEX idx_rec_ranking (ranking)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Saved Careers table
CREATE TABLE IF NOT EXISTS saved_careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    career_id INT NOT NULL,
    notes TEXT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_saved_user_career (user_id, career_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    description TEXT NULL,
    url VARCHAR(500) NOT NULL,
    difficulty VARCHAR(30) NOT NULL DEFAULT 'Beginner',
    duration VARCHAR(50) NULL,
    skill_taught VARCHAR(100) NULL,
    cost_type VARCHAR(20) DEFAULT 'Free',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Career Courses mapping table
CREATE TABLE IF NOT EXISTS career_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    career_id INT NOT NULL,
    course_id INT NOT NULL,
    relevance_stage VARCHAR(30) DEFAULT 'Core',
    CONSTRAINT fk_cc_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE,
    CONSTRAINT fk_cc_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uq_career_course (career_id, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_id INT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_log_action (action),
    INDEX idx_log_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
