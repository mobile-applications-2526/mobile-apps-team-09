"""
Plant species database model
"""
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.database import Base

class PlantSpecies(Base):
    __tablename__ = "plant_species"

    id = Column(Integer, primary_key=True, index=True)

    common_name = Column(String(100), nullable=False, unique=True, index=True)
    scientific_name = Column(String(150), nullable=True, unique=True)

    # care metadata
    watering_frequency_days = Column(Integer, nullable=True)   # e.g. water every N days
    sunlight_hours_needed   = Column(Float,   nullable=True)   # hours/day
    sunlight_type           = Column(String(50),  nullable=True)  # e.g. "full sun", "partial shade"
    humidity_preference     = Column(String(50),  nullable=True)  # e.g. "low/medium/high"
    temperature_min         = Column(Float,   nullable=True)   # °C minimum
    care_difficulty         = Column(String(50),  nullable=True)  # e.g. "easy/medium/hard"

    # backref from Plant
    plants = relationship("Plant", back_populates="species", cascade="all",)
