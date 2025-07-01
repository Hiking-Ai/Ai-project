from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user_profile import UserProfile
from app.schemas.user_profile import (
    UserProfileBase,
    UserProfileResponse,
    UserProfileUpdate,
)
from app.models.user import User
from app.schemas.user import UserUpdate,UserResponse
from app.utils.deps import get_current_user
from app.models.user import User
from app.utils.security import pwd_context

router = APIRouter()

# 프로필 생성 및 업데이트 (POST)
@router.post("/profile", response_model=UserProfileResponse)
def create_or_update_profile(
    profile: UserProfileBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # UserProfile 조회
    db_profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.user_id)
        .first()
    )
    db_user = (
        db.query(User)
        .filter(User.user_id == current_user.user_id)
        .first()
    )

    if db_profile:
        for key, value in profile.dict(exclude_unset=True).items():
            setattr(db_profile, key, value)
    else:
        db_profile = UserProfile(
            user_id=current_user.user_id,
            **profile.dict()
        )
        db.add(db_profile)

    # user_level 필드가 넘어왔다면 User 테이블에도 반영
    if profile.user_level is not None:
        db_user.level = profile.user_level

    db.commit()
    db.refresh(db_user)
    db.refresh(db_profile)

    # 반환 스키마에 level 동기화
    db_profile.level = db_user.level
    return db_profile


# 프로필 수정 (PATCH)
@router.patch("/profile", response_model=UserResponse)
def update_profile(
    profile_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    print("profile_update",profile_update)
    db_user = (
        db.query(User)
        .filter(User.user_id == current_user.user_id)
        .first()
    )
    if not db_user:
        raise HTTPException(status_code=404, detail="Profile not found")

    # 비밀번호 변경 로직...
    if profile_update.new_password:
        if not profile_update.current_password:
            raise HTTPException(status_code=400, detail="현재 비밀번호를 입력하세요.")
        if not pwd_context.verify(profile_update.current_password, db_user.password):
            raise HTTPException(status_code=401, detail="현재 비밀번호가 일치하지 않습니다.")
        if profile_update.new_password != profile_update.new_password_confirm:
            raise HTTPException(status_code=400, detail="새 비밀번호가 확인과 일치하지 않습니다.")
        if pwd_context.verify(profile_update.new_password, db_user.password):
            raise HTTPException(status_code=400, detail="새 비밀번호가 기존 비밀번호와 같습니다.")
        db_user.password = pwd_context.hash(profile_update.new_password)
    # 프로필 & user_level 업데이트
    update_data = profile_update.dict(
        exclude_unset=True,
        exclude={"current_password", "new_password", "new_password_confirm"},
    )
    for key, value in update_data.items():
        if key == "user_level":
            db_user.level = value
        else:
            setattr(db_user, key, value)
    print("profile_update",profile_update)

    db.commit()
    db.refresh(db_user)

    db_user.level = db_user.level
    return db_user


# 내 프로필 조회 (GET)
@router.get("/profile", response_model=UserProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == current_user.user_id)
        .first()
    )
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # User의 level을 profile에도 복사
    db_profile.level = current_user.level
    return db_profile
