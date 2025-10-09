"""
User management endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, status

from app.schemas.user_schema import UserResponse, UserUpdate
from app.services.user_service import UserService
from app.core.dependencies import get_user_service, get_current_user
from app.models.user import User


router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information

    Args:
        current_user: Currently authenticated user

    Returns:
        User information
    """
    return current_user


@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get all users (requires authentication)

    Args:
        skip: Number of records to skip
        limit: Maximum number of records
        user_service: User service instance
        current_user: Currently authenticated user

    Returns:
        List of users
    """
    users = await user_service.get_all_users(skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    Get user by ID (requires authentication)

    Args:
        user_id: User ID
        user_service: User service instance
        current_user: Currently authenticated user

    Returns:
        User information
    """
    user = await user_service.get_user_by_id(user_id)
    if not user:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    Update user information (requires authentication)

    Args:
        user_id: User ID
        user_data: Update data
        user_service: User service instance
        current_user: Currently authenticated user

    Returns:
        Updated user information
    """
    # Users can only update their own information unless they're superuser
    if current_user.id != user_id and not current_user.is_superuser:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=403, detail="Not authorized to update this user"
        )

    user = await user_service.update_user(user_id, user_data)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a user (requires authentication and superuser privileges)

    Args:
        user_id: User ID
        user_service: User service instance
        current_user: Currently authenticated user
    """
    # Only superusers can delete users
    if not current_user.is_superuser:
        from fastapi import HTTPException

        raise HTTPException(status_code=403, detail="Not authorized to delete users")

    await user_service.delete_user(user_id)
