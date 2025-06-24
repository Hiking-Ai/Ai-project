from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.base import Base
from sqlalchemy.orm import relationship

class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    user_level = Column(String(50)) 
    pref_region = Column(String(100))
    purpose = Column(String(200))
    interests = Column(String(200))
    age = Column(Integer)
    gender = Column(String(10))

    user = relationship("User", back_populates="profile")