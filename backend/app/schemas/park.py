from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal

class ParkOut(BaseModel):
    objt_id: int
    nrprk_cd: int
    park_name: str
    cos_kor_nm: str
    detail_cos: str
    cos_schdul: Optional[str]
    forward_tm: Optional[str]
    leng: Optional[Decimal]
    difficulty: Optional[str]
    mng_tel: Optional[str]
    shape_leng: Optional[Decimal]
    x: Optional[Decimal]
    y: Optional[Decimal]
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]
    detail_cos_no: int

    model_config = ConfigDict(from_attributes=True)

class PredictionOut(BaseModel):
    nrprk_cd: int
    prediction_time: datetime
    prediction_temperature: float

    model_config = ConfigDict(from_attributes=True)