from pydantic import BaseModel, EmailStr, Field

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