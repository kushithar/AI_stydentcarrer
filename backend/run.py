import sys
import argparse
from app import create_app
from app.extensions import db
from app.seed import seed_database, create_admin_user

app = create_app()

def init_database_command():
    with app.app_context():
        print(f"Creating all database tables using {db.engine.dialect.name}...")
        db.create_all()
        print("Seeding default data...")
        seed_database()
        print("Database initialization complete.")

def init_admin_command(email, password, name):
    with app.app_context():
        db.create_all()
        create_admin_user(email=email, password=password, name=name)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Career Recommendation Application Server")
    subparsers = parser.add_subparsers(dest="command")

    # init-db command
    subparsers.add_parser("init-db", help="Initialize tables and seed default data")

    # init-admin command
    admin_parser = subparsers.add_parser("init-admin", help="Create or promote an administrator account")
    admin_parser.add_argument("--email", default="admin@careerai.com", help="Admin email address")
    admin_parser.add_argument("--password", default="AdminPassword123!", help="Admin password")
    admin_parser.add_argument("--name", default="System Administrator", help="Admin full name")

    args, unknown = parser.parse_known_args()

    if args.command == "init-db":
        init_database_command()
    elif args.command == "init-admin":
        init_admin_command(args.email, args.password, args.name)
    else:
        # Default: ensure tables exist on startup and run server
        with app.app_context():
            db.create_all()
            # If no careers exist, seed default records
            from app.models.career import Career
            if Career.query.count() == 0:
                print("Seeding initial dataset...")
                seed_database()
                create_admin_user()

        port = 5000
        print(f"Starting Career Recommendation Backend on http://127.0.0.1:{port}")
        app.run(host="0.0.0.0", port=port, debug=True)
