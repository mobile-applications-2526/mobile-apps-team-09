"""
Diagnosis management endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, status, HTTPException

from app.schemas.diagnosis_schema import DiagnosisCreate, DiagnosisUpdate, DiagnosisResponse
from app.services.diagnosis_service import DiagnosisService
from app.core.dependencies import get_diagnosis_service, get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[DiagnosisResponse])
async def get_all_diagnoses(
    skip: int = 0,
    limit: int = 100,
    diagnosis_service: DiagnosisService = Depends(get_diagnosis_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get all diagnoses for the current authenticated user
    Returns diagnoses for all plants owned by the user
    """
    diagnoses = await diagnosis_service.get_diagnoses_by_user(
        user_id=current_user.id, skip=skip, limit=limit
    )
    
    # Add plant_name to each diagnosis
    result = []
    for diagnosis in diagnoses:
        diag_dict = diagnosis.__dict__.copy()
        if diagnosis.plant:
            diag_dict['plant_name'] = diagnosis.plant.plant_name
        result.append(diag_dict)
    
    return result


@router.get("/plant/{plant_id}", response_model=List[DiagnosisResponse])
async def get_diagnoses_by_plant(
    plant_id: int,
    skip: int = 0,
    limit: int = 100,
    diagnosis_service: DiagnosisService = Depends(get_diagnosis_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get all diagnoses for a specific plant
    Plant must belong to the current user
    """
    return await diagnosis_service.get_diagnoses_by_plant(
        plant_id=plant_id, user_id=current_user.id, skip=skip, limit=limit
    )


@router.get("/user/{user_id}", response_model=List[DiagnosisResponse])
async def get_diagnoses_by_user_id(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    diagnosis_service: DiagnosisService = Depends(get_diagnosis_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get all diagnoses for a specific user
    Users can only access their own diagnoses unless they are superuser
    """
    # Users can only view their own diagnoses unless superuser
    if current_user.id != user_id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these diagnoses",
        )

    return await diagnosis_service.get_diagnoses_by_user(
        user_id=user_id, skip=skip, limit=limit
    )


@router.post("/", response_model=DiagnosisResponse, status_code=status.HTTP_201_CREATED)
async def create_diagnosis(
    diagnosis_data: DiagnosisCreate,
    diagnosis_service: DiagnosisService = Depends(get_diagnosis_service),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new diagnosis for a plant
    Plant must belong to the current user
    """
    return await diagnosis_service.create_diagnosis(
        user_id=current_user.id, data=diagnosis_data
    )


@router.get("/{diagnosis_id}", response_model=DiagnosisResponse)
async def get_diagnosis(
    diagnosis_id: int,
    diagnosis_service: DiagnosisService = Depends(get_diagnosis_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get a single diagnosis by ID
    Diagnosis must belong to a plant owned by the current user
    """
    diagnosis = await diagnosis_service.get_diagnosis_by_id(
        diagnosis_id=diagnosis_id, user_id=current_user.id
    )
    if not diagnosis:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    
    # Add plant_name
    diag_dict = diagnosis.__dict__.copy()
    if diagnosis.plant:
        diag_dict['plant_name'] = diagnosis.plant.plant_name
    
    return diag_dict


@router.put("/{diagnosis_id}", response_model=DiagnosisResponse)
async def update_diagnosis(
    diagnosis_id: int,
    diagnosis_data: DiagnosisUpdate,
    diagnosis_service: DiagnosisService = Depends(get_diagnosis_service),
    current_user: User = Depends(get_current_user),
):
    """
    Update a diagnosis
    Diagnosis must belong to a plant owned by the current user
    """
    updated = await diagnosis_service.update_diagnosis(
        diagnosis_id=diagnosis_id, user_id=current_user.id, data=diagnosis_data
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return updated


@router.delete("/{diagnosis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diagnosis(
    diagnosis_id: int,
    diagnosis_service: DiagnosisService = Depends(get_diagnosis_service),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a diagnosis
    Diagnosis must belong to a plant owned by the current user
    """
    deleted = await diagnosis_service.delete_diagnosis(
        diagnosis_id=diagnosis_id, user_id=current_user.id
    )
    if not deleted:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return
