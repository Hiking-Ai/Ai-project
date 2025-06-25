from sqlalchemy import Column, BigInteger, Integer, ForeignKey
from app.db.base import Base
from sqlalchemy.orm import relationship

class CategoryPost(Base):
    __tablename__ = "category_post"

    category_id = Column(BigInteger, ForeignKey("categories.category_id"), primary_key=True)
    post_id = Column(Integer, ForeignKey("post.post_id"), primary_key=True)

    post = relationship("Post", back_populates="categories")