"""
Plant identification endpoints using AI
"""

import base64
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models.user import User
from app.core.dependencies import get_current_user, get_plant_species_service
from app.services.ai_service import ai_service
from app.services.plant_species_service import PlantSpeciesService
from app.schemas.plant_species_schema import PlantSpeciesCreate
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["AI Plant Identification"])


class PlantIdentificationResponse(BaseModel):
    """Response model for plant identification"""
    scientific_name: str     # Scientific name (e.g., "Spathiphyllum wallisii")
    common_name: str         # Common species name (e.g., "Peace Lily")
    species_id: int          # ID to use when creating plant


@router.post("/identify", response_model=PlantIdentificationResponse)
async def identify_plant(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    plant_species_service: PlantSpeciesService = Depends(get_plant_species_service),
):
    """
    Identify a plant from an image using AI
    
    Steps:
    1. Upload image
    2. AI (Claude) identifies plant species
    3. Check if species exists in database
    4. If not, create new species entry
    5. Return species info + species_id for creating plant
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
    
    # Convert image to base64 for Claude
    image_base64 = base64.b64encode(content).decode('utf-8')
    
    # Identify plant using AI (this can raise ValueError)
    try:
        plant_info = await ai_service.identify_plant(image_base64)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Check if species exists in database (by scientific name OR common name)
    existing_species = await plant_species_service.get_species_by_name(
        plant_info['scientific_name']
    )
    
    # If not found by scientific name, try by common name
    if not existing_species:
        existing_species = await plant_species_service.get_species_by_common_name(
            plant_info['common_name']
        )
    
    if existing_species:
        species_id = existing_species.id
    else:
        # Create new species entry with all AI-provided attributes
        new_species = await plant_species_service.create_species(
            PlantSpeciesCreate(
                common_name=plant_info['common_name'],
                scientific_name=plant_info['scientific_name'],
                watering_frequency_days=plant_info['watering_frequency_days'],
                sunlight_hours_needed=plant_info['sunlight_hours_needed'],
                sunlight_type=plant_info['sunlight_type'],
                humidity_preference=plant_info['humidity_preference'],
                temperature_min=plant_info['temperature_min'],
                care_difficulty=plant_info['care_difficulty']
            )
        )
        species_id = new_species.id
    
    return PlantIdentificationResponse(
        scientific_name=plant_info['scientific_name'],
        common_name=plant_info['common_name'],
        species_id=species_id
    )
