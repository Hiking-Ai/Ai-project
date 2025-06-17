from pydantic import BaseModel
from typing import List, Optional

class CategoryBase(BaseModel):
    category_id: int
    category_name: str
    parent_id : Optional[int] = None

class CategoryWithChildren(CategoryBase):
    subcategories: List[CategoryBase] = []

    class Config: orm_mode = True