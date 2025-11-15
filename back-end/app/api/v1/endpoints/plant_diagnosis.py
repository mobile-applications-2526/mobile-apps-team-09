"""
Plant diagnosis endpoints using AI
"""

import base64
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models.user import User
from app.core.dependencies import get_current_user
from app.services.diagnosis_ai_service import diagnosis_ai_service
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["AI Plant Diagnosis"])


class PlantDiagnosisResponse(BaseModel):
    """Response model for plant diagnosis"""
    issue_detected: str           # e.g., "Leaf Spot Disease" or "No Issues Detected"
    confidence_score: float       # 0.0 to 1.0 (e.g., 0.87 = 87%)
    severity: str                 # "Healthy", "Low Severity", "Medium Severity", "High Severity"
    recommendation: str           # Full recommendation text
    recovery_watering: str        # Always provided (treatment or maintenance)
    recovery_sunlight: str        # Always provided (treatment or maintenance)
    recovery_air_circulation: str # Always provided (treatment or maintenance)
    recovery_temperature: str     # Always provided (treatment or maintenance)


@router.post("/diagnose", response_model=PlantDiagnosisResponse)
async def diagnose_plant(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Diagnose plant health from an image using AI
    
    Steps:
    1. Upload image of plant (healthy or sick)
    2. AI (Claude) acts as plant doctor and diagnoses issues
    3. Return complete diagnosis with recovery tips
    4. Frontend displays diagnosis page
    
    Note: This endpoint does NOT save to database
    Frontend will display results and user can choose to save if needed
    """
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Convert image to base64 for Claude
    image_base64 = base64.b64encode(content).decode('utf-8')
    
    # Get diagnosis from AI
    diagnosis_info = await diagnosis_ai_service.diagnose_plant(image_base64)
    
    return PlantDiagnosisResponse(
        issue_detected=diagnosis_info['issue_detected'],
        confidence_score=diagnosis_info['confidence_score'],
        severity=diagnosis_info['severity'],
        recommendation=diagnosis_info['recommendation'],
        recovery_watering=diagnosis_info['recovery_watering'],
        recovery_sunlight=diagnosis_info['recovery_sunlight'],
        recovery_air_circulation=diagnosis_info['recovery_air_circulation'],
        recovery_temperature=diagnosis_info['recovery_temperature']
    )
