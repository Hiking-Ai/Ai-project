from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from datetime import datetime
from app.db.base import Base
from sqlalchemy.orm import relationship
import enum
from app.models.user_profile import UserProfile

class UserRole(enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    nickname = Column(String(50), unique=True, nullable=True)
    user_name = Column(String(50), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    create_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    signup_token = relationship("SignupToken", back_populates="user", uselist=False)
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(email={self.user_email}, nickname={self.nickname})>"