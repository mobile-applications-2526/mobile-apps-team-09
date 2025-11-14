"""
Main API router aggregating all endpoint routers
"""

from fastapi import APIRouter

from app.api.v1.endpoints import users, plants, plants_spieces, auth, diagnoses  # etc.


api_router = APIRouter()
# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(plants.router, prefix="/plants", tags=["plants"])
api_router.include_router(plants_spieces.router, prefix="/spieces", tags=["species"])
api_router.include_router(diagnoses.router, prefix="/diagnoses", tags=["diagnoses"])

# Add more routers here as the application grows
# api_router.include_router(items.router, prefix="/items", tags=["Items"])
