from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from app.db.base import Base

class Prediction_Data(Base):
    __tablename__ = "prediction_data"

    park_id = Column(Integer, ForeignKey("park.park_id"), primary_key=True, nullable=False, comment="공원 ID")
    prediction_time = Column(DateTime, primary_key=True, nullable=False, comment="예측 시간")
    prediction_temperature = Column(Float, nullable=False, comment="예측 온도 (℃)")
