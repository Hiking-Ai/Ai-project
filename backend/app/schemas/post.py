from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PostFileOut(BaseModel):
    file_id: int
    original_file_name: str
    stored_path: str
    file_type: Optional[str]

    class Config:
        orm_mode = True

class PostOut(BaseModel):
    post_id: int
    title: str
    content: str
    user_email: str
    view_count: int
    created_at: datetime
    files: List[PostFileOut] = []

    class Config:
        orm_mode = True
