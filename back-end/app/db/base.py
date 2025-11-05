"""
Import all models here for Alembic migrations to detect them
"""

from app.db.database import Base
from app.models.user import User
from app.models.plant import Plant
from app.models.plant_species import PlantSpecies

# Add more models as they are created
__all__ = ["Base", "User", "Plant", "PlantSpecies"]
