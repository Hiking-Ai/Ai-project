from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.prediction_data import Prediction_Data
from app.schemas.prediction import PredictionOut
from geopy.distance import geodesic
import pandas as pd
import numpy as np
import geopandas as gpd
from shapely.geometry import Point

router = APIRouter()

# 공원 예측 데이터 조회
@router.get("/parks/{park_id}/prediction", response_model=List[PredictionOut])
def get_park_predictions(park_id: int, db: Session = Depends(get_db)):
    predictions = (
        db.query(Prediction_Data)
        .filter(Prediction_Data.park_id == park_id)
        .order_by(Prediction_Data.prediction_time)
        .all()
    )

    if not predictions:
        raise HTTPException(status_code=404, detail="예측 데이터가 없습니다.")

    return predictions

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
        {"lon": float(r.longitude), "lat": float(r.latitude), "value": r.prediction_temperature}
        for r in records if r.longitude is not None and r.latitude is not None
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
