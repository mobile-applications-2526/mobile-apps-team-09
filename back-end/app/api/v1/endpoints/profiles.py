"""
Profile management endpoints
"""

from fastapi import APIRouter, Depends, status

from app.schemas.profile_schema import ProfileResponse, ProfileUpdate
from app.services.profile_service import ProfileService
from app.core.dependencies import get_profile_service, get_current_user
from app.models.user import User


router = APIRouter()


@router.get("/user/{user_id}", response_model=ProfileResponse)
async def get_profile_by_user_id(
    user_id: int,
    profile_service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get profile by user ID (requires authentication)

    Args:
        user_id: User ID
        profile_service: Profile service instance
        current_user: Currently authenticated user

    Returns:
        Profile information
    """
    profile = await profile_service.get_profile_by_user_id(user_id)
    return profile


@router.post("/user/{user_id}", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile_by_user_id(
    user_id: int,
    profile_data: ProfileUpdate,
    profile_service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new profile for a user (requires authentication)

    Args:
        user_id: User ID
        profile_data: Profile data
        profile_service: Profile service instance
        current_user: Currently authenticated user

    Returns:
        Created profile information
    """
    # Users can only create their own profile unless they're superuser
    if current_user.id != user_id and not current_user.is_superuser:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=403, detail="Not authorized to create profile for this user"
        )

    profile = await profile_service.create_profile(user_id, profile_data)
    return profile


@router.put("/user/{user_id}", response_model=ProfileResponse)
async def update_profile_by_user_id(
    user_id: int,
    profile_data: ProfileUpdate,
    profile_service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    """
    Update profile by user ID (requires authentication)

    Args:
        user_id: User ID
        profile_data: Profile update data
        profile_service: Profile service instance
        current_user: Currently authenticated user

    Returns:
        Updated profile information
    """
    # Users can only update their own profile unless they're superuser
    if current_user.id != user_id and not current_user.is_superuser:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=403, detail="Not authorized to update this profile"
        )

    profile = await profile_service.update_profile_by_user_id(user_id, profile_data)
    return profile
