# app/models/signup_token.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from app.db.base import Base

class SignupToken(Base):
    __tablename__ = "signup_tokens"

    id = Column(Integer, primary_key=True)
    email = Column(String(100), unique=True, nullable=False)
    token = Column(String(10), nullable=False)
    is_verified = Column(Boolean, default=False)
    purpose = Column(String(20), default="signup")  # 이 토큰이 어떤 용도인지 식별하기 위해 사용
    create_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(minutes=10))

    user_id = Column(Integer, ForeignKey("users.user_id"))
    user = relationship("User", back_populates="signup_token")
