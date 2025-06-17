from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserProfileBase(BaseModel):
    level: Optional[str]
    pref_region: Optional[str]
    purpose: Optional[str]
    interests: Optional[str]
    age: Optional[int]
    gender: Optional[str]

class UserProfileUpdate(UserProfileBase):
    level: Optional[str] = None
    pref_region: Optional[str] = None
    purpose: Optional[str] = None
    interests: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None

    model_config = ConfigDict(extra="ignore")

class UserProfileResponse(UserProfileBase):
    user_id: int

    model_config = ConfigDict(from_attributes=True)

   
