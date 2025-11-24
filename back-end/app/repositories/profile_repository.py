"""
Profile repository for data access
"""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile
from app.repositories.base_repository import BaseRepository


class ProfileRepository(BaseRepository[Profile]):
    """
    Profile repository with profile-specific data access methods
    """

    def __init__(self, session: AsyncSession):
        """
        Initialize profile repository

        Args:
            session: Database session
        """
        super().__init__(Profile, session)

    async def get_by_user_id(self, user_id: int) -> Optional[Profile]:
        """
        Get profile by user ID

        Args:
            user_id: User ID

        Returns:
            Profile instance or None
        """
        result = await self.session.execute(
            select(Profile).where(Profile.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def user_id_exists(self, user_id: int) -> bool:
        """
        Check if a profile exists for a given user ID

        Args:
            user_id: User ID to check

        Returns:
            True if exists, False otherwise
        """
        profile = await self.get_by_user_id(user_id)
        return profile is not None
