"""
Diagnosis repository for data access
"""

from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from app.models.diagnosis import Diagnosis
from app.repositories.base_repository import BaseRepository


class DiagnosisRepository(BaseRepository[Diagnosis]):
    """
    Diagnosis repository with diagnosis-specific data access methods
    """

    def __init__(self, session: AsyncSession):
        """
        Initialize diagnosis repository

        Args:
            session: Async database session
        """
        super().__init__(Diagnosis, session)

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Diagnosis]:
        """
        Get all diagnoses with pagination
        """
        stmt = (
            select(Diagnosis)
            .options(joinedload(Diagnosis.plant))
            .order_by(Diagnosis.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_plant_id(
        self, plant_id: int, skip: int = 0, limit: int = 100
    ) -> List[Diagnosis]:
        """
        Get all diagnoses for a specific plant with pagination
        """
        stmt = (
            select(Diagnosis)
            .options(joinedload(Diagnosis.plant))
            .where(Diagnosis.plant_id == plant_id)
            .order_by(Diagnosis.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_user_id(
        self, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Diagnosis]:
        """
        Get all diagnoses for plants belonging to a specific user
        """
        from app.models.plant import Plant

        stmt = (
            select(Diagnosis)
            .options(joinedload(Diagnosis.plant))
            .join(Plant, Diagnosis.plant_id == Plant.id)
            .where(Plant.user_id == user_id)
            .order_by(Diagnosis.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, diagnosis_id: int) -> Optional[Diagnosis]:
        """
        Get a single diagnosis by ID
        """
        stmt = select(Diagnosis).options(joinedload(Diagnosis.plant)).where(Diagnosis.id == diagnosis_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, plant_id: int, **kwargs) -> Diagnosis:
        """
        Create a new diagnosis for a plant
        """
        diagnosis = Diagnosis(plant_id=plant_id, **kwargs)
        self.session.add(diagnosis)
        await self.session.commit()
        await self.session.refresh(diagnosis)
        return diagnosis

    async def update(self, diagnosis_id: int, **kwargs) -> Optional[Diagnosis]:
        """
        Update an existing diagnosis
        Returns the updated diagnosis or None if not found
        """
        diagnosis = await self.get_by_id(diagnosis_id)
        if not diagnosis:
            return None

        for k, v in kwargs.items():
            setattr(diagnosis, k, v)

        await self.session.commit()
        await self.session.refresh(diagnosis)
        return diagnosis

    async def delete(self, diagnosis_id: int) -> bool:
        """
        Delete a diagnosis
        Returns True if deleted, False if not found
        """
        diagnosis = await self.get_by_id(diagnosis_id)
        if not diagnosis:
            return False

        await self.session.delete(diagnosis)
        await self.session.commit()
        return True
