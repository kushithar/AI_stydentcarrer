import os
import logging
from flask import Flask, jsonify
from sqlalchemy import text
from app.config import Config
from app.extensions import db, jwt, bcrypt, cors

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger('CareerAI')

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Ensure instance directory exists
    instance_path = os.path.join(os.path.abspath(os.path.dirname(os.path.dirname(__file__))), 'instance')
    os.makedirs(instance_path, exist_ok=True)

    # Test database connectivity and handle fallback if MySQL is unreachable
    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if 'mysql' in db_uri:
        try:
            from sqlalchemy import create_engine
            test_engine = create_engine(db_uri, connect_args={'connect_timeout': 3})
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("Successfully connected to MySQL database.")
        except Exception as e:
            logger.warning(f"Could not connect to MySQL ({e}).")
            logger.warning("Falling back to local SQLite database for development/testing.")
            app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLITE_URI']

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.student import student_bp
    from app.routes.assessment import assessment_bp
    from app.routes.recommendation import recommendation_bp
    from app.routes.saved_career import saved_bp
    from app.routes.course import course_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(assessment_bp)
    app.register_blueprint(recommendation_bp)
    app.register_blueprint(saved_bp)
    app.register_blueprint(course_bp)
    app.register_blueprint(admin_bp)

    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        db_status = "connected"
        try:
            db.session.execute(text("SELECT 1"))
        except Exception as e:
            db_status = f"unhealthy: {str(e)}"

        return jsonify({
            "status": "healthy",
            "service": "AI-Based Student Career Recommendation System",
            "database_status": db_status,
            "database_dialect": db.engine.dialect.name
        }), 200

    # Global Error Handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad Request", "message": str(e.description if hasattr(e, 'description') else e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource Not Found", "message": "The requested API endpoint was not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method Not Allowed"}), 405

    @app.errorhandler(500)
    def internal_error(e):
        logger.error(f"Internal server error: {e}")
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred"}), 500

    # JWT Error handlers
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({"error": "Missing or invalid authorization token"}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Authorization token has expired. Please log in again."}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({"error": "Invalid authorization token format"}), 401

    return app
