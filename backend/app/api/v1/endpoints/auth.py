from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db, require_role
from app.models.user import User
from app.schemas.auth import LoginRequest, PasswordForgotRequest, PasswordResetRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    service = AuthService(db)
    return service.authenticate(data)


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)) -> dict[str, object]:
    return {"id": str(current_user.id), "email": current_user.email, "role": current_user.role.value}


@router.post("/forgot-password")
def forgot_password(data: PasswordForgotRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    service = AuthService(db)
    return service.forgot_password(data)


@router.post("/reset-password")
def reset_password(data: PasswordResetRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    service = AuthService(db)
    return service.reset_password(data)


@router.post("/logout")
def logout() -> dict[str, str]:
    return {"message": "Logout successful. Remove the token from the client to invalidate the session."}


@router.get("/admin-only")
def admin_only(user: User = Depends(require_role("administrator"))) -> dict[str, str]:
    return {"message": f"Welcome administrator {user.email}"}
