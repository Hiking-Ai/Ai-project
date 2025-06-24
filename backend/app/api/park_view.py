from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.park_with_trails import ParkWithTrail
from app.schemas.park_with_trails import ParkWithTrailOut

router = APIRouter()

# ✅ park_with_trails 뷰 조회 API
@router.get("/parks/view", response_model=List[ParkWithTrailOut])
def get_park_with_trails(
    park_no_id: int = Query(..., description="외부 공원 ID"),
    detail_cos_no: int = Query(..., description="코스 상세 번호"),
    db: Session = Depends(get_db)
):
    return db.query(ParkWithTrail).filter(
        ParkWithTrail.park_no_id == park_no_id,
        ParkWithTrail.detail_cos_no == detail_cos_no
    ).all()
