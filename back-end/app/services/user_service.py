"""
User service containing business logic
"""

from typing import Optional, List
from fastapi import HTTPException, status

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.logging import get_logger


logger = get_logger(__name__)


class UserService:
    """
    User service with business logic for user operations
    """

    def __init__(self, repository: UserRepository):
        """
        Initialize user service

        Args:
            repository: User repository instance
        """
        self.repository = repository

    async def create_user(self, user_data: UserCreate) -> User:
        """
        Create a new user

        Args:
            user_data: User creation data

        Returns:
            Created user

        Raises:
            HTTPException: If email or username already exists
        """
        # Check if email exists
        if await self.repository.email_exists(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Check if username exists
        if await self.repository.username_exists(user_data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
            )

        # Hash password
        hashed_password = get_password_hash(user_data.password)

        # Create user
        user = await self.repository.create(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
        )

        logger.info(f"Created new user: {user.username} (ID: {user.id})")
        return user

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Get user by ID

        Args:
            user_id: User ID

        Returns:
            User or None
        """
        return await self.repository.get_by_id(user_id)

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email

        Args:
            email: User email

        Returns:
            User or None
        """
        return await self.repository.get_by_email(email)

    async def get_user_by_username(self, username: str) -> Optional[User]:
        """
        Get user by username

        Args:
            username: Username

        Returns:
            User or None
        """
        return await self.repository.get_by_username(username)

    async def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Get all users with pagination

        Args:
            skip: Number of records to skip
            limit: Maximum number of records

        Returns:
            List of users
        """
        return await self.repository.get_all(skip=skip, limit=limit)

    async def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        """
        Update user information

        Args:
            user_id: User ID
            user_data: Update data

        Returns:
            Updated user

        Raises:
            HTTPException: If user not found or email/username taken
        """
        # Check if user exists
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        update_data = user_data.model_dump(exclude_unset=True)

        # Check email uniqueness if being updated
        if "email" in update_data and update_data["email"] != user.email:
            if await self.repository.email_exists(update_data["email"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered",
                )

        # Check username uniqueness if being updated
        if "username" in update_data and update_data["username"] != user.username:
            if await self.repository.username_exists(update_data["username"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken",
                )

        # Hash password if being updated
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(
                update_data.pop("password")
            )

        updated_user = await self.repository.update(user_id, **update_data)
        logger.info(f"Updated user: {updated_user.username} (ID: {user_id})")

        return updated_user

    async def delete_user(self, user_id: int) -> bool:
        """
        Delete a user

        Args:
            user_id: User ID

        Returns:
            True if deleted

        Raises:
            HTTPException: If user not found
        """
        deleted = await self.repository.delete(user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        logger.info(f"Deleted user with ID: {user_id}")
        return True

    async def get_user_by_id_with_plants(self, user_id: int) -> Optional[User]:
        return await self.repository.get_by_id_with_plants(user_id)

    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """
        Authenticate user credentials

        Args:
            username: Username
            password: Password

        Returns:
            User if authenticated, None otherwise
        """
        user = await self.repository.get_by_username(username)
        print("got request")

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        if not user.is_active:
            return None

        return user

    async def login(self, username: str, password: str) -> str:
        """
        Login user and generate access token

        Args:
            username: Username
            password: Password

        Returns:
            Access token

        Raises:
            HTTPException: If credentials are invalid
        """
        user = await self.authenticate_user(username, password)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": str(user.id)})
        logger.info(f"User logged in: {user.username} (ID: {user.id})")

        return access_token


