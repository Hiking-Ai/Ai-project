from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException
import os
from dotenv import load_dotenv
from app.models.user import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret")
print("✅ 현재 SECRET_KEY:", SECRET_KEY)
print("현재 작업 디렉토리", os.getcwd())
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("payload:", payload)
        return payload.get("sub")
    except JWTError as e:
        print("JWT decode error:", e)
        raise HTTPException(status_code=401, detail="Invalid token")