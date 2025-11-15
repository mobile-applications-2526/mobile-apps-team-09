"""
PlantSpecies service containing business logic
"""
from typing import Optional, List
from fastapi import HTTPException, status

from app.models.plant_species import PlantSpecies
from app.repositories.plant_species_repository import PlantSpeciesRepository
from app.schemas.plant_species_schema import PlantSpeciesCreate, PlantSpeciesUpdate
from app.core.logging import get_logger

logger = get_logger(__name__)

class PlantSpeciesService:
    def __init__(self, repository: PlantSpeciesRepository):
        self.repository = repository

    async def create(self, data: PlantSpeciesCreate) -> PlantSpecies:
        # enforce unique common_name
        existing = await self.repository.get_by_common_name(data.common_name)
        if existing:
            raise HTTPException(status_code=400, detail="Species common_name already exists")

        obj = await self.repository.create(**data.model_dump(exclude_unset=True))
        logger.info(f"Created species '{obj.common_name}' (ID: {obj.id})")
        return obj

    async def get_by_id(self, species_id: int) -> Optional[PlantSpecies]:
        return await self.repository.get_by_id(species_id)

    async def get_species_by_name(self, scientific_name: str) -> Optional[PlantSpecies]:
        """Get species by scientific name (for AI identification)"""
        return await self.repository.get_by_scientific_name(scientific_name)

    async def create_species(self, data: PlantSpeciesCreate) -> PlantSpecies:
        """Create species without enforcing unique constraint (for AI auto-creation)"""
        obj = await self.repository.create(**data.model_dump(exclude_unset=True))
        logger.info(f"Auto-created species '{obj.scientific_name}' from AI identification")
        return obj

    async def list(self, skip: int = 0, limit: int = 100) -> List[PlantSpecies]:
        return await self.repository.get_all(skip, limit)

    async def update(self, species_id: int, data: PlantSpeciesUpdate) -> PlantSpecies:
        updated = await self.repository.update(species_id, **data.model_dump(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=404, detail="Species not found")
        logger.info(f"Updated species ID {species_id}")
        return updated

    async def delete(self, species_id: int) -> bool:
        ok = await self.repository.delete(species_id)
        if not ok:
            raise HTTPException(status_code=404, detail="Species not found")
        logger.info(f"Deleted species ID {species_id}")
        return True
