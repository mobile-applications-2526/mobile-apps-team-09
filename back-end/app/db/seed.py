"""
Database seeding utilities
This module provides functions to populate the database with initial/test data
"""

from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import Base, engine, AsyncSessionLocal
from app.models.user import User
from app.models.plant_species import PlantSpecies
from app.models.plant import Plant
from app.core.security import get_password_hash
from app.core.logging import get_logger

logger = get_logger(__name__)


async def seed_data(session: AsyncSession) -> None:
    """
    Seed the database with initial test data

    This function creates:
    - 3 test users (including 1 admin)
    - Multiple plant species with care information
    - Sample plants assigned to users

    Args:
        session: AsyncSession instance for database operations
    """
    # ==================== CREATE USERS ====================

    user1 = User(
        email="alice@plantsense.com",
        username="alice",
        full_name="alice johnson",
        hashed_password=get_password_hash("alicejohnson123"),
        is_active=True,
        is_superuser=False,
    )

    user2 = User(
        email="bob@plantsense.com",
        username="bob",
        full_name="bob smith",
        hashed_password=get_password_hash("bobsmith123"),
        is_active=True,
        is_superuser=False,
    )

    user3 = User(
        email="test@plantsense.com",
        username="test",
        full_name="test test",
        hashed_password=get_password_hash("test"),
        is_active=True,
        is_superuser=False,
    )

    admin_user = User(
        email="admin@plantsense.com",
        username="admin",
        full_name="admin user",
        hashed_password=get_password_hash("adminuser123"),
        is_active=True,
        is_superuser=True,
    )

    session.add_all([user1, user2, user3, admin_user])
    await session.flush()  # Flush to get IDs assigned

    # ==================== CREATE PLANT SPECIES ====================

    # Easy care plants
    species_pothos = PlantSpecies(
        common_name="Golden Pothos",
        scientific_name="Epipremnum aureum",
        watering_frequency_days=7,
        sunlight_hours_needed=4.0,
        sunlight_type="indirect",
        humidity_preference="medium",
        temperature_min=15.0,
        care_difficulty="easy",
    )

    species_snake = PlantSpecies(
        common_name="Snake Plant",
        scientific_name="Sansevieria trifasciata",
        watering_frequency_days=14,
        sunlight_hours_needed=2.0,
        sunlight_type="low to bright indirect",
        humidity_preference="low",
        temperature_min=10.0,
        care_difficulty="easy",
    )

    species_spider = PlantSpecies(
        common_name="Spider Plant",
        scientific_name="Chlorophytum comosum",
        watering_frequency_days=7,
        sunlight_hours_needed=6.0,
        sunlight_type="bright indirect",
        humidity_preference="medium",
        temperature_min=12.0,
        care_difficulty="easy",
    )

    # Medium care plants
    species_monstera = PlantSpecies(
        common_name="Monstera Deliciosa",
        scientific_name="Monstera deliciosa",
        watering_frequency_days=7,
        sunlight_hours_needed=6.0,
        sunlight_type="bright indirect",
        humidity_preference="high",
        temperature_min=18.0,
        care_difficulty="medium",
    )

    species_peace_lily = PlantSpecies(
        common_name="Peace Lily",
        scientific_name="Spathiphyllum wallisii",
        watering_frequency_days=5,
        sunlight_hours_needed=4.0,
        sunlight_type="low to medium indirect",
        humidity_preference="high",
        temperature_min=16.0,
        care_difficulty="medium",
    )

    species_rubber = PlantSpecies(
        common_name="Rubber Plant",
        scientific_name="Ficus elastica",
        watering_frequency_days=7,
        sunlight_hours_needed=6.0,
        sunlight_type="bright indirect",
        humidity_preference="medium",
        temperature_min=15.0,
        care_difficulty="medium",
    )

    # Hard care plants
    species_fiddle = PlantSpecies(
        common_name="Fiddle Leaf Fig",
        scientific_name="Ficus lyrata",
        watering_frequency_days=7,
        sunlight_hours_needed=8.0,
        sunlight_type="bright indirect",
        humidity_preference="medium",
        temperature_min=18.0,
        care_difficulty="hard",
    )

    species_orchid = PlantSpecies(
        common_name="Orchid",
        scientific_name="Phalaenopsis spp.",
        watering_frequency_days=7,
        sunlight_hours_needed=6.0,
        sunlight_type="bright indirect",
        humidity_preference="high",
        temperature_min=16.0,
        care_difficulty="hard",
    )

    species_calathea = PlantSpecies(
        common_name="Calathea",
        scientific_name="Calathea ornata",
        watering_frequency_days=5,
        sunlight_hours_needed=4.0,
        sunlight_type="low to medium indirect",
        humidity_preference="high",
        temperature_min=18.0,
        care_difficulty="hard",
    )

    # Succulents
    species_succulent = PlantSpecies(
        common_name="Jade Plant",
        scientific_name="Crassula ovata",
        watering_frequency_days=14,
        sunlight_hours_needed=6.0,
        sunlight_type="bright direct",
        humidity_preference="low",
        temperature_min=10.0,
        care_difficulty="easy",
    )

    species_aloe = PlantSpecies(
        common_name="Aloe Vera",
        scientific_name="Aloe barbadensis miller",
        watering_frequency_days=21,
        sunlight_hours_needed=8.0,
        sunlight_type="bright direct",
        humidity_preference="low",
        temperature_min=10.0,
        care_difficulty="easy",
    )

    session.add_all(
        [
            species_pothos,
            species_snake,
            species_spider,
            species_monstera,
            species_peace_lily,
            species_rubber,
            species_fiddle,
            species_orchid,
            species_calathea,
            species_succulent,
            species_aloe,
        ]
    )
    await session.flush()

    # ==================== CREATE PLANTS ====================

    # Calculate dates
    now = datetime.now(timezone.utc)
    three_days_ago = now - timedelta(days=3)
    five_days_ago = now - timedelta(days=5)
    ten_days_ago = now - timedelta(days=10)

    # Alice's plants
    plant_alice_1 = Plant(
        user_id=user1.id,
        species_id=species_pothos.id,
        plant_name="Charlie",
        location="Living Room Window",
        last_watered=three_days_ago,
        image_url="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_alice_2 = Plant(
        user_id=user1.id,
        species_id=species_snake.id,
        plant_name="Sammy",
        location="Bedroom Corner",
        last_watered=ten_days_ago,
        image_url="https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_alice_3 = Plant(
        user_id=user1.id,
        species_id=species_monstera.id,
        plant_name="Monty",
        location="Living Room",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_alice_4 = Plant(
        user_id=user1.id,
        species_id=species_aloe.id,
        plant_name="Allie",
        location="Kitchen Window",
        last_watered=now - timedelta(days=15),
        image_url="https://images.pexels.com/photos/3577378/pexels-photo-3577378.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    # Bob's plants
    plant_bob_1 = Plant(
        user_id=user2.id,
        species_id=species_spider.id,
        plant_name="Spidey",
        location="Office Desk",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_bob_2 = Plant(
        user_id=user2.id,
        species_id=species_peace_lily.id,
        plant_name="Peace",
        location="Bathroom",
        last_watered=three_days_ago,
        image_url="https://images.pexels.com/photos/4751268/pexels-photo-4751268.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_bob_3 = Plant(
        user_id=user2.id,
        species_id=species_rubber.id,
        plant_name="Ruby",
        location="Hallway",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_bob_4 = Plant(
        user_id=user2.id,
        species_id=species_succulent.id,
        plant_name="Jade",
        location="Office Window",
        last_watered=ten_days_ago,
        image_url="https://images.pexels.com/photos/2132240/pexels-photo-2132240.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_bob_5 = Plant(
        user_id=user2.id,
        species_id=species_fiddle.id,
        plant_name="Fiddles",
        location="Living Room",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    # Admin's plant (for testing)
    plant_admin_1 = Plant(
        user_id=admin_user.id,
        species_id=species_orchid.id,
        plant_name="Orchie",
        location="Office",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    session.add_all(
        [
            plant_alice_1,
            plant_alice_2,
            plant_alice_3,
            plant_alice_4,
            plant_bob_1,
            plant_bob_2,
            plant_bob_3,
            plant_bob_4,
            plant_bob_5,
            plant_admin_1,
        ]
    )

    await session.flush()

    # Commit all changes
    await session.commit()
    logger.info("Database seeded successfully")


async def init_db() -> None:
    """
    Initialize the database by dropping all tables, recreating them, and seeding data

    âš ï¸  WARNING: This will DROP ALL EXISTING DATA!

    This function:
    1. Drops all existing database tables
    2. Creates all database tables based on models
    3. Seeds fresh initial data
    """
    logger.info("Dropping all tables...")

    # Drop all tables first
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Tables recreated")

    # Seed initial data
    async with AsyncSessionLocal() as session:
        try:
            await seed_data(session)
        except Exception as e:
            logger.error(f"Error during seeding: {e}")
            await session.rollback()
            raise


# ==================== MAIN EXECUTION ====================
if __name__ == "__main__":
    """
    Run this file directly to seed the database

    ⚠️  WARNING: This will drop all existing data and reseed!

    Usage:
        python -m app.db.seed
    """
    import asyncio

    asyncio.run(init_db())
