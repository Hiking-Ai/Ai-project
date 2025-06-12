from pydantic import BaseModel
from typing import Optional

class UserProfileCreate(BaseModel):
    health_stat: Optional[str]
    pref_region: Optional[str]
    purpose: Optional[str]
    interests: Optional[str]
    age: Optional[int]
    gender: Optional[str]

class UserProfileOut(UserProfileCreate):
    user_id: int