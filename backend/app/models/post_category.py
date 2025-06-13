# app/models/post_category.py
from sqlalchemy import Column, Integer, ForeignKey
from app.db.base import Base
from sqlalchemy.orm import relationship

class PostCategory(Base):
    __tablename__ = "post_category"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("post.post_id"))
    category_id = Column(Integer, ForeignKey("category.category_id"))

    post = relationship("Post", back_populates="post_categories")
    category = relationship("Category", back_populates="post_categories")