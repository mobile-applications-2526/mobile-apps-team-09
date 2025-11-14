"""
Diagnosis service containing business logic
"""

from typing import Optional, List
from fastapi import HTTPException, status

from app.models.diagnosis import Diagnosis
from app.repositories.diagnosis_repository import DiagnosisRepository
from app.repositories.plant_repository import PlantRepository
from app.schemas.diagnosis_schema import DiagnosisCreate, DiagnosisUpdate
from app.core.logging import get_logger

logger = get_logger(__name__)


class DiagnosisService:
    """
    Diagnosis service with business logic for diagnosis operations
    """

    def __init__(self, diagnosis_repository: DiagnosisRepository, plant_repository: PlantRepository):
        """
        Initialize diagnosis service

        Args:
            diagnosis_repository: Diagnosis repository instance
            plant_repository: Plant repository instance
        """
        self.diagnosis_repository = diagnosis_repository
        self.plant_repository = plant_repository

    async def create_diagnosis(self, user_id: int, data: DiagnosisCreate) -> Diagnosis:
        """
        Create a new diagnosis for a plant
        Validates that the plant belongs to the user
        """
        # Verify plant exists and belongs to user
        plant = await self.plant_repository.get_by_id_for_user(
            plant_id=data.plant_id, user_id=user_id
        )
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant not found or does not belong to you",
            )

        diagnosis = await self.diagnosis_repository.create(
            plant_id=data.plant_id, **data.model_dump(exclude={"plant_id"}, exclude_unset=True)
        )
        logger.info(
            f"Created diagnosis ID {diagnosis.id} for plant {data.plant_id} by user {user_id}"
        )
        return diagnosis

    async def get_diagnosis_by_id(self, diagnosis_id: int, user_id: int) -> Optional[Diagnosis]:
        """
        Get a single diagnosis by ID
        Validates that the diagnosis belongs to a plant owned by the user
        """
        diagnosis = await self.diagnosis_repository.get_by_id(diagnosis_id)
        if not diagnosis:
            return None

        # Verify the plant belongs to the user
        plant = await self.plant_repository.get_by_id_for_user(
            plant_id=diagnosis.plant_id, user_id=user_id
        )
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this diagnosis",
            )

        return diagnosis

    async def get_all_diagnoses(self, skip: int = 0, limit: int = 100) -> List[Diagnosis]:
        """
        Get all diagnoses (admin functionality)
        """
        return await self.diagnosis_repository.get_all(skip=skip, limit=limit)

    async def get_diagnoses_by_plant(
        self, plant_id: int, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Diagnosis]:
        """
        Get all diagnoses for a specific plant
        Validates that the plant belongs to the user
        """
        # Verify plant belongs to user
        plant = await self.plant_repository.get_by_id_for_user(plant_id=plant_id, user_id=user_id)
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant not found or does not belong to you",
            )

        return await self.diagnosis_repository.get_by_plant_id(
            plant_id=plant_id, skip=skip, limit=limit
        )

    async def get_diagnoses_by_user(
        self, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Diagnosis]:
        """
        Get all diagnoses for plants belonging to a user
        """
        return await self.diagnosis_repository.get_by_user_id(
            user_id=user_id, skip=skip, limit=limit
        )

    async def update_diagnosis(
        self, diagnosis_id: int, user_id: int, data: DiagnosisUpdate
    ) -> Diagnosis:
        """
        Update a diagnosis
        Validates that the diagnosis belongs to a plant owned by the user
        """
        diagnosis = await self.get_diagnosis_by_id(diagnosis_id=diagnosis_id, user_id=user_id)
        if not diagnosis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Diagnosis not found"
            )

        update_data = data.model_dump(exclude_unset=True)
        updated = await self.diagnosis_repository.update(diagnosis_id, **update_data)

        logger.info(f"Updated diagnosis ID {diagnosis_id} by user {user_id}")
        return updated

    async def delete_diagnosis(self, diagnosis_id: int, user_id: int) -> bool:
        """
        Delete a diagnosis
        Validates that the diagnosis belongs to a plant owned by the user
        """
        diagnosis = await self.get_diagnosis_by_id(diagnosis_id=diagnosis_id, user_id=user_id)
        if not diagnosis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Diagnosis not found"
            )

        deleted = await self.diagnosis_repository.delete(diagnosis_id)
        logger.info(f"Deleted diagnosis ID {diagnosis_id} by user {user_id}")
        return deleted
