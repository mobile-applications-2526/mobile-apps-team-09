"""
Plant diagnosis endpoints using AI
"""

import base64
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.models.user import User
from app.core.dependencies import get_current_user, get_diagnosis_service
from app.services.diagnosis_ai_service import diagnosis_ai_service
from app.services.diagnosis_service import DiagnosisService
from app.services.storage_service import storage_service
from app.schemas.diagnosis_schema import DiagnosisCreate, DiagnosisResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["AI Plant Diagnosis"])


@router.post("/diagnose", response_model=DiagnosisResponse, status_code=status.HTTP_201_CREATED)
async def diagnose_plant(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    diagnosis_service: DiagnosisService = Depends(get_diagnosis_service),
):
    """
    Diagnose plant health from an image using AI and automatically save to database

    Steps:
    1. Upload image of plant (healthy or sick)
    2. AI (Claude) acts as plant doctor and diagnoses issues
    3. Save diagnosis to database (without plant_id for standalone diagnosis)
    4. Return saved diagnosis with ID

    Note: This endpoint automatically saves the diagnosis to the database
    The diagnosis is saved without a plant_id (standalone diagnosis)
    """
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    # Validate file type
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["jpg", "jpeg", "png", "webp"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PNG, JPEG, and WebP images are allowed."
        )

    # Upload image to Supabase Storage first
    image_url = await storage_service.upload_diagnosis_image(
        file_content=content,
        user_id=current_user.id,
        file_extension=file_extension
    )

    # Convert image to base64 for Claude AI
    image_base64 = base64.b64encode(content).decode('utf-8')

    # Get diagnosis from AI
    diagnosis_info = await diagnosis_ai_service.diagnose_plant(image_base64)

    # Create diagnosis data (with image_url from upload)
    diagnosis_data = DiagnosisCreate(
        plant_id=None,  # Standalone diagnosis (not tied to a plant)
        plant_common_name=diagnosis_info['plant_common_name'],
        issue_detected=diagnosis_info['issue_detected'],
        confidence_score=diagnosis_info['confidence_score'],
        severity=diagnosis_info['severity'],
        recommendation=diagnosis_info['recommendation'],
        recovery_watering=diagnosis_info['recovery_watering'],
        recovery_sunlight=diagnosis_info['recovery_sunlight'],
        recovery_air_circulation=diagnosis_info['recovery_air_circulation'],
        recovery_temperature=diagnosis_info['recovery_temperature'],
        image_url=image_url  # Saved image URL from Supabase
    )

    # Save diagnosis to database
    saved_diagnosis = await diagnosis_service.create_diagnosis_standalone(
        user_id=current_user.id,
        data=diagnosis_data
    )

    return saved_diagnosis
