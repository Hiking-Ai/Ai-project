from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.post_views import ViewPostCategory  # ✅ 뷰 모델 import
from app.schemas.post_views import PostCategoryOut  # ✅ 뷰 응답 모델 import

router = APIRouter()

@router.get("/posts/{post_id}")
def get_post_by_id(post_id: int, db: Session = Depends(get_db)):
    post_data = db.query(ViewPostCategory).filter(ViewPostCategory.post_id == post_id).all()

    if not post_data:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")

    # 게시글은 중복이므로 첫 항목 기준
    base = post_data[0]
    category_names = [p.category_name for p in post_data]

    return {
        "post_id": base.post_id,
        "title": base.title,
        "content": base.content,
        "level": base.level,
        "purpose": base.purpose,
        "path_type": base.path_type,
        "category_names": category_names,
        "create_at": base.post_created,
        "nickname": base.nickname,
        "user_id": base.user_id,
        "view_count": base.view_count,
        "likes": base.likes,
        "files": [],  # 필요하면 기존 방식으로 파일 join 해서 추가
    }
