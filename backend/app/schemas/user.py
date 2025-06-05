from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    user_email:EmailStr
    password:str
    nickname:str
    user_name:str
    age:int

class UserLogin(BaseModel):
    user_email:EmailStr
    password:str