from pydantic import BaseModel, ConfigDict
from typing import Optional
from decimal import Decimal

class ParkWithTrailOut(BaseModel):
    trail_id: int
    cos_kor_nm: str
    detail_cos_no: Optional[int]
    forward_tm: Optional[str]
    leng: Optional[Decimal]
    shape_leng: Optional[Decimal]
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]
    difficulty: Optional[str]
    park_no_id: int
    park_id: int
    park_name: str
    mng_tel: Optional[str]

    model_config = ConfigDict(from_attributes=True)
