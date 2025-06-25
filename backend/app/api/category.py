from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.categories import Category  # ✅ ERD 기준으로 `categories` 테이블을 사용
from app.schemas.categories import CategoryOut  # ✅ 기존 CategoryTreeResponse 대신 단순 출력

router = APIRouter()

# 카테고리 목록 조회
@router.get("/categories", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories
