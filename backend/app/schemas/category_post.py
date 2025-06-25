# app/schemas/category_post.py

from pydantic import BaseModel

class CategoryPostIn(BaseModel):
    category_id: int
    post_id: int
