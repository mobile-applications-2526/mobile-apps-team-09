"""
PlantSpecies repository for data access
"""
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.plant_species import PlantSpecies
from app.repositories.base_repository import BaseRepository

class PlantSpeciesRepository(BaseRepository[PlantSpecies]):
    def __init__(self, session: AsyncSession):
        super().__init__(PlantSpecies, session)

    async def get_by_common_name(self, name: str) -> Optional[PlantSpecies]:
        result = await self.session.execute(
            select(PlantSpecies).where(PlantSpecies.common_name == name)
        )
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[PlantSpecies]:
        result = await self.session.execute(
            select(PlantSpecies)
            .order_by(PlantSpecies.common_name.asc())
            .offset(skip).limit(limit)
        )
        return result.scalars().all()

    async def create(self, **kwargs) -> PlantSpecies:
        obj = PlantSpecies(**kwargs)
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def update(self, species_id: int, **kwargs) -> Optional[PlantSpecies]:
        obj = await self.get_by_id(species_id)
        if not obj:
            return None
        for k, v in kwargs.items():
            setattr(obj, k, v)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def delete(self, species_id: int) -> bool:
        obj = await self.get_by_id(species_id)
        if not obj:
            return False
        await self.session.delete(obj)
        await self.session.commit()
        return True
