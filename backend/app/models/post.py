from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Post(Base):
    __tablename__ = "board_post"

    post_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    create_at = Column(DateTime, default=datetime.utcnow)
    update_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    thumbnail_path = Column(String(255))
    view_count = Column(Integer, default=0)

    # 사용자와의 관계설정
    author = relationship("User", back_populates="posts")
    files = relationship("PostFile", back_populates="post", cascade="all, delete-orphan")

class PostFile(Base):
    __tablename__ = "post_files"
    
    file_id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("board_post.post_id"))
    original_file_name = Column(String(255))
    stored_path = Column(String(255))
    file_type = Column(String(50), nullable=True)

    post = relationship("Post", back_populates="files")
