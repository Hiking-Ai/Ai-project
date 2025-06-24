from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class ParkTrail(Base):
    __tablename__ = "park_trails"

    park_id = Column(Integer, ForeignKey("park.park_id"), primary_key=True, comment="공원 ID")
    trail_id = Column(Integer, ForeignKey("trails.trail_id"), primary_key=True, comment="탐방로 ID")

    park = relationship("Park", back_populates="trails")
    trail = relationship("Trail", back_populates="parks")
