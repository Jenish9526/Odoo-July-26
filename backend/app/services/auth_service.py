from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, PasswordForgotRequest, PasswordResetRequest, TokenResponse, UserOut


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def authenticate(self, data: LoginRequest) -> TokenResponse:
        user = self.db.query(User).filter(User.email == data.email.lower()).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if user.role.value != data.role.lower():
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Role mismatch")

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account inactive")

        if not verify_password(data.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        expires_delta = timedelta(days=settings.remember_me_expire_days) if data.remember_me else timedelta(minutes=settings.access_token_expire_minutes)
        token = create_access_token(str(user.id), expires_delta=expires_delta)
        user.last_login_at = datetime.now(timezone.utc)
        self.db.commit()

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in=int(expires_delta.total_seconds()),
            user=UserOut(id=str(user.id), email=user.email, role=user.role.value),
        )

    def get_current_user(self, user_id: str) -> User:
        user = self.db.query(User).filter(User.id == UUID(user_id)).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    def forgot_password(self, data: PasswordForgotRequest) -> dict[str, str]:
        user = self.db.query(User).filter(User.email == data.email.lower()).first()
        if not user:
            return {"message": "If an account exists, a reset link has been sent."}

        token = create_access_token(str(user.id), expires_delta=timedelta(minutes=settings.password_reset_token_expire_minutes))
        user.password_reset_token = token
        user.password_reset_expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.password_reset_token_expire_minutes)
        self.db.commit()
        return {"message": "If an account exists, a reset link has been sent."}

    def reset_password(self, data: PasswordResetRequest) -> dict[str, str]:
        user = self.db.query(User).filter(User.password_reset_token == data.token).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")
        if not user.password_reset_expires_at or user.password_reset_expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token expired")

        user.hashed_password = get_password_hash(data.new_password)
        user.password_reset_token = None
        user.password_reset_expires_at = None
        self.db.commit()
        return {"message": "Password updated successfully"}

    def create_admin_user(self, email: str, password: str) -> User:
        existing = self.db.query(User).filter(User.email == email.lower()).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

        user = User(
            email=email.lower(),
            hashed_password=get_password_hash(password),
            role=UserRole.administrator,
            is_active=True,
            is_verified=True,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
