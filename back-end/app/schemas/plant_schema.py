"""
Plant schemas for request/response validation
"""


from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.plant_species_schema import PlantSpeciesResponse

class PlantBase(BaseModel):
    """
    Base plant schema with common attributes
    """
    species_id: int 
    plant_name: str = Field(..., max_length=100)  # From AI, editable by user
    location: Optional[str] = Field(None, max_length=255)
    last_watered: Optional[datetime] = None
    image_url: Optional[str] = None
    acquired_date: Optional[datetime] = None  # When they got the plant

class PlantCreate(PlantBase):
    pass

class PlantUpdate(BaseModel):
    """
    Schema for updating plant information
    """

    species_id: Optional[int] = None
    plant_name: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    last_watered: Optional[datetime] = None
    image_url: Optional[str] = None
    acquired_date: Optional[datetime] = None

class PlantResponse(BaseModel):
    """
    Schema for plant response
    """
    id: int
    user_id: int
    species_id: int 
    plant_name: str = Field(..., max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    last_watered: Optional[datetime] = None
    acquired_date: Optional[datetime] = None
    image_url: Optional[str] = None
    species: Optional[PlantSpeciesResponse] = None
    model_config = ConfigDict(from_attributes=True)
