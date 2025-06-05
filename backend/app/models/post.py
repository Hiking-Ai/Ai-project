from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Post(Base):
    __tablename__ = "board_posts"

    post_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    user_email = Column(String(100), ForeignKey("users.user_email"), nullable=False)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # ✅ 관계 설정 (Post → PostFile)
    files = relationship("PostFile", back_populates="post", cascade="all, delete-orphan")


class PostFile(Base):
    __tablename__ = "board_files"

    file_id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("board_posts.post_id"), nullable=False)
    original_file_name = Column(String(255), nullable=False)
    stored_path = Column(String(500), nullable=False)
    file_type = Column(String(50))
    update_at = Column(DateTime, default=datetime.utcnow)

    # ✅ 관계 설정 (PostFile → Post)
    post = relationship("Post", back_populates="files")
