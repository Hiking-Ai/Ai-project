from sqlalchemy import Column, Integer, String
from app.db.base import Base

class User(Base):
    __tablename__ = "Users"

    user_id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    nickname = Column(String(50), unique=True, nullable=True)
    user_name = Column(String(50), nullable=False)
    age = Column(Integer, nullable=False, default=1)

    def __repr__(self):
        return f"<User(email={self.user_email}, nickname={self.nickname})>"