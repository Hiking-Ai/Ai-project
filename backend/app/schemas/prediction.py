from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PredictionOut(BaseModel):
    prediction_time: datetime
    prediction_temperature: float
    nrprk_cd: int

    model_config = ConfigDict(from_attributes=True)