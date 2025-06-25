from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user_profile import UserProfile
from app.schemas.user_profile import UserProfileBase, UserProfileResponse, UserProfileUpdate
from app.utils.deps import get_current_user
from app.models.user import User
from app.utils.security import pwd_context

router = APIRouter()

# 프로필 생성
@router.post("/profile", response_model=UserProfileResponse)
def create_or_update_profile(
    profile: UserProfileBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.user_id).first()

    if db_profile:
        # 업데이트
        for key, value in profile.dict(exclude_unset=True).items():
            setattr(db_profile, key, value)
    else:
        # 새로 생성
        db_profile = UserProfile(user_id=current_user.user_id, **profile.dict())
        db.add(db_profile)

    db.commit()
    db.refresh(db_profile)
    return db_profile

# 프로필 수정
@router.patch("/profile", response_model=UserProfileResponse)
def update_profile(
    profile_update: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.user_id).first()
    db_user = db.query(User).filter(User.user_id == current_user.user_id).first()

    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # ✅ 비밀번호 변경 로직
    if profile_update.new_password:
        if not profile_update.current_password:
            raise HTTPException(status_code=400, detail="현재 비밀번호를 입력하세요.")

        if not pwd_context.verify(profile_update.current_password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="현재 비밀번호가 일치하지 않습니다.")

        # ✅ 새 비밀번호 확인 검사
        if profile_update.new_password != profile_update.new_password_confirm:
            raise HTTPException(status_code=400, detail="새 비밀번호가 확인과 일치하지 않습니다.")

        if pwd_context.verify(profile_update.new_password, db_user.hashed_password):
            raise HTTPException(status_code=400, detail="새 비밀번호가 기존 비밀번호와 같습니다.")

        # 비밀번호 변경
        db_user.hashed_password = pwd_context.hash(profile_update.new_password)

    # ✅ 프로필 정보 수정
    for key, value in profile_update.dict(
        exclude_unset=True,
        exclude={"current_password", "new_password", "new_password_confirm"}
    ).items():
        setattr(db_profile, key, value)

    db.commit()
    db.refresh(db_profile)
    return db_profile

# 내 프로필 조회
@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    db: Session = Depends(get_db),  
    current_user: User = Depends(get_current_user)
):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.user_id).first()

    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return db_profile