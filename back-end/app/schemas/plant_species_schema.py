"""
Plant species schemas for request/response validation
"""

from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class PlantSpeciesBase(BaseModel):
    """
    Base plant species schema with common attributes
    """

    common_name: str = Field(..., max_length=100)
    scientific_name: Optional[str] = Field(None, max_length=150)

    watering_frequency_days: Optional[int] = None
    sunlight_hours_needed:   Optional[float] = None
    sunlight_type:           Optional[str] = Field(None, max_length=50)
    humidity_preference:     Optional[str] = Field(None, max_length=50)
    temperature_min:         Optional[float] = None
    care_difficulty:         Optional[str] = Field(None, max_length=50)

class PlantSpeciesCreate(PlantSpeciesBase):
    pass

class PlantSpeciesUpdate(BaseModel):
    """
    Schema for updating plant species information
    """

    common_name: Optional[str] = Field(None, max_length=100)
    scientific_name: Optional[str] = Field(None, max_length=150)

    watering_frequency_days: Optional[int] = None
    sunlight_hours_needed:   Optional[float] = None
    sunlight_type:           Optional[str] = Field(None, max_length=50)
    humidity_preference:     Optional[str] = Field(None, max_length=50)
    temperature_min:         Optional[float] = None
    care_difficulty:         Optional[str] = Field(None, max_length=50)

class PlantSpeciesResponse(BaseModel):
    """
    Schema for plant species response
    """
    id: int
    scientific_name: Optional[str] = Field(None, max_length=150)
    common_name: str = Field(..., max_length=100)
    care_difficulty: Optional[str] = Field(None, max_length=50)
    watering_frequency_days: Optional[int] = None
    sunlight_hours_needed: Optional[float] = None
    sunlight_type: Optional[str] = Field(None, max_length=50)
    humidity_preference: Optional[str] = Field(None, max_length=50)
    temperature_min: Optional[float] = None
    model_config = ConfigDict(from_attributes=True)
