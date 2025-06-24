# app/schemas/prediction.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PredictionOut(BaseModel):
    park_id: int
    prediction_time: datetime
    prediction_temperature: float

    model_config = ConfigDict(from_attributes=True)
