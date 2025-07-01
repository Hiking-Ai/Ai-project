# app/api/recommend.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.trails import Trail
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

# ✅ 요청 바디 스키마
class RecommendRequest(BaseModel):
    distance: Optional[str] = None
    duration: Optional[str] = None
    difficulty: Optional[str] = None

# ✅ 응답 스키마
class TrailResponse(BaseModel):
    trail_id: int
    cos_kor_nm: str
    forward_tm: Optional[str]
    leng: Optional[float]
    shape_leng: Optional[float]
    latitude: float
    longitude: float
    difficulty: Optional[str]

    class Config:
        orm_mode = True

# ✅ 추천 API 라우터
@router.post("/recommend", response_model=List[TrailResponse])
def recommend_trails(
    req: RecommendRequest,
    db: Session = Depends(get_db)
):
    query = db.query(Trail)

    # 거리 필터
    if req.distance == "2km 이내":
        query = query.filter(Trail.leng <= 2)
    elif req.distance == "5km 이내":
        query = query.filter(Trail.leng <= 5)
    elif req.distance == "10km 이상":
        query = query.filter(Trail.leng >= 10)

    # 소요 시간 필터 (forward_tm은 문자열이라 간단한 조건만 적용)
    if req.duration == "1시간 이내":
        query = query.filter(Trail.forward_tm.like("%30%") | Trail.forward_tm.like("%1시간%"))
    elif req.duration == "2시간 이상":
        query = query.filter(Trail.forward_tm.like("%2시간%") | Trail.forward_tm.like("%3시간%") | Trail.forward_tm.like("%4시간%"))
    elif req.duration == "3시간 이상":
        query = query.filter(Trail.forward_tm.like("%3시간%") | Trail.forward_tm.like("%4시간%") | Trail.forward_tm.like("%5시간%"))

    # 난이도 필터 (A/B/C 매핑)
    difficulty_map = {
        "쉬움": "A",
        "보통": "B",
        "어려움": "C"
    }
    if req.difficulty in difficulty_map:
        query = query.filter(Trail.difficulty == difficulty_map[req.difficulty])

    return query.all()
