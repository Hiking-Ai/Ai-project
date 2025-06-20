from sqlalchemy import Column, Integer, String, Float, CHAR, UniqueConstraint
from app.db.base import Base  

class Park(Base):
    __tablename__ = "park"

    objt_id = Column(Integer, primary_key=True, index=True, comment="객체ID")
    nrprk_cd = Column(Integer, nullable=False, comment="공원ID")
    park_name = Column(String(100), nullable=False, comment="공원명")
    cos_kor_nm = Column(String(100), nullable=True, comment="코스명")
    detail_cos = Column(String(100), nullable=True, comment="코스정보")
    forward_tm = Column(String(100), nullable=True, comment="예상 소요 시간")
    leng = Column(Float, nullable=True, comment="코스길이(km)")
    difficulty = Column(CHAR(1), nullable=True, comment="난이도")
    mng_tel = Column(String(100), nullable=True, comment="관리 전화번호")
    shape_leng = Column(Float, nullable=True, comment="GIS 기반 경로 지오메트리의 실측 거리")
    latitude = Column(Float, nullable=True, comment="위도")
    longitude = Column(Float, nullable=True, comment="경도")
    detail_cos_no = Column(Integer, nullable=True, comment="공원별 코스 번호")

    __table_args__ = (
        UniqueConstraint("nrprk_cd", "detail_cos_no", name="uq_cos_per_park"),  # 같은 공원 내 코스 번호 중복 방지
    )
