"""
Profile schemas for request/response validation
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ProfileBase(BaseModel):
    """
    Base profile schema with common attributes
    """

    full_name: Optional[str] = Field(None, max_length=255)
    tagline: Optional[str] = Field(None, max_length=255)
    age: Optional[int] = Field(None, ge=0, le=150)
    living_situation: Optional[str] = Field(None, max_length=255)
    experience_level: Optional[str] = Field(None, max_length=100)
    experience_years: Optional[int] = Field(None, ge=0, le=100)


class ProfileCreate(ProfileBase):
    """
    Schema for creating a new profile
    """

    user_id: int


class ProfileUpdate(BaseModel):
    """
    Schema for updating profile information
    """

    full_name: Optional[str] = Field(None, max_length=255)
    tagline: Optional[str] = Field(None, max_length=255)
    age: Optional[int] = Field(None, ge=0, le=150)
    living_situation: Optional[str] = Field(None, max_length=255)
    experience_level: Optional[str] = Field(None, max_length=100)
    experience_years: Optional[int] = Field(None, ge=0, le=100)


class ProfileResponse(BaseModel):
    """
    Schema for profile response
    """

    id: int
    user_id: int
    full_name: Optional[str] = None
    tagline: Optional[str] = None
    age: Optional[int] = None
    experience_level: Optional[str] = None
    experience_years: Optional[int] = None
    living_situation: Optional[str] = None
    plant_count: int = 0
    care_rate: int = 0  # Calculated field: percentage of plants watered on time
    care_streak: int = 0  # Calculated field: consecutive days of care (requires watering history)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
