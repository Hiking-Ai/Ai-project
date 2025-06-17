from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Favorite(Base):
    __tablename__ = "favorite"

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    post_id = Column(Integer, ForeignKey("post.post_id", ondelete="CASCADE" ), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favorites")
    post = relationship("Post", back_populates="favorites")