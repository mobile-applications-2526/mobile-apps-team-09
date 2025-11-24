"""
Profile schemas for request/response validation
"""

from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ProfileBase(BaseModel):
    """
    Base profile schema with common attributes
    """

    tagline: Optional[str] = Field(None, max_length=255)
    age: Optional[int] = Field(None, ge=0, le=150)
    living_situation: Optional[str] = Field(None, max_length=255)
    experience_level: Optional[str] = Field(None, max_length=100)
    experience_start_date: Optional[date] = Field(None, description="Date when user started their plant journey")
    city: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)


class ProfileCreate(ProfileBase):
    """
    Schema for creating a new profile
    """

    user_id: int


class ProfileUpdate(BaseModel):
    """
    Schema for updating profile information
    """

    tagline: Optional[str] = Field(None, max_length=255)
    age: Optional[int] = Field(None, ge=0, le=150)
    living_situation: Optional[str] = Field(None, max_length=255)
    experience_level: Optional[str] = Field(None, max_length=100)
    experience_start_date: Optional[date] = Field(None, description="Date when user started their plant journey")
    city: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)


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
    experience_start_date: Optional[date] = None
    living_situation: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    plant_count: int = 0
    care_rate: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
