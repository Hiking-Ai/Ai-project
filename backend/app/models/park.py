from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class Park(Base):
    __tablename__ = "park"

    park_id = Column(Integer, primary_key=True, index=True, autoincrement=True, comment="공원 테이블의 고유 ID")
    park_no_id = Column(Integer, nullable=False, comment="외부 공원 ID")
    park_name = Column(String(100), nullable=False, comment="공원 이름")
    mng_tel = Column(String(100), nullable=True, comment="관리 전화번호")

    trails = relationship("ParkTrail", back_populates="park", cascade="all, delete-orphan")
