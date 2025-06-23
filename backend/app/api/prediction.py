from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.prediction_data import Prediction_Data
from app.schemas.prediction import PredictionOut

router = APIRouter()

@router.get("/parks/{nrprk_cd}/prediction", response_model=List[PredictionOut])
def get_park_predictions(nrprk_cd: int, db: Session = Depends(get_db)):
    predictions = (
        db.query(Prediction_Data)
        .filter(Prediction_Data.nrprk_cd == nrprk_cd)
        .order_by(Prediction_Data.prediction_time)
        .all()
    )

    if not predictions:
        raise HTTPException(status_code=404, detail="예측 데이터가 없습니다.")

    return predictions