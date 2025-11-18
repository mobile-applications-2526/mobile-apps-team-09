"""
Profile service containing business logic
"""

from typing import Optional
from datetime import datetime, timezone
from fastapi import HTTPException, status

from app.models.profile import Profile
from app.repositories.profile_repository import ProfileRepository
from app.repositories.user_repository import UserRepository
from app.repositories.plant_repository import PlantRepository
from app.schemas.profile_schema import ProfileCreate, ProfileUpdate
from app.core.logging import get_logger


logger = get_logger(__name__)


class ProfileService:
    """
    Profile service with business logic for profile operations
    """

    def __init__(
        self,
        repository: ProfileRepository,
        user_repository: UserRepository,
        plant_repository: PlantRepository,
    ):
        """
        Initialize profile service

        Args:
            repository: Profile repository instance
            user_repository: User repository instance
            plant_repository: Plant repository instance
        """
        self.repository = repository
        self.user_repository = user_repository
        self.plant_repository = plant_repository

    async def _calculate_care_rate(self, user_id: int) -> int:
        """
        Calculate care rate percentage based on plants watered on time

        Args:
            user_id: User ID

        Returns:
            Care rate as integer percentage (0-100)
        """
        # Get all plants for the user
        plants = await self.plant_repository.get_all_for_user(
            user_id=user_id, skip=0, limit=1000
        )

        if not plants:
            return 100  # No plants = perfect care rate

        plants_on_time = 0
        now = datetime.now(timezone.utc)

        for plant in plants:
            # Skip if plant has never been watered
            if not plant.last_watered:
                continue

            # Calculate days since last watered
            last_watered = plant.last_watered
            if last_watered.tzinfo is None:
                last_watered = last_watered.replace(tzinfo=timezone.utc)

            days_since_watered = (now - last_watered).days

            # Check if plant was watered on time
            if (
                plant.species
                and plant.species.watering_frequency_days
                and days_since_watered < plant.species.watering_frequency_days
            ):
                plants_on_time += 1

        # Calculate percentage
        care_rate = int((plants_on_time / len(plants)) * 100)
        return care_rate

    async def get_profile_by_user_id(self, user_id: int) -> dict:
        """
        Get profile by user ID with computed fields

        Args:
            user_id: User ID

        Returns:
            Profile dict with computed fields (care_rate, care_streak)

        Raises:
            HTTPException: If profile not found
        """
        profile = await self.repository.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile not found for user ID {user_id}",
            )

        # Auto-update plant_count from actual plant count
        actual_plant_count = await self.plant_repository.count_plants_for_user(user_id)
        if profile.plant_count != actual_plant_count:
            await self.repository.update(profile.id, plant_count=actual_plant_count)
            profile.plant_count = actual_plant_count

        # Calculate care rate
        care_rate = await self._calculate_care_rate(user_id)

        # Convert to dict and add computed fields
        profile_dict = {
            "id": profile.id,
            "user_id": profile.user_id,
            "full_name": profile.full_name,
            "tagline": profile.tagline,
            "age": profile.age,
            "experience_level": profile.experience_level,
            "experience_years": profile.experience_years,
            "living_situation": profile.living_situation,
            "plant_count": profile.plant_count,
            "care_rate": care_rate,
            "care_streak": 0,  # TODO: Requires watering history table
            "created_at": profile.created_at,
            "updated_at": profile.updated_at,
        }

        return profile_dict

    async def create_profile(self, user_id: int, profile_data: ProfileUpdate) -> dict:
        """
        Create a new profile for a user

        Args:
            user_id: User ID
            profile_data: Profile creation data

        Returns:
            Created profile dict with computed fields

        Raises:
            HTTPException: If user doesn't exist or profile already exists
        """
        # Check if user exists
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found",
            )

        # Check if profile already exists for this user
        if await self.repository.user_id_exists(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Profile already exists for user ID {user_id}",
            )

        # Auto-calculate plant_count
        actual_plant_count = await self.plant_repository.count_plants_for_user(user_id)

        # Create profile
        profile_dict = profile_data.model_dump(exclude_unset=True)
        profile = await self.repository.create(
            user_id=user_id, plant_count=actual_plant_count, **profile_dict
        )

        logger.info(f"Created profile for user ID: {user_id}")

        # Return with computed fields
        return await self.get_profile_by_user_id(user_id)

    async def update_profile_by_user_id(
        self, user_id: int, profile_data: ProfileUpdate
    ) -> dict:
        """
        Update profile by user ID

        Args:
            user_id: User ID
            profile_data: Profile update data

        Returns:
            Updated profile dict with computed fields

        Raises:
            HTTPException: If profile not found
        """
        # Get existing profile
        profile = await self.repository.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profile not found for user ID {user_id}",
            )

        # Auto-calculate plant_count
        actual_plant_count = await self.plant_repository.count_plants_for_user(user_id)

        # Update profile with auto-calculated plant_count
        update_data = profile_data.model_dump(exclude_unset=True)
        update_data["plant_count"] = actual_plant_count
        updated_profile = await self.repository.update(profile.id, **update_data)

        logger.info(f"Updated profile for user ID: {user_id}")

        # Return with computed fields
        return await self.get_profile_by_user_id(user_id)
