from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.favorite import Favorite
from app.models.user import User
from app.utils.deps import get_current_user

router = APIRouter()

# 좋아요 기능 토글
@router.post("/posts/{post_id}/favorite-toggle")
def toggle_favorite(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorite = db.query(Favorite).filter_by(post_id=post_id, user_id=current_user.user_id).first()

    if favorite:
        db.delete(favorite)
        db.commit()
        return {"message": "좋아요 취소됨", "status": "unliked"}
    else:
        new_fav = Favorite(post_id=post_id, user_id=current_user.user_id)
        db.add(new_fav)
        db.commit()
        return {"message": "좋아요 완료", "status": "liked"}