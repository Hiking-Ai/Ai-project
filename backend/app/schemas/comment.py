from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CommentCreate(BaseModel):
    comment_text: str

class CommentOut(BaseModel):
    comment_id: int
    comment_text: str
    create_at: datetime
    user_id: int
    post_id: int

    model_config = ConfigDict(from_attributes=True)