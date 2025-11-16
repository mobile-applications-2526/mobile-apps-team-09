"""
Diagnosis database model
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class Diagnosis(Base):
    """
    Diagnosis model representing plant disease diagnoses
    """

    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(
        Integer, 
        ForeignKey("plants.id", ondelete="CASCADE"), 
        nullable=False, 
        index=True
    )
    issue_detected = Column(String(255), nullable=False)
    confidence_score = Column(Float, nullable=False)
    severity = Column(String(50), nullable=False)
    recommendation = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    
    # Recovery care tips
    recovery_watering = Column(String(255), nullable=True)
    recovery_sunlight = Column(String(255), nullable=True)
    recovery_air_circulation = Column(String(255), nullable=True)
    recovery_temperature = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship to Plant
    plant = relationship("Plant", back_populates="diagnoses", lazy="joined")
