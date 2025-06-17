from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.utils.jwt import decode_access_token
from app.db.session import get_db
from app.models.user import User, UserRole
from sqlalchemy.orm import Session

# OAuth2PasswordBearer에서 tokenUrl은 로그인 경로와 정확히 맞춰야 합니다
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> User:
    user_email = decode_access_token(token)
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = db.query(User).filter(User.user_email == user_email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def get_current_admin_user(
        current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="관리자 권한이 필요합니다.")
    return current_user
