from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PostWithCategoriesOut(BaseModel):
    post_id: int
    title: str
    content: str
    level: str | None
    purpose: str | None
    path_type: str | None

    model_config = ConfigDict(from_attributes=True)

class PostWithAuthorOut(BaseModel):
    post_id: int
    nickname: str
    title: str
    content: str
    create_at: datetime
    update_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PostCategoryOut(BaseModel):
    post_id: int
    title: str
    post_created: datetime
    category_id: int
    category_name: str

    class Config:
        orm_mode = True