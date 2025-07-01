from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserProfileBase(BaseModel):
    user_level: Optional[str]
    pref_region: Optional[str]
    purpose: Optional[str]
    interests: Optional[str]
    age: Optional[int]
    gender: Optional[str]

class UserProfileUpdate(UserProfileBase):
    user_level: Optional[str] = None
    pref_region: Optional[str] = None
    purpose: Optional[str] = None
    interests: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None

    current_password: Optional[str] = None
    new_password: Optional[str] = None
    new_password_confirm: Optional[str] = None

    model_config = ConfigDict(extra="ignore")

class UserProfileResponse(BaseModel):
    user_id: int
    user_level: str
    model_config = ConfigDict(from_attributes=True)

   
