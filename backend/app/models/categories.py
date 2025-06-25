from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from app.db.base import Base

class Category(Base):
    __tablename__ = "categories"

    category_id = Column(BigInteger, primary_key=True, autoincrement=True, comment="카테고리 ID")
    name = Column(String(100), nullable=False, comment="카테고리 이름")
    parent_category_id = Column(BigInteger, ForeignKey("categories.category_id"), nullable=True, comment="상위 카테고리")
    display_order = Column(Integer, nullable=False, default=0, comment="표시 순서")
    is_last_level = Column(Boolean, nullable=False, default=False, comment="말단 여부")
