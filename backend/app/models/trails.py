from sqlalchemy import Column, Integer, String, DECIMAL, CHAR
from sqlalchemy.orm import relationship
from app.db.base import Base

class Trail(Base):
    __tablename__ = "trails"

    trail_id = Column(Integer, primary_key=True, index=True, autoincrement=True, comment="탐방로 ID")
    cos_kor_nm = Column(String(100), nullable=False, comment="코스명")
    detail_cos_no = Column(Integer, comment="코스 상세 번호")  # ✅ int로 수정됨
    forward_tm = Column(String(100), comment="예상 소요 시간")
    leng = Column(DECIMAL(3, 1), comment="코스 길이 (km)")
    shape_leng = Column(DECIMAL(3, 1), comment="실측 거리 (m)")
    latitude = Column(DECIMAL(9, 7), comment="위도")
    longitude = Column(DECIMAL(10, 7), comment="경도")
    difficulty = Column(CHAR(1), comment="난이도 (A/B/C)")
    park_no_id = Column(Integer, comment="외부 공원 ID")  # ✅ 새 컬럼 추가됨

    parks = relationship("ParkTrail", back_populates="trail", cascade="all, delete-orphan")
