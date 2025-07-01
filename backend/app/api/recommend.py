
import numpy as np 
import pandas as pd
import geopandas as gpd
from fastapi import APIRouter, Depends

from typing import Optional
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter()

# 아직 미구현
@router.get("/recommend")
def get_recommendation(
    latitude: float,
    longitude: float,
    distance: str,
    duration: str,
    difficulty: str,
    db: Session = Depends(get_db)
):
    level_dict={"쉬움":"하","보통":"중","어려움":"상"}
    selected_level = level_dict[difficulty]
    result = db.execute(text(
        "SELECT cos_kor_nm as name,  forward_tm as duration ,latitude as lat, longitude as lon, difficulty  FROM hiking_ai.view_park_with_trails;"))
    df = pd.DataFrame(result.fetchall(), columns=result.keys())
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df["lon"], df["lat"]), crs="EPSG:4326")
    gdf_proj = gdf.to_crs(epsg=3857)
    gdf["x"] = gdf_proj.geometry.x
    gdf["y"] = gdf_proj.geometry.y

    target_df = pd.DataFrame({"lon": [longitude], "lat": latitude})
    
    target_gdf = gpd.GeoDataFrame(target_df, geometry=gpd.points_from_xy(target_df["lon"], target_df["lat"]), crs="EPSG:4326")
    target_proj = target_gdf.to_crs(epsg=3857)
    target_df["x"] = target_proj.geometry.x
    target_df["y"] = target_proj.geometry.y
    target_x = target_df.loc[0, "x"]
    target_y = target_df.loc[0, "y"]

    df["distance_m"] = np.sqrt((gdf["x"] - target_x) ** 2 + (gdf["y"] - target_y) ** 2)
    extract_df = df.copy()

    if "전체" in distance:
        extract_df = extract_df.copy()
    else:
        num_dist = int(distance.split("km")[0])*1000
        extract_df = extract_df[
            extract_df["distance_m"]<num_dist].reset_index(drop=True)

    if "전체" in duration:
        extract_df = extract_df.copy()
    else:
        num_duration = int(duration.split("시간")[0])
        
        extract_df = extract_df[
            (extract_df["duration"].str[:2].astype(int))<num_duration].reset_index(drop=True)
    extract_df = extract_df[extract_df["difficulty"]==selected_level].reset_index(drop=True)
        # extract_df = extract_df[
        #     extract_df["duration"]<num_duration]
    # print(extract_df)
    print(longitude, latitude, distance, duration, difficulty)
    return extract_df.to_dict(orient="records")
