# app/schemas/prediction.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionOut(BaseModel):
    aws_id: int
    prediction_time: datetime
    prediction_temperature: float
    latitude: float
    longitude: float

    class Config:
        orm_mode = True
