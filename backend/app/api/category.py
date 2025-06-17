from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.category import Category
from app.schemas.category import CategoryWithChildren

router = APIRouter()

# 카테고리
@router.get("/categories/tree", response_model=List[CategoryWithChildren])
def get_category_tree(db: Session =Depends(get_db)):
    top_level_categories = db.query(Category).filter(Category.parent_id == None).all()
    return top_level_categories