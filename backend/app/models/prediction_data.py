from sqlalchemy import Column, Integer, Float, DateTime, Numeric
from app.db.base import Base

class Prediction_Data(Base):
    __tablename__ = "prediction_data"

    aws_id = Column(Integer, primary_key=True,  comment="관측소 ID (AWS)")
    prediction_time = Column(DateTime,  nullable=False, comment="예측 시간")
    prediction_temperature = Column(Float, nullable=False, comment="예측 온도 (℃)")
    latitude = Column(Numeric(9, 7), nullable=False, comment="위도")
    longitude = Column(Numeric(10, 7), nullable=False, comment="경도")
