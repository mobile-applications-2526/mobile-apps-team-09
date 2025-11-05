"""
Plant repository for data access
"""

from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload
from app.models.plant import Plant
from app.repositories.base_repository import BaseRepository


class PlantRepository(BaseRepository[Plant]):
    """
    Plant repository with plant-specific data access methods
    """

    def __init__(self, session: AsyncSession):
        """
        Initialize plant repository

        Args:
            session: Async database session
        """
        super().__init__(Plant, session)

    async def get_by_id_for_user(self, plant_id: int, user_id: int) -> Optional[Plant]:
        """
        Get a single plant by id that belongs to the given user.
        """
        result = await self.session.execute(
            select(Plant).where(Plant.id == plant_id, Plant.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_all_for_user(
        self, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Plant]:
        """
        List plants for a user with pagination.
        """
        result = await self.session.execute(
            select(Plant)
            .where(Plant.user_id == user_id)
            .order_by(Plant.id.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def create(self, user_id: int, **kwargs) -> Plant:
        """
        Create a new plant for the given user.
        """
        plant = Plant(user_id=user_id, **kwargs)
        self.session.add(plant)
        await self.session.commit()
        await self.session.refresh(plant)
        return plant

    async def update(self, plant_id: int, user_id: int, **kwargs) -> Optional[Plant]:
        """
        Update an existing plant (must belong to the given user).
        Returns the updated plant or None if not found.
        """
        plant = await self.get_by_id_for_user(plant_id=plant_id, user_id=user_id)
        if not plant:
            return None

        for k, v in kwargs.items():
            setattr(plant, k, v)

        await self.session.commit()
        await self.session.refresh(plant)
        return plant

    async def delete(self, plant_id: int, user_id: int) -> bool:
        """
        Delete a plant (must belong to the given user).
        Returns True if deleted, False if not found.
        """
        plant = await self.get_by_id_for_user(plant_id=plant_id, user_id=user_id)
        if not plant:
            return False

        await self.session.delete(plant)
        await self.session.commit()
        return True
    async def get_all_for_user(self, user_id: int, skip: int, limit: int) -> List[Plant]:
        stmt = (
            select(Plant)
            .options(joinedload(Plant.species))    
            .where(Plant.user_id == user_id)
            .order_by(Plant.id.desc())
            .offset(skip).limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_id_for_user(self, plant_id: int, user_id: int) -> Optional[Plant]:
        stmt = (
            select(Plant)
            .options(joinedload(Plant.species))
            .where(Plant.id == plant_id, Plant.user_id == user_id)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
