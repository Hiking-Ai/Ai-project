from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ParkOut(BaseModel):
    objt_id: int
    nrprk_cd: int
    park_name: str
    cos_kor_nm: Optional[str]
    detail_cos: Optional[str]
    forward_tm: Optional[str]
    leng: Optional[float]
    difficulty: Optional[str]
    mng_tel: Optional[str]
    shape_leng: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]
    detail_cos_no: Optional[int]

    model_config = ConfigDict(from_attributes=True)

class PredictionOut(BaseModel):
    nrprk_cd: int
    prediction_time: datetime
    prediction_temperature: float

    model_config = ConfigDict(from_attributes=True)