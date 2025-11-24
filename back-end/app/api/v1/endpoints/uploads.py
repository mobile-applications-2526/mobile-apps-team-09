"""
File upload endpoints for images
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models.user import User
from app.core.dependencies import get_current_user, get_user_service, get_plant_service
from app.services.storage_service import storage_service
from app.services.user_service import UserService
from app.services.plant_service import PlantService
from app.schemas.user_schema import UserUpdate
from app.schemas.plant_schema import PlantUpdate
from typing import Dict

router = APIRouter(prefix="/uploads", tags=["Uploads"])



@router.post("/plant/{plant_id}/image", response_model=Dict[str, str])
async def upload_plant_image(
    plant_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    plant_service: PlantService = Depends(get_plant_service),
):
    """
    Upload plant image to Supabase Storage and update plant record
    
    Returns URL of uploaded image
    """
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:  # 10MB for plant images
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["jpg", "jpeg", "png", "webp"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PNG, JPEG, and WebP images are allowed."
        )
    
    # Verify plant belongs to current_user
    plant = await plant_service.get_plant_by_id(plant_id, current_user.id)
    
    if not plant:
        raise HTTPException(
            status_code=404, 
            detail="This plant doesn't exist in your garden. Add it to your collection first! 🌱"
        )
    
    # Upload to Supabase
    image_url = await storage_service.upload_plant_image(
        file_content=content,
        user_id=current_user.id,
        plant_id=plant_id,
        file_extension=file_extension
    )
    
    # Update plant with image URL
    await plant_service.update_plant(plant_id, current_user.id, PlantUpdate(image_url=image_url))
    
    return {"image_url": image_url}


@router.post("/diagnosis/image", response_model=Dict[str, str])
async def upload_diagnosis_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Upload diagnosis image to Supabase Storage
    
    Use this BEFORE creating the diagnosis record
    Returns URL to save in diagnosis.image_url
    """
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["jpg", "jpeg", "png", "webp"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PNG, JPEG, and WebP images are allowed."
        )
    
    # Upload to Supabase
    image_url = await storage_service.upload_diagnosis_image(
        file_content=content,
        user_id=current_user.id,
        file_extension=file_extension
    )
    
    return {"image_url": image_url}
