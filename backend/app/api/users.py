from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserLogin, UserSignup
from app.models.user import User, UserRole
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.db.session import get_db
from fastapi.security import OAuth2PasswordRequestForm
from app.utils.deps import get_current_admin_user
from app.models.post import Post
from sqlalchemy import func
from datetime import datetime, date
from app.models.signup_token import SignupToken
from app.utils.email_utils import send_verification_email
import random
from pydantic import EmailStr, BaseModel
from app.schemas.user import EmailRequest, PasswordResetRequest, PasswordResetCodeVerify

router = APIRouter()

# 회원가입
@router.post("/signup")
async def signup(user: UserSignup, db: Session = Depends(get_db)):
    token = db.query(SignupToken).filter(SignupToken.email == user.user_email).first()
    if not token or not token.is_verified:
        raise HTTPException(status_code=400, detail="이메일 인증이 필요합니다.")
    # 사용자 생성
    new_user = User(
        user_email = user.user_email,
        password = hash_password(user.password),
        nickname = user.nickname,
        user_name = user.user_name,
        role = UserRole.USER,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 인증에 사용한 토큰 삭제
    db.delete(token)
    db.commit()

    return {"message":"회원가입 완료되었습니다."}

# 로그인
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_email = form_data.username  # OAuth2 기본 필드는 username
    password = form_data.password

    db_user = db.query(User).filter(User.user_email == user_email).first()
    if not db_user or not verify_password(password, db_user.password):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 일치하지 않습니다.")
    
    token = create_access_token({"sub": db_user.user_email})
    return {"access_token": token, "token_type": "bearer", "role": db_user.role.value}

# 관리자의 회원 삭제
@router.delete("/admin/delete-user/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)   # 관리자 권한 검사
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="해당 유저를 찾을 수 없습니다.")
    
    db.delete(user)
    db.commit()
    return {"message": f"유저 {user.user_email}가 삭제되었습니다."}

# 유저목록 조회
@router.get("/admin/users")
def list_users(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    return db.query(User).all()

# 관리자 권한 주기 
@router.patch("/admin/promote/{user_id}")
def promote_user(user_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    user.role = UserRole.ADMIN
    db.commit()
    return {"message": "관리자로 승격됨"}

# 관리자 권한 해제
@router.patch("/admin/demote/{user_id}")
def demote_user(user_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    user.role = UserRole.USER
    db.commit()
    return {"message": "일반 사용자로 변경됨"}

# api 통계 보여주기
@router.get("/admin/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    total_users = db.query(func.count(User.user_id)).scalar()
    admin_users = db.query(func.count(User.user_id)).filter(User.role == UserRole.ADMIN).scalar()
    normal_users = db.query(func.count(User.user_id)).filter(User.role == UserRole.USER).scalar()

    total_posts = db.query(func.count(Post.post_id)).scalar()

    today = date.today()
    new_users_today = db.query(func.count(User.user_id)).filter(func.date(User.create_at) == today).scalar()
    new_posts_today = db.query(func.count(Post.post_id)).filter(func.date(Post.create_at) == today).scalar()

    return {
        "total_users": total_users,
        "admin_users": admin_users,
        "normal_users": normal_users,
        "total_posts": total_posts,
        "new_users_today": new_users_today,
        "new_posts_today": new_posts_today
    }

# 월별 가입자 수 집계
@router.get("/admin/stats/users/monthly")
def user_signup_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    results = (
        db.query(
            func.date_format(User.create_at, '%Y-%m').label("month"),
            func.count(User.user_id).label("count")
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    return [{"month": r.month, "count": r.count} for r in results]

# 이메일 인증 코드 발송
@router.post("/request-verification")
async def request_email_verification(request: EmailRequest, db: Session = Depends(get_db)):
    email = request.email
    print("1234")
    # 기존 토큰 삭제 (재요청 대비)
    db.query(SignupToken).filter(SignupToken.email == email).delete()
    db.commit()

    code = str(random.randint(100000, 999999))
    token = SignupToken(email=email, token=code)
    db.add(token)
    db.commit()

    await send_verification_email(email, code)
    return {"message": "인증 코드가 이메일로 발송되었습니다."}

class EmailVerificationRequest(BaseModel):
    email: EmailStr
    code: str

# 인증코드 인증
@router.post("/verify-email")
def verify_email(payload: EmailVerificationRequest, db: Session = Depends(get_db)):
    token = db.query(SignupToken).filter(SignupToken.email == payload.email).first()
    if not token or token.token != payload.code:
        raise HTTPException(status_code=400, detail="인증 실패: 잘못된 코드입니다.")
    if token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="인증 코드가 만료되었습니다.")
    
    token.is_verified = True
    db.commit()
    return {"message": "이메일 인증이 완료되었습니다."}

# 비밀번호 변경 이메일 인증코드 발송
@router.post("/request-password-reset")
async def request_password_reset(request: PasswordResetRequest, db: Session = Depends(get_db)):
    email = request.email
    user = db.query(User).filter(User.user_email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="해당 이메일로 등록된 유저가 없습니다")
    
    # 기존 인증코드 삭제
    db.query(SignupToken).filter(SignupToken.email == email, SignupToken.purpose == "reset").delete()
    db.commit()

    # 새 인증코드 발송
    code = str(random.randint(100000, 999999))
    token = SignupToken(email=email, token=code, purpose="reset")
    db.add(token)
    db.commit()

    await send_verification_email(email, code)
    return {"message": "비밀번호 재설정 코드가 이메일로 발송되었습니다."}

# 패스워드 변경 인증코드 확인
@router.post("/verify-password-code")
def verify_password_code(payload: PasswordResetCodeVerify, db: Session = Depends(get_db)):
    token = db.query(SignupToken).filter(
        SignupToken.email == payload.email,
        SignupToken.purpose == "reset"
    ).first()

    if not token or token.token != payload.code:
        raise HTTPException(status_code=400, detail="잘못된 인증 코드입니다.")
    if token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="인증 코드가 만료되었습니다.")

    token.is_verified = True
    db.commit()
    return {"message": "인증 코드 확인 완료"}

class PasswordResetRequest(BaseModel):
    email: EmailStr
    new_password: str

# 패스 워드 변경
@router.post("/reset-password")
def reset_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    token = db.query(SignupToken).filter(
        SignupToken.email == payload.email,
        SignupToken.purpose == "reset",
        SignupToken.is_verified == True
    ).first()

    if not token:
        raise HTTPException(status_code=400, detail="이메일 인증이 필요합니다.")

    user = db.query(User).filter(User.user_email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

    user.password = hash_password(payload.new_password)
    db.commit()

    # 인증 토큰 제거 (한 번만 사용)
    db.delete(token)
    db.commit()

    return {"message": "비밀번호가 성공적으로 변경되었습니다."}