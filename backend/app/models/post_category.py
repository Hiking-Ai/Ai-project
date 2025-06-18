# app/models/post_category.py
from sqlalchemy import Column, Integer, ForeignKey
from app.db.base import Base
from sqlalchemy.orm import relationship

class PostCategory(Base):
    __tablename__ = "post_category"

    post_id = Column(Integer, ForeignKey("post.post_id"), primary_key=True)
    subcategory_id = Column(Integer, ForeignKey("subcategory.subcategory_id"), primary_key=True)

    post = relationship("Post", back_populates="post_category")
    subcategory = relationship("SubCategory", back_populates="posts")