# app/api/post_views.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.post_views import  PostWithAuthor, ViewPostCategory
from app.schemas.post_views import PostWithCategoriesOut, PostWithAuthorOut, PostCategoryOut


router = APIRouter()


# 게시글 + 작성자 닉네임 포함 View
@router.get("/posts/view/with-author", response_model=list[PostWithAuthorOut])
def get_posts_with_author(db: Session = Depends(get_db)):
    return db.query(PostWithAuthor).all()

# 게시글 분류 카테고리 view 조회
# 게시글과 연결된 카테고리 정보를 view에서 전체 조회
@router.get("/view/post-categories", response_model=list[PostCategoryOut])
def get_post_categories(db: Session = Depends(get_db)):
    return db.query(ViewPostCategory).all()