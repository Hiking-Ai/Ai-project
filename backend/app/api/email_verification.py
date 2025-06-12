from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random, string
from datetime import datetime
from app.db.session import get_db
from backend.app.models.signup_token import SignupToken
from app.utils.email_sender import send_verification_email

router = APIRouter()

def generate_code(length=6):
    return ''.join(random.choices(string.digits, k=length))

@router.post("/send-verification-code")
def send_code(email: str, db: Session = Depends(get_db)):
    code = generate_code()
    exisiting = db.query(SignupToken).filter(SignupToken.email == email).first()
    if exisiting:
        exisiting.token = code
        exisiting.is_verified = False
        exisiting.create_at = datetime.utcnow()
    else:
        token = SignupToken(email=email, token=code)
        db.add(token)

    send_verification_email(email, code)
    db.commit()
    return {"message": "인증코드가 이메일로 전송되었습니다."}

@router.post("/verify-code")
def verify_code(email: str, code: str, db: Session = Depends(get_db)):
    token = db.query(SignupToken).filter(SignupToken.email == email).first()
    if not token or token.token != code:
        raise HTTPException(status_code=400, detail="잘못된 인증 코드입니다.")
    token.is_verified = True
    db.commit()
    return {"message": "이메일 인증 완료"}