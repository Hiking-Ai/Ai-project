# app/schemas/categories.py

from pydantic import BaseModel
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    parent_category_id: Optional[int] = None
    display_order: Optional[int] = 0
    is_last_level: Optional[bool] = False

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    category_id: int

    class Config:
        orm_mode = True
