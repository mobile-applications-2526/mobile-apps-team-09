"""
Dependency injection for FastAPI endpoints
"""

from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_session
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.models.user import User
from app.repositories.plant_repository import PlantRepository
from app.services.plant_service import PlantService
from app.repositories.plant_species_repository import PlantSpeciesRepository
from app.services.plant_species_service import PlantSpeciesService


# Security
security = HTTPBearer()




async def get_user_repository(
    session: AsyncSession = Depends(get_session),
) -> UserRepository:
    """
    Get user repository instance

    Args:
        session: Database session

    Returns:
        UserRepository instance
    """
    return UserRepository(session)


async def get_user_service(
    repository: UserRepository = Depends(get_user_repository),
) -> UserService:
    """
    Get user service instance

    Args:
        repository: User repository

    Returns:
        UserService instance
    """
    return UserService(repository)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    user_service: UserService = Depends(get_user_service),
) -> User:
    """
    Get current authenticated user from JWT token

    Args:
        credentials: HTTP authorization credentials
        user_service: User service

    Returns:
        Current user

    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    payload = decode_access_token(token)


    

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: Optional[str] = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await user_service.get_user_by_id(int(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

async def get_plant_repository(
    session: AsyncSession = Depends(get_session),
) -> PlantRepository:
    """
    Get plant repository instance
    """
    return PlantRepository(session)


async def get_plant_service(
    repository: PlantRepository = Depends(get_plant_repository),
) -> PlantService:
    """
    Get plant service instance
    """
    return PlantService(repository)

async def get_plant_species_repository(

    session: AsyncSession = Depends(get_session),
) -> PlantSpeciesRepository:
    """
    Get plant species repository instance
    """
    return PlantSpeciesRepository(session)

async def get_plant_species_service(
    repository: PlantSpeciesRepository = Depends(get_plant_species_repository),
) -> PlantSpeciesService:
    """
    Get plant species service instance
    """
    return PlantSpeciesService(repository)

