"""
File upload endpoints for images
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models.user import User
from app.core.dependencies import get_current_user
from app.services.storage_service import storage_service
from typing import Dict

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("/user/avatar", response_model=Dict[str, str])
async def upload_user_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Upload user avatar image to Supabase Storage
    
    Returns URL of uploaded image
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size (e.g., max 5MB)
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    
    # Extract file extension
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["jpg", "jpeg", "png", "webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Upload to Supabase
    image_url = await storage_service.upload_user_avatar(
        file_content=content,
        user_id=current_user.id,
        file_extension=file_extension
    )
    
    # TODO: Update user.avatar_url in database here
    # await user_service.update_user(current_user.id, {"avatar_url": image_url})
    
    return {"image_url": image_url}


@router.post("/plant/{plant_id}/image", response_model=Dict[str, str])
async def upload_plant_image(
    plant_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Upload plant image to Supabase Storage
    
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
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # TODO: Verify plant belongs to current_user
    
    # Upload to Supabase
    image_url = await storage_service.upload_plant_image(
        file_content=content,
        user_id=current_user.id,
        plant_id=plant_id,
        file_extension=file_extension
    )
    
    # TODO: Update plant.image_url in database here
    # await plant_service.update_plant(plant_id, {"image_url": image_url})
    
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
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Upload to Supabase
    image_url = await storage_service.upload_diagnosis_image(
        file_content=content,
        user_id=current_user.id,
        file_extension=file_extension
    )
    
    return {"image_url": image_url}
