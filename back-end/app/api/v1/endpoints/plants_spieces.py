"""
PlantSpecies management endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.plant_species_schema import (
    PlantSpeciesCreate, PlantSpeciesUpdate, PlantSpeciesResponse
)
from app.services.plant_species_service import PlantSpeciesService
from app.core.dependencies import get_current_user, get_plant_species_service
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[PlantSpeciesResponse])
async def list_species(
    skip: int = 0,
    limit: int = 100,
    svc: PlantSpeciesService = Depends(get_plant_species_service),
    _: User = Depends(get_current_user),  # require auth; remove if you want public
):
    return await svc.list(skip=skip, limit=limit)

@router.post("/", response_model=PlantSpeciesResponse, status_code=status.HTTP_201_CREATED)
async def create_species(
    payload: PlantSpeciesCreate,
    svc: PlantSpeciesService = Depends(get_plant_species_service),
    _: User = Depends(get_current_user),
):
    return await svc.create(payload)

@router.get("/{species_id}", response_model=PlantSpeciesResponse)
async def get_species(
    species_id: int,
    svc: PlantSpeciesService = Depends(get_plant_species_service),
    _: User = Depends(get_current_user),
):
    obj = await svc.get_by_id(species_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Species not found")
    return obj

@router.put("/{species_id}", response_model=PlantSpeciesResponse)
async def update_species(
    species_id: int,
    payload: PlantSpeciesUpdate,
    svc: PlantSpeciesService = Depends(get_plant_species_service),
    _: User = Depends(get_current_user),
):
    return await svc.update(species_id, payload)

@router.delete("/{species_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_species(
    species_id: int,
    svc: PlantSpeciesService = Depends(get_plant_species_service),
    _: User = Depends(get_current_user),
):
    await svc.delete(species_id)
    return
