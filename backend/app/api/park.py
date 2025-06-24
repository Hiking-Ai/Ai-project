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
from geopy.distance import geodesic
import pandas as pd
import numpy as np
import geopandas as gpd
from shapely.geometry import Point

router = APIRouter()

# 탐방로 추천 API
# 사용자가 지역, 난이도, 경로유형, 목적 등을 선택해서 맞춤형 탐방로를 추천받을 수 있습니다.
@router.post("/trails/recommend", response_model=List[TrailOut])
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



# ✅ IDW 기반 보간 온도 예측 API (기존 유지)
@router.post("/parks/interpolate-temperature")
def interpolate_temperature(
    lat: List[float] = Query(..., description="보간할 위도 리스트"),
    lon: List[float] = Query(..., description="보간할 경도 리스트"),
    db: Session = Depends(get_db)
):
    if len(lat) != len(lon):
        raise HTTPException(status_code=400, detail="위도와 경도의 개수가 일치하지 않습니다.")

    # 1. 예측 데이터 조회
    records = db.query(Prediction_Data).all()
    if not records:
        raise HTTPException(status_code=404, detail="예측 데이터가 없습니다.")

    # 2. DataFrame 구성
    df = pd.DataFrame([
        {"lon": r.longitude, "lat": r.latitude, "value": r.prediction_temperature}
        for r in records if hasattr(r, "longitude") and r.longitude is not None and r.latitude is not None
    ])

    if df.empty:
        raise HTTPException(status_code=400, detail="좌표값이 없는 예측 데이터입니다.")

    # 3. Geo 변환
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df["lon"], df["lat"]), crs="EPSG:4326")
    gdf_proj = gdf.to_crs(epsg=3857)
    gdf["x"] = gdf_proj.geometry.x
    gdf["y"] = gdf_proj.geometry.y

    # 4. 대상 지점 변환
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

    coords = gdf[["x", "y"]].values
    values = gdf["value"].values
    interpolated_values = []

    for x, y in zip(target_df["x"], target_df["y"]):
        val = idw_interpolation(x, y, coords, values)
        interpolated_values.append(val)

    return [
        {"lat": lat[i], "lon": lon[i], "temperature": interpolated_values[i]}
        for i in range(len(lat))
    ]
