from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional

class User(BaseModel):
    user_id: Optional[int] 
    user_email: Optional[str] 
    password: Optional[str] 
    nickname: Optional[str] 
    user_name: Optional[int] 
    role: Optional[str] 
    level: Optional[str] 

class UserSignup(BaseModel):
    user_email:EmailStr
    password:str = Field(min_length=6)
    password_confirm: str = Field(min_length=6) # db에 없어도 되는 비밀번호 확인용
    nickname:str
    user_name:str
    level:str

class UserLogin(BaseModel):
    user_email:EmailStr
    password:str

class EmailRequest(BaseModel):
    email:EmailStr

class PasswordResetRequest(BaseModel):
    email:EmailStr

class PasswordCodeVerity(BaseModel):
    email:EmailStr
    code:str

class PasswordRest(BaseModel):
    emil:EmailStr
    new_password:str

class PasswordResetCodeVerify(BaseModel):
    email:EmailStr
    code:str


class UserUpdate(User):
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    password: Optional[str] = None
    nickname: Optional[str] = None
    user_name: Optional[int] = None
    role: Optional[str] = "USER"
    level: Optional[str] = None

    current_password: Optional[str] = None
    new_password: Optional[str] = None
    new_password_confirm: Optional[str] = None

    model_config = ConfigDict(extra="ignore")

class UserResponse(BaseModel):
    level: str
    model_config = ConfigDict(from_attributes=True)

