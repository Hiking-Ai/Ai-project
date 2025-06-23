from sqlalchemy import Column, Integer, String, Float, CHAR, UniqueConstraint,DECIMAL
from app.db.base import Base  

class Park(Base):
    __tablename__ = "park"

    objt_id = Column(Integer, primary_key=True, index=True, comment="객체ID")
    nrprk_cd = Column(Integer, nullable=False, comment="공원ID")
    park_name = Column(String(100), nullable=False, comment="공원명")
    cos_kor_nm = Column(String(100), nullable=False, comment="코스명")
    detail_cos = Column(String(100), nullable=False, comment="코스정보")
    cos_schdul = Column(String(50), nullable=True, comment="코스 일정")
    forward_tm = Column(String(100), nullable=True, comment="예상 소요 시간")
    leng = Column(DECIMAL(4, 1), nullable=True, comment="코스길이(km)")
    difficulty = Column(CHAR(1), nullable=True, comment="난이도")
    mng_tel = Column(String(100), nullable=True, comment="관리 전화번호")
    shape_leng = Column(DECIMAL(14, 9), nullable=True, comment="GIS 기반 경로 지오메트리의 실측 거리")
    x = Column(DECIMAL(14, 4), comment="X 좌표")
    y = Column(DECIMAL(13, 5), comment="Y 좌표")
    latitude = Column(DECIMAL(10, 7), nullable=True, comment="위도")
    longitude = Column(DECIMAL(10, 7), nullable=True, comment="경도")
    detail_cos_no = Column(Integer, nullable=False, comment="공원별 코스 번호")

    __table_args__ = (
        UniqueConstraint("nrprk_cd", "detail_cos_no", name="uq_cos_per_park"),  # 같은 공원 내 코스 번호 중복 방지
    )
