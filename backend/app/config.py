import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from backend/.env or root .env
basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
root_env = os.path.join(os.path.dirname(basedir), '.env')
backend_env = os.path.join(basedir, '.env')

if os.path.exists(backend_env):
    load_dotenv(backend_env)
elif os.path.exists(root_env):
    load_dotenv(root_env)

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-student-career-ai-2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-career-recommendation-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_EXPIRE_HOURS', '24')))
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Database Configuration
    DB_TYPE = os.getenv('DB_TYPE', 'mysql').lower()
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    DB_NAME = os.getenv('DB_NAME', 'student_career_db')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')

    # Primary target: MySQL
    MYSQL_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLITE_URI = f"sqlite:///{os.path.join(basedir, 'instance', 'career_recommendation.db')}"

    # Determine default database URI
    DATABASE_URL = os.getenv('DATABASE_URL')
    if DATABASE_URL:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        if DB_TYPE == 'sqlite':
            SQLALCHEMY_DATABASE_URI = SQLITE_URI
        else:
            SQLALCHEMY_DATABASE_URI = MYSQL_URI

    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000').split(',')


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_SECRET_KEY = 'test-jwt-secret'
    SECRET_KEY = 'test-secret-key'
