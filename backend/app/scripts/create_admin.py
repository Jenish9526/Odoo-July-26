import os

from app.core.database import SessionLocal
from app.services.auth_service import AuthService


def main() -> None:
    email = os.getenv("ADMIN_EMAIL", "admin@transitops.com")
    password = os.getenv("ADMIN_PASSWORD")
    if not password:
        raise RuntimeError("Set ADMIN_PASSWORD before running this script")

    db = SessionLocal()
    try:
        service = AuthService(db)
        user = service.create_admin_user(email, password)
        print(f"Created administrator: {user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
