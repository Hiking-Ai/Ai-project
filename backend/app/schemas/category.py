from pydantic import BaseModel, ConfigDict
from typing import List, Optional

# 기본 카테고리 정보 (상위)
class CategoryBase(BaseModel):
    category_id: int
    category_name: str

    model_config = ConfigDict(from_attributes=True)

# 하위 카테고리 출력용
class SubCategoryOut(BaseModel):
    subcategory_id: int
    subcategory_name: str

    model_config = ConfigDict(from_attributes=True)

# 상위 카테고리 + 하위 포함 응답
class CategoryTreeResponse(BaseModel):
    category_id: int
    category_name: str
    subcategories: List[SubCategoryOut]

    model_config = ConfigDict(from_attributes=True)

