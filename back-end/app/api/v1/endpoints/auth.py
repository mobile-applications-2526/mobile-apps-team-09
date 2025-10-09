"""
Authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.user_schema import UserCreate, UserResponse, UserLogin, Token
from app.services.user_service import UserService
from app.core.dependencies import get_user_service


router = APIRouter()


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register(
    user_data: UserCreate, user_service: UserService = Depends(get_user_service)
):
    """
    Register a new user

    Args:
        user_data: User registration data
        user_service: User service instance

    Returns:
        Created user information
    """
    user = await user_service.create_user(user_data)
    return user


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin, user_service: UserService = Depends(get_user_service)
):
    """
    Login and receive an access token

    Args:
        credentials: Login credentials
        user_service: User service instance

    Returns:
        Access token
    """
    access_token = await user_service.login(credentials.username, credentials.password)
    return Token(access_token=access_token)
