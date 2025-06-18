from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.category import Category
from app.schemas.category import  CategoryTreeResponse
from app.models.subcategory import SubCategory

router = APIRouter()

# 카테고리
@router.get("/categories/tree", response_model=List[CategoryTreeResponse])
def get_category_tree(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    result = []
    for cat in categories:
        subcats = db.query(SubCategory).filter(SubCategory.category_id == cat.category_id).all()
        result.append({
            "category_id": cat.category_id,
            "category_name": cat.category_name,
            "subcategories": subcats
        })
    return result