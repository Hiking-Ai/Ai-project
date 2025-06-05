from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.utils.jwt import decode_access_token

# OAuth2PasswordBearer에서 tokenUrl은 로그인 경로와 정확히 맞춰야 합니다
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    user_email = decode_access_token(token)
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user_email
