from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserLogin, UserSignup
from app.models.user import User
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.db.session import get_db
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.user_email == user.user_email).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다.")
    
    new_user = User(
        user_email = user.user_email,
        password = hash_password(user.password),
        nickname = user.nickname,
        user_name = user.user_name,
        age = user.age,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message":"회원가입 완료"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_email = form_data.username  # OAuth2 기본 필드는 username
    password = form_data.password

    db_user = db.query(User).filter(User.user_email == user_email).first()
    if not db_user or not verify_password(password, db_user.password):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 일치하지 않습니다.")
    
    token = create_access_token({"sub": db_user.user_email})
    return {"access_token": token, "token_type": "bearer"}
