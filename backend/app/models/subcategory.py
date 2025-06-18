from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class SubCategory(Base):
    __tablename__ = "subcategory"

    subcategory_id = Column(Integer, primary_key=True, index=True)
    subcategory_name = Column(String(100), unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey("category.category_id"), nullable=False)

    category = relationship("Category", back_populates="subcategories")
    posts = relationship("PostCategory", back_populates="subcategory")