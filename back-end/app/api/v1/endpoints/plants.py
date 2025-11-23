"""
Plant management endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, status, HTTPException

from app.schemas.plant_schema import PlantCreate, PlantUpdate, PlantResponse
from app.services.plant_service import PlantService
from app.core.dependencies import get_plant_service, get_current_user
from app.models.user import User

router = APIRouter()


@router.get("", response_model=List[PlantResponse])
async def list_my_plants(
    skip: int = 0,
    limit: int = 100,
    plant_service: PlantService = Depends(get_plant_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get all plants for the current authenticated user
    """
    return await plant_service.get_user_plants(user_id=current_user.id, skip=skip, limit=limit)


@router.post("", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
async def create_plant(
    plant_data: PlantCreate,
    plant_service: PlantService = Depends(get_plant_service),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new plant for the current user
    """
    return await plant_service.create_plant(user_id=current_user.id, data=plant_data)


@router.get("/{plant_id}", response_model=PlantResponse)
async def get_plant(
    plant_id: int,
    plant_service: PlantService = Depends(get_plant_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get a single plant by ID (must belong to the current user)
    """
    plant = await plant_service.get_plant_by_id(plant_id=plant_id, user_id=current_user.id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant


@router.put("/{plant_id}", response_model=PlantResponse)
async def update_plant(
    plant_id: int,
    plant_data: PlantUpdate,
    plant_service: PlantService = Depends(get_plant_service),
    current_user: User = Depends(get_current_user),
):
    """
    Update a plant (must belong to the current user)
    """
    # Service enforces ownership; returns 404 if not found / not owned
    updated = await plant_service.update_plant(plant_id=plant_id, user_id=current_user.id, data=plant_data)
    if not updated:
        # Defensive; service should already raise or return updated instance
        raise HTTPException(status_code=404, detail="Plant not found")
    return updated


@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plant(
    plant_id: int,
    plant_service: PlantService = Depends(get_plant_service),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a plant (must belong to the current user)
    """
    deleted = await plant_service.delete_plant(plant_id=plant_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Plant not found")
    return


@router.post("/{plant_id}/water", response_model=PlantResponse)
async def water_plant(
    plant_id: int,
    plant_service: PlantService = Depends(get_plant_service),
    current_user: User = Depends(get_current_user),
):
    """
    Mark a plant as watered (updates last_watered to now and creates activity log)

    Args:
        plant_id: Plant ID
        plant_service: Plant service instance
        current_user: Currently authenticated user

    Returns:
        Updated plant information
    """
    plant = await plant_service.water_plant(plant_id, current_user.id)
    return plant
