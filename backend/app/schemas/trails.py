from pydantic import BaseModel, ConfigDict
from typing import Optional
from decimal import Decimal

class TrailOut(BaseModel):
    trail_id: int
    cos_kor_nm: str
    detail_cos_no: Optional[int]
    forward_tm: Optional[str]
    leng: Optional[Decimal]
    shape_leng: Optional[Decimal]
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]
    difficulty: Optional[str]
    park_no_id: Optional[int]

    model_config = ConfigDict(from_attributes=True)
