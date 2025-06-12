from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user_profile import UserProfile
from app.schemas.user_profile import UserProfileCreate, UserProfileOut
from app.utils.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/profile", response_model=UserProfileOut)
def create_or_update_profile(
    profile: UserProfileCreate,
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
