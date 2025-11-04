"""
Plant service containing business logic
"""

from typing import Optional, List
from fastapi import HTTPException, status

from app.models.plant import Plant
from app.repositories.plant_repository import PlantRepository
from app.schemas.plant_schema import PlantCreate, PlantUpdate
from app.core.logging import get_logger

logger = get_logger(__name__)


class PlantService:
    """
    Plant service with business logic for plant operations
    """

    def __init__(self, repository: PlantRepository):
        """
        Initialize plant service

        Args:
            repository: Plant repository instance
        """
        self.repository = repository

    async def create_plant(self, user_id: int, data: PlantCreate) -> Plant:
        """
        Create a new plant for a user
        """
        plant = await self.repository.create(
            user_id=user_id,
            **data.model_dump(exclude_unset=True),
        )
        logger.info(f"Created plant '{plant.plant_name}' (ID: {plant.id}) for user {user_id}")
        return plant

    async def get_plant_by_id(self, plant_id: int, user_id: int) -> Optional[Plant]:
        """
        Get a single plant belonging to a user
        """
        return await self.repository.get_by_id_for_user(plant_id=plant_id, user_id=user_id)

    async def get_user_plants(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Plant]:
        """
        List plants for a user (paginated)
        """
        return await self.repository.get_all_for_user(user_id=user_id, skip=skip, limit=limit)

    async def update_plant(self, plant_id: int, user_id: int, data: PlantUpdate) -> Plant:
        """
        Update a plant (must belong to user)
        """
        plant = await self.repository.get_by_id_for_user(plant_id=plant_id, user_id=user_id)
        if not plant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plant not found")

        update_data = data.model_dump(exclude_unset=True)
        updated = await self.repository.update(plant_id, user_id=user_id, **update_data)

        logger.info(f"Updated plant ID {plant_id} for user {user_id}")
        return updated

    async def delete_plant(self, plant_id: int, user_id: int) -> bool:
        """
        Delete a plant (must belong to user)
        """
        deleted = await self.repository.delete(plant_id=plant_id, user_id=user_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plant not found")
        logger.info(f"Deleted plant ID {plant_id} for user {user_id}")
        return True
