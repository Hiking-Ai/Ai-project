from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime

# 파일 정보 출력용
class PostFileOut(BaseModel):
    file_id: int
    original_file_name: str
    stored_path: str
    file_type: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# 게시글 생성용 입력 스키마
class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, description="제목은 1자 이상이여야 합니다.")
    content: str = Field(..., min_length=1, description="내용은 1자 이상이여야 합니다.")
    thumbnail_path: Optional[str] = None
    category_ids: List[int]

# 게시글 출력 스키마
class PostOut(BaseModel):
    post_id: int
    title: str
    content: str
    user_id: int
    nickname: str
    view_count: int
    create_at: datetime
    thumbnail_path: Optional[str] = None
    files: List[PostFileOut] = []
    likes: int
    category_ids : List[int]


    model_config = ConfigDict(from_attributes=True)

# 단일 게시글 간단 출력용
class PostResponse(BaseModel):
    post_id: int
    title: str
    content: str
    create_at: datetime

    model_config = ConfigDict(from_attributes=True)

# 게시글 리스트 응답
class PostListResponse(BaseModel):
    total: int
    items: List[PostOut]

    model_config = ConfigDict(from_attributes=True)
