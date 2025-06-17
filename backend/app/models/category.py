# app/models/category.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(50), unique=True, nullable=False)
    parent_id = Column(Integer, ForeignKey("category.category_id"), nullable=True)

    post_categories = relationship("PostCategory", back_populates="category", cascade="all, delete-orphan")
    parent = relationship("Category", remote_side=[category_id], backref="subcategories")