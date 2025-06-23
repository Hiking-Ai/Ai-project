# app/api/park.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import numpy as np
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
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

# IDW 보간 기반의 탐방로 온도 예측 API
@router.post("/parks/interpolate-temperature")
def interpolate_temperature(
    lat: List[float] = Query(..., description="보간할 위도 리스트"),
    lon: List[float] = Query(..., description="보간할 경도 리스트"),
    db: Session = Depends(get_db)
):
    # 위도/경도 길이 유효성 검사
    if len(lat) != len(lon):
        raise HTTPException(status_code=400, detail="위도와 경도의 개수가 일치하지 않습니다.")
    
    # 1. 예측 데이터 수집
    records = db.query(Prediction_Data).all()
    if not records:
        raise HTTPException(status_code=404, detail="예측 데이터가 없습니다.")

    # 2. DataFrame 생성
    df = pd.DataFrame([
        {"lon": r.longitude, "lat": r.latitude, "value": r.prediction_temperature}
        for r in records if r.longitude is not None and r.latitude is not None
    ])

    if df.empty:
        raise HTTPException(status_code=400, detail="좌표값이 없는 예측 데이터입니다.")

    # 3. GeoDataFrame 변환 및 좌표계 투영
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df["lon"], df["lat"]), crs="EPSG:4326")
    gdf_proj = gdf.to_crs(epsg=3857)
    gdf["x"] = gdf_proj.geometry.x
    gdf["y"] = gdf_proj.geometry.y

    # 4. 보간 대상 지점
    target_df = pd.DataFrame({"lon": lon, "lat": lat})
    target_gdf = gpd.GeoDataFrame(target_df, geometry=gpd.points_from_xy(target_df["lon"], target_df["lat"]), crs="EPSG:4326")
    target_proj = target_gdf.to_crs(epsg=3857)
    target_df["x"] = target_proj.geometry.x
    target_df["y"] = target_proj.geometry.y

    # 5. IDW 함수
    def idw_interpolation(x, y, coords, values, power=2):
        distances = np.sqrt((coords[:, 0] - x)**2 + (coords[:, 1] - y)**2)
        if np.any(distances == 0):
            return values[distances == 0][0]
        weights = 1 / distances**power
        return np.sum(weights * values) / np.sum(weights)

    # 6. 보간 수행
    coords = gdf[["x", "y"]].values
    values = gdf["value"].values
    interpolated_values = []

    for x, y in zip(target_df["x"], target_df["y"]):
        val = idw_interpolation(x, y, coords, values)
        interpolated_values.append(round(val, 2))   # 소수점 2자리로 제한

    return [
        {"lat": lat[i], "lon": lon[i], "temperature": interpolated_values[i]}
        for i in range(len(lat))
    ]