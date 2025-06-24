from pydantic import BaseModel, ConfigDict
from typing import Optional

class ParkOut(BaseModel):
    park_id: int
    park_no_id: int
    park_name: str
    mng_tel: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
