# app/api/park.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.park import Park
from app.models.trails import Trail
from app.models.park_trails import ParkTrail
from app.models.prediction_data import Prediction_Data
from app.schemas.trails import TrailOut
from app.schemas.prediction import PredictionOut


router = APIRouter()

# 탐방로 추천 API
# 사용자가 지역, 난이도, 경로유형, 목적 등을 선택해서 맞춤형 탐방로를 추천받을 수 있습니다.
@router.post("/parks/trails/recommend", response_model=List[TrailOut])
def recommend_trails(
    region: Optional[str] = None,           # 지역명 (ex: '설악', '북한산')
    difficulty: Optional[str] = None,       # 난이도 (상: 'A', 중: 'B', 하: 'C')
    route_type: Optional[str] = None,       # 코스 정보 필터링용 문자열 (ex: '순환', '왕복')
    purpose: Optional[str] = None,          # 코스명 목적 (ex: '가족', '힐링', '도전')
    db: Session = Depends(get_db)
):
    # Trail 모델에서 탐방로 기준으로 필터링 시작
    query = db.query(Trail)

    # 🔍 지역 필터링 (공원 이름에 region이 포함되는 탐방로만 찾음)
    if region and region != "무관":
        query = query.join(ParkTrail).join(Park).filter(Park.park_name.contains(region))

    # 🔍 난이도 필터링 (A/B/C)
    if difficulty:
        query = query.filter(Trail.difficulty == difficulty)

    # 🔍 경로 유형: 코스명 또는 소요 시간에서 검색
    if route_type:
        query = query.filter(Trail.forward_tm.contains(route_type))

    # 🔍 목적 필터링 (ex: cos_kor_nm 이 '힐링코스' 포함)
    if purpose:
        query = query.filter(Trail.cos_kor_nm.contains(purpose))

    # 🔚 모든 필터 조건을 만족하는 탐방로 리스트 반환
    return query.all()



