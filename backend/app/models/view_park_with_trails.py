from sqlalchemy import Column, Integer, String, DECIMAL
from app.db.base import Base

class ViewParkWithTrails(Base):
    __tablename__ = "view_park_with_trails"
    __table_args__ = {"extend_existing": True}  # 이미 DB에 존재하는 뷰 연결 시 필요

    trail_id = Column(Integer, primary_key=True)
    cos_kor_nm = Column(String(100))
    detail_cos_no = Column(Integer)
    forward_tm = Column(String(100))
    leng = Column(DECIMAL(3, 1))
    shape_leng = Column(DECIMAL(3, 1))
    latitude = Column(DECIMAL(9, 7))
    longitude = Column(DECIMAL(10, 7))
    difficulty = Column(String(1))
    park_no_id = Column(Integer)
    park_id = Column(Integer)
    park_name = Column(String(100))
    mng_tel = Column(String(100))
