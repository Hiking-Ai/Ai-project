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

import geopandas as gpd
import datetime, requests, os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from sqlalchemy import text
from app.db.session import get_db
from sqlalchemy.orm import Session
from shapely.geometry import Point
# IDW 보간 함수
def idw_interpolation(x, y, coords, values, power=2):
    distances = np.sqrt((coords[:, 0] - x)**2 + (coords[:, 1] - y)**2)
    if np.any(distances == 0):
        return values[distances == 0][0]
    weights = 1 / distances**power
    return np.sum(weights * values) / np.sum(weights)

load_dotenv()
key = os.getenv("KMA_API_KEY")
@router.get("/weather")
def get_weather_trails(db: Session = Depends(get_db)):        
    BASE_URL = "https://apihub.kma.go.kr/api/typ01/url"
    SUB_URL = "kma_sfctm3.php"
    SUB_LOCATION_URL = "stn_inf.php"
    
    st_dt = datetime.datetime.now() - pd.to_timedelta(1, unit="hour")
    st_dt = pd.to_datetime(st_dt).strftime("%Y%m%d%H%M")
    ed_dt = pd.to_datetime(datetime.datetime.now()).strftime("%Y%m%d%H%M")
    url = f"{BASE_URL}/{SUB_URL}?tm1={st_dt}&tm2={ed_dt}&help=1&authKey={key}"
    location_url = f"{BASE_URL}/{SUB_LOCATION_URL}?inf=SFC&stn=&tm={ed_dt}&help=0&authKey={key}"
    res = requests.get(location_url)
    source = res.text.split("\n")
    source = [line.split() for line in source]

    location_df=pd.DataFrame(source[3:-2])
    location_df.columns = source[1][1:]+['']
    location_df = location_df.iloc[:,:3]
    location_df = location_df.groupby('STN', as_index=False).last().reset_index(drop=True)
    res = requests.get(url)
    source = res.text.split("\n")

    _source = list()
    for line in source:
        _source.append(line.split())

    hour_df=pd.DataFrame(_source[54:-2],columns=[i[2] for i in _source[4:50]])
    hour_df=hour_df[["STN","TM","TA","PR","HM","WS","WD"]].copy()
    hour_df["STN"] = hour_df["STN"].astype(int)
    hour_df["TM"] = pd.to_datetime(hour_df["TM"]).dt.strftime("%Y-%m-%d %H:%M:%S")
    hour_df["TA"] = hour_df["TA"].astype(float)
    hour_df["PR"] = hour_df["PR"].astype(float)
    hour_df["HM"] = hour_df["HM"].astype(float)
    hour_df["WS"] = hour_df["WS"].astype(float)
    hour_df["WD"] = hour_df["WD"].astype(int)
    location_df["STN"] = location_df["STN"].astype(int)
    location_df["LON"] = location_df["LON"].astype(float)
    location_df["LAT"] = location_df["LAT"].astype(float)
    merged_df = pd.merge(location_df, hour_df, on='STN')
    merged_df = merged_df.dropna()

    gdf = gpd.GeoDataFrame(merged_df, geometry=gpd.points_from_xy(merged_df['LON'], merged_df['LAT']), crs='EPSG:4326')
    gdf_proj = gdf.to_crs(epsg=3857)

    gdf["x"] = gdf_proj.geometry.x
    gdf["y"] = gdf_proj.geometry.y

    result = db.execute(text("SELECT * FROM hiking_ai.view_park_with_trails;"))
    trail_df = pd.DataFrame(result)
    trail_df["LON"] = trail_df["longitude"].astype(float)
    trail_df["LAT"] = trail_df["latitude"].astype(float)
    trail_df = trail_df.drop(columns=["longitude", "latitude"], errors='ignore')
    target_gdf = gpd.GeoDataFrame(
        trail_df, geometry=gpd.points_from_xy(
            trail_df['LON'], trail_df['LAT']), crs='EPSG:4326')
    target_gdf_proj = target_gdf.to_crs(epsg=3857)
    
    trail_df["x"] = target_gdf_proj.geometry.x
    trail_df["y"] = target_gdf_proj.geometry.y
    coords = gdf[["x", "y"]].values
    for col in ["TA","PR","HM","WS"]:
        values = gdf[col].values
        interpolated_values = []
        for x, y in zip(trail_df["x"], trail_df["y"]):
            val = idw_interpolation(x, y, coords, values)
            interpolated_values.append(val)

        trail_df.loc[:,col] = interpolated_values
    result = trail_df.copy()
    result = result.replace({np.nan: None})
    return result.to_dict(orient="records")
