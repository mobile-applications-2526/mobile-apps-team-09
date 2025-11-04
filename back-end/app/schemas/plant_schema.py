"""
Plant schemas for request/response validation
"""


from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class PlantBase(BaseModel):
    """
    Base plant schema with common attributes
    """

    plant_name: str = Field(..., max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    last_watered: Optional[datetime] = None
    image_url: Optional[str] = None  # make this AnyUrl if you want strict URLs

class PlantCreate(PlantBase):
    pass

class PlantUpdate(BaseModel):
    """
    Schema for updating plant information
    """


    plant_name: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    last_watered: Optional[datetime] = None
    image_url: Optional[str] = None

class PlantResponse(PlantBase):
    """
    Schema for plant response
    """

    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)
