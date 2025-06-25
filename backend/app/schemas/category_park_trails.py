# app/schemas/category_park_trails.py

from pydantic import BaseModel

class CategoryParkTrailIn(BaseModel):
    category_id: int
    park_id: int
    trail_id: int
