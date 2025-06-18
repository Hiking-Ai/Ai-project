# app/api/post_views.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.post_views import PostWithCategories, PostWithAuthor
from app.schemas.post_views import PostWithCategoriesOut, PostWithAuthorOut

router = APIRouter()

# 게시글 + 카테고리 조회 View
@router.get("/posts/view/categories", response_model=list[PostWithCategoriesOut])
def get_posts_with_categories(db: Session = Depends(get_db)):
    return db.query(PostWithCategories).all()

# 게시글 + 작성자 View
@router.get("/posts/view/with-author", response_model=list[PostWithAuthorOut])
def get_posts_with_author(db: Session = Depends(get_db)):
    return db.query(PostWithAuthor).all()
