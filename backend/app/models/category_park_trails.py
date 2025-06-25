from sqlalchemy import Column, BigInteger, Integer, ForeignKey
from app.db.base import Base

class CategoryParkTrails(Base):
    __tablename__ = "category_park_trails"

    category_id = Column(BigInteger, ForeignKey("categories.category_id"), primary_key=True)
    park_id = Column(Integer, primary_key=True)
    trail_id = Column(Integer, primary_key=True)
