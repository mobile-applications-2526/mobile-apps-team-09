"""
Diagnosis schemas for request/response validation
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class DiagnosisBase(BaseModel):
    """
    Base diagnosis schema with common attributes
    
    Note: 
    - issue_detected can be "Healthy" or "No Issues Detected" for healthy plants
    - confidence_score represents AI's confidence (0.0-1.0) that the diagnosis is correct
    - severity can be "No Issues", "Low Severity", "Medium Severity", "High Severity"
    """

    plant_id: int
    issue_detected: str = Field(..., max_length=255)
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    severity: str = Field(..., max_length=50)
    recommendation: Optional[str] = None
    image_url: Optional[str] = None
    recovery_watering: Optional[str] = Field(None, max_length=255)
    recovery_sunlight: Optional[str] = Field(None, max_length=255)
    recovery_air_circulation: Optional[str] = Field(None, max_length=255)
    recovery_temperature: Optional[str] = Field(None, max_length=255)


class DiagnosisCreate(DiagnosisBase):
    """
    Schema for creating a new diagnosis
    """

    pass


class DiagnosisUpdate(BaseModel):
    """
    Schema for updating diagnosis information
    """

    issue_detected: Optional[str] = Field(None, max_length=255)
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    severity: Optional[str] = Field(None, max_length=50)
    recommendation: Optional[str] = None
    image_url: Optional[str] = None
    recovery_watering: Optional[str] = Field(None, max_length=255)
    recovery_sunlight: Optional[str] = Field(None, max_length=255)
    recovery_air_circulation: Optional[str] = Field(None, max_length=255)
    recovery_temperature: Optional[str] = Field(None, max_length=255)


class DiagnosisResponse(BaseModel):
    """
    Schema for diagnosis response
    """

    id: int
    plant_id: int
    created_at: datetime
    issue_detected: str = Field(..., max_length=255)
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    severity: str = Field(..., max_length=50)
    recommendation: Optional[str] = None
    image_url: Optional[str] = None
    recovery_watering: Optional[str] = Field(None, max_length=255)
    recovery_sunlight: Optional[str] = Field(None, max_length=255)
    recovery_air_circulation: Optional[str] = Field(None, max_length=255)
    recovery_temperature: Optional[str] = Field(None, max_length=255)

    model_config = ConfigDict(from_attributes=True)
