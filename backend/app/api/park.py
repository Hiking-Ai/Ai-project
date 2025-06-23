# app/api/park.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.park import Park
from app.schemas.park import ParkOut
from geopy.distance import geodesic
from app.models.prediction_data import Prediction_Data

router = APIRouter()

# ✅ 1. 지역 필터 (/api/parks?region=서울)
@router.get("/parks", response_model=List[ParkOut])
def get_parks(
    region: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Park)
    if region:
        query = query.filter(Park.park_name.contains(region))
    if difficulty:
        query = query.filter(Park.difficulty == difficulty)
    return query.all()


# ✅ 2. 반경 거리 기반 탐방로 필터 (/api/parks/nearby?lat=...&lng=...)
@router.get("/parks/nearby", response_model=List[ParkOut])
def get_parks_nearby(
    lat: float = Query(..., description="현재 위도"),
    lng: float = Query(..., description="현재 경도"),
    radius_km: float = 10.0,
    db: Session = Depends(get_db)
):
    all_parks = db.query(Park).all()
    result = []
    for park in all_parks:
        if park.latitude is None or park.longitude is None:
            continue
        distance = geodesic((lat, lng), (park.latitude, park.longitude)).km
        if distance <= radius_km:
            result.append(park)
    return result


# ✅ 3. 단일 탐방로 상세 조회 (/api/parks/{objt_id})
@router.get("/parks/{objt_id}", response_model=ParkOut)
def get_park_detail(objt_id: int, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.objt_id == objt_id).first()
    if not park:
        raise HTTPException(status_code=404, detail="탐방로를 찾을 수 없습니다")
    return park


# ✅ 4. GeoJSON 형태 반환 (/api/parks/map) -> 지도 렌더링을 위한 GeoJSON 형식 반환
@router.get("/parks/map")
def get_parks_geojson(db: Session = Depends(get_db)):
    parks = db.query(Park).all()
    features = []
    for park in parks:
        if park.latitude is None or park.longitude is None:
            continue
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [park.longitude, park.latitude]
            },
            "properties": {
                "objt_id": park.objt_id,
                "park_name": park.park_name,
                "cos_kor_nm": park.cos_kor_nm,
                "difficulty": park.difficulty
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }


