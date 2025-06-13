from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class PostFileOut(BaseModel):
    file_id: int
    original_file_name: str
    stored_path: str
    file_type: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PostOut(BaseModel):
    post_id: int
    title: str
    content: str
    user_id: int
    view_count: int
    create_at: datetime
    thumbnail_path: Optional[str] = None  # ✅ 오타 수정됨
    files: List[PostFileOut] = []

    model_config = ConfigDict(from_attributes=True)

class PostResponse(BaseModel):
    post_id: int
    title: str
    content: str
    create_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PostListResponse(BaseModel):
    total: int
    items: List[PostOut]

    model_config = ConfigDict(from_attributes=True)  # ✅ 여기도 from_attributes 사용 권장
