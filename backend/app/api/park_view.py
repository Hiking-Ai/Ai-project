from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.view_park_with_trails import ViewParkWithTrails, ViewParkTrailCategory
from app.schemas.park_with_trails import ParkWithTrailOut, ParkTrailCategoryOut

router = APIRouter()

# ✅ 특정 탐방로 조회 뷰 기반 조회 API
# 특정 공원의 ID와 코스 상세 번호로 view에서 조회
@router.get("/parks/view", response_model=List[ParkWithTrailOut])
def get_park_with_trails(
    park_no_id: int = Query(..., description="외부 공원 ID"),
    detail_cos_no: int = Query(..., description="코스 상세 번호"),
    db: Session = Depends(get_db)
):
    return db.query(ViewParkWithTrails).filter(
        ViewParkWithTrails.park_no_id == park_no_id,
        ViewParkWithTrails.detail_cos_no == detail_cos_no
    ).all()

# ✅ 전체 공원-탐방로-카테고리 뷰 리스트 조회
@router.get("/view/park-trail-categories", response_model=List[ParkTrailCategoryOut])
def get_park_trail_categories(db: Session = Depends(get_db)):
    return db.query(ViewParkTrailCategory).all()