from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PostFileOut(BaseModel):
    file_id: int
    original_file_name: str
    stored_path: str
    file_type: Optional[str] = None

    class Config:
        orm_mode = True


class PostOut(BaseModel):
    post_id: int
    title: str
    content: str
    user_id: int
    view_count: int
    create_at: datetime
    humbnail_path: Optional[str] = None
    files: List[PostFileOut] = []

    class Config:
        orm_mode = True

        
