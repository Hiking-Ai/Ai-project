from sqlalchemy import Column,Integer,Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    comment_text = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    post_id = Column(Integer, ForeignKey("post.post_id", ondelete="CASCADE"), nullable=False)
    create_at = Column(DateTime, default=datetime.utcnow)
    update_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


    # 관게설정
    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
