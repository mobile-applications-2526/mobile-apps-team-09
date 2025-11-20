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
from app.models.diagnosis import Diagnosis
from app.models.profile import Profile
from app.models.activity import Activity, ActivityType
from app.core.security import get_password_hash
from app.core.logging import get_logger

logger = get_logger(__name__)


async def seed_data(session: AsyncSession) -> None:
    """
    Seed the database with initial test data

    This function creates:
    - 4 users (3 personas + 1 test user + 1 admin)
    - User profiles for all users
    - Multiple plant species with care information
    - Sample plants assigned to users
    - Sample diagnoses for plants

    Personas:
    - Emma: 17-year-old student with bedroom plant sanctuary
    - David: 37-year-old AI engineer with office plants
    - Margaret: 70-year-old experienced gardener with large collection

    Args:
        session: AsyncSession instance for database operations
    """
    # ==================== CREATE USERS ====================

    # Persona 1: Emma - The Plant Enthusiast Student
    emma = User(
        email="emma@plantsense.com",
        username="emma",
        full_name="Emma Thompson",
        hashed_password=get_password_hash("emma1234"),
        is_active=True,
        is_superuser=False,
    )

    # Persona 2: David - The Busy Professional
    david = User(
        email="david@plantsense.com",
        username="david",
        full_name="David Chen",
        hashed_password=get_password_hash("david123"),
        is_active=True,
        is_superuser=False,
    )

    # Persona 3: Margaret - The Experienced Gardener
    margaret = User(
        email="margaret@plantsense.com",
        username="margaret",
        full_name="Margaret Williams",
        hashed_password=get_password_hash("margaret123"),
        is_active=True,
        is_superuser=False,
    )

    # Test User
    test = User(
        email="test@plantsense.com",
        username="test",
        full_name="Test User",
        hashed_password=get_password_hash("test1234"),
        is_active=True,
        is_superuser=False,
    )

    # Admin User
    admin_user = User(
        email="admin@plantsense.com",
        username="admin",
        full_name="Admin User",
        hashed_password=get_password_hash("admin123"),
        is_active=True,
        is_superuser=True,
    )

    session.add_all([emma, david, margaret, test, admin_user])

    await session.flush()

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

    now = datetime.now(timezone.utc)
    now_naive = datetime.utcnow()
    three_days_ago = now - timedelta(days=3)
    five_days_ago = now - timedelta(days=5)
    ten_days_ago = now - timedelta(days=10)
    two_weeks_ago = now - timedelta(days=14)

    # Emma's plants - 8 plants (bedroom sanctuary, social media worthy)
    plant_emma_1 = Plant(
        user_id=emma.id,
        species_id=species_pothos.id,
        plant_name="Bella",
        location="Bedroom Window",
        last_watered=three_days_ago,
        image_url="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_emma_2 = Plant(
        user_id=emma.id,
        species_id=species_monstera.id,
        plant_name="Monty",
        location="Bedroom Corner",
        last_watered=now - timedelta(days=8),  # Forgot during exams
        image_url="https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_emma_3 = Plant(
        user_id=emma.id,
        species_id=species_spider.id,
        plant_name="Spidey",
        location="Bedroom Shelf",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_emma_4 = Plant(
        user_id=emma.id,
        species_id=species_succulent.id,
        plant_name="Tiny",
        location="Bedroom Desk",
        last_watered=ten_days_ago,
        image_url="https://images.pexels.com/photos/2132240/pexels-photo-2132240.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_emma_5 = Plant(
        user_id=emma.id,
        species_id=species_aloe.id,
        plant_name="Aloe There",
        location="Bedroom Windowsill",
        last_watered=two_weeks_ago,
        image_url="https://images.pexels.com/photos/3577378/pexels-photo-3577378.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_emma_6 = Plant(
        user_id=emma.id,
        species_id=species_snake.id,
        plant_name="Snakey",
        location="Bedroom Nightstand",
        last_watered=now - timedelta(days=12),
        image_url="https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_emma_7 = Plant(
        user_id=emma.id,
        species_id=species_peace_lily.id,
        plant_name="Lily",
        location="Bedroom Dresser",
        last_watered=three_days_ago,
        image_url="https://images.pexels.com/photos/4751268/pexels-photo-4751268.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_emma_8 = Plant(
        user_id=emma.id,
        species_id=species_calathea.id,
        plant_name="Cali",
        location="Bedroom Hanging Planter",
        last_watered=now - timedelta(days=6),
        image_url="https://images.pexels.com/photos/6492398/pexels-photo-6492398.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    # David's plants - 3 low-maintenance office plants
    plant_david_1 = Plant(
        user_id=david.id,
        species_id=species_snake.id,
        plant_name="Office Snake",
        location="Office Desk",
        last_watered=now - timedelta(days=16),  # Forgot due to work
        image_url="https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_david_2 = Plant(
        user_id=david.id,
        species_id=species_pothos.id,
        plant_name="Desk Buddy",
        location="Office Shelf",
        last_watered=now - timedelta(days=9),  # Busy deadline week
        image_url="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_david_3 = Plant(
        user_id=david.id,
        species_id=species_succulent.id,
        plant_name="Little Guy",
        location="Office Window",
        last_watered=now - timedelta(days=18),  # Travel for work
        image_url="https://images.pexels.com/photos/2132240/pexels-photo-2132240.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    # Margaret's plants - 12 plants (representing her extensive 50+ collection)
    plant_margaret_1 = Plant(
        user_id=margaret.id,
        species_id=species_orchid.id,
        plant_name="Purple Orchid",
        location="Garden Greenhouse",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_2 = Plant(
        user_id=margaret.id,
        species_id=species_fiddle.id,
        plant_name="Fig Tree",
        location="Living Room",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_3 = Plant(
        user_id=margaret.id,
        species_id=species_rubber.id,
        plant_name="Rubber Beauty",
        location="Sunroom",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_4 = Plant(
        user_id=margaret.id,
        species_id=species_monstera.id,
        plant_name="Monstera Mama",
        location="Garden Entrance",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_5 = Plant(
        user_id=margaret.id,
        species_id=species_peace_lily.id,
        plant_name="Peace Lily #1",
        location="Front Garden",
        last_watered=three_days_ago,
        image_url="https://images.pexels.com/photos/4751268/pexels-photo-4751268.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_6 = Plant(
        user_id=margaret.id,
        species_id=species_peace_lily.id,
        plant_name="Peace Lily #2",
        location="Back Garden",
        last_watered=three_days_ago,
        image_url="https://images.pexels.com/photos/4751268/pexels-photo-4751268.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_7 = Plant(
        user_id=margaret.id,
        species_id=species_calathea.id,
        plant_name="Calathea Collection",
        location="Indoor Display",
        last_watered=three_days_ago,
        image_url="https://images.pexels.com/photos/6492398/pexels-photo-6492398.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_8 = Plant(
        user_id=margaret.id,
        species_id=species_spider.id,
        plant_name="Spider Mama",
        location="Kitchen Window",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_9 = Plant(
        user_id=margaret.id,
        species_id=species_aloe.id,
        plant_name="Aloe Vera Garden",
        location="Outdoor Herb Garden",
        last_watered=now - timedelta(days=20),
        image_url="https://images.pexels.com/photos/3577378/pexels-photo-3577378.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_10 = Plant(
        user_id=margaret.id,
        species_id=species_succulent.id,
        plant_name="Jade Collection",
        location="Greenhouse Shelf",
        last_watered=ten_days_ago,
        image_url="https://images.pexels.com/photos/2132240/pexels-photo-2132240.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_11 = Plant(
        user_id=margaret.id,
        species_id=species_pothos.id,
        plant_name="Golden Pothos",
        location="Hanging Basket - Porch",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    plant_margaret_12 = Plant(
        user_id=margaret.id,
        species_id=species_snake.id,
        plant_name="Snake Plant Collection",
        location="Indoor Garden Room",
        last_watered=ten_days_ago,
        image_url="https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    # Admin's test plant
    plant_admin_1 = Plant(
        user_id=admin_user.id,
        species_id=species_orchid.id,
        plant_name="Test Orchid",
        location="Office",
        last_watered=five_days_ago,
        image_url="https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
    )

    session.add_all(
        [
            # Emma's 8 plants
            plant_emma_1, plant_emma_2, plant_emma_3, plant_emma_4,
            plant_emma_5, plant_emma_6, plant_emma_7, plant_emma_8,
            # David's 3 plants
            plant_david_1, plant_david_2, plant_david_3,
            # Margaret's 12 plants
            plant_margaret_1, plant_margaret_2, plant_margaret_3, plant_margaret_4,
            plant_margaret_5, plant_margaret_6, plant_margaret_7, plant_margaret_8,
            plant_margaret_9, plant_margaret_10, plant_margaret_11, plant_margaret_12,
            # Admin's 1 plant
            plant_admin_1,
        ]
    )

    await session.flush()

    # ==================== CREATE DIAGNOSES ====================
    diagnosis_emma_1 = Diagnosis(
        user_id=emma.id,
        plant_id=plant_emma_1.id,
        plant_common_name=species_pothos.common_name,
        issue_detected="Root Rot",
        confidence_score=0.85,
        severity="moderate",
        recommendation="Reduce watering, repot in dry soil.",
        image_url=plant_emma_1.image_url,
        created_at=datetime.utcnow() - timedelta(days=2),
    )
    diagnosis_david_1 = Diagnosis(
        user_id=david.id,
        plant_id=plant_david_1.id,
        plant_common_name=species_snake.common_name,
        issue_detected="Leaf Yellowing",
        confidence_score=0.90,
        severity="mild",
        recommendation="Increase sunlight, check for pests.",
        image_url=plant_david_1.image_url,
        created_at=datetime.utcnow() - timedelta(days=3),
    )
    diagnosis_margaret_1 = Diagnosis(
        user_id=margaret.id,
        plant_id=plant_margaret_1.id,
        plant_common_name=species_orchid.common_name,
        issue_detected="Fungal Spots",
        confidence_score=0.92,
        severity="severe",
        recommendation="Remove affected leaves, apply fungicide.",
        image_url=plant_margaret_1.image_url,
        created_at=datetime.utcnow() - timedelta(days=1),
    )
    session.add_all([diagnosis_emma_1, diagnosis_david_1, diagnosis_margaret_1])
    await session.flush()

    # ==================== CREATE ACTIVITIES ====================

    # Emma activities

    from app.services.activity_service import get_activity_title

    activity_emma_plant_added = Activity(
        user_id=emma.id,
        plant_id=plant_emma_1.id,
        activity_type=ActivityType.PLANT_ADDED,
        title=get_activity_title(ActivityType.PLANT_ADDED),
        created_at=plant_emma_1.acquired_date or (datetime.utcnow() - timedelta(days=30)),
    )
    activity_emma_watered = Activity(
        user_id=emma.id,
        plant_id=plant_emma_1.id,
        activity_type=ActivityType.WATERED,
        title=get_activity_title(ActivityType.WATERED, plant_emma_1.plant_name),
        created_at=plant_emma_1.last_watered,
    )
    activity_emma_diagnosis = Activity(
        user_id=emma.id,
        plant_id=plant_emma_1.id,
        diagnosis_id=diagnosis_emma_1.id,
        activity_type=ActivityType.DIAGNOSIS,
        title=get_activity_title(ActivityType.DIAGNOSIS),
        created_at=diagnosis_emma_1.created_at,
    )

    # David activities

    activity_david_plant_added = Activity(
        user_id=david.id,
        plant_id=plant_david_1.id,
        activity_type=ActivityType.PLANT_ADDED,
        title=get_activity_title(ActivityType.PLANT_ADDED),
        created_at=plant_david_1.acquired_date or (datetime.utcnow() - timedelta(days=30)),
    )
    activity_david_watered = Activity(
        user_id=david.id,
        plant_id=plant_david_1.id,
        activity_type=ActivityType.WATERED,
        title=get_activity_title(ActivityType.WATERED, plant_david_1.plant_name),
        created_at=plant_david_1.last_watered,
    )
    activity_david_diagnosis = Activity(
        user_id=david.id,
        plant_id=plant_david_1.id,
        diagnosis_id=diagnosis_david_1.id,
        activity_type=ActivityType.DIAGNOSIS,
        title=get_activity_title(ActivityType.DIAGNOSIS),
        created_at=diagnosis_david_1.created_at,
    )

    # Margaret activities

    activity_margaret_plant_added = Activity(
        user_id=margaret.id,
        plant_id=plant_margaret_1.id,
        activity_type=ActivityType.PLANT_ADDED,
        title=get_activity_title(ActivityType.PLANT_ADDED),
        created_at=plant_margaret_1.acquired_date or (datetime.utcnow() - timedelta(days=30)),
    )
    activity_margaret_watered = Activity(
        user_id=margaret.id,
        plant_id=plant_margaret_1.id,
        activity_type=ActivityType.WATERED,
        title=get_activity_title(ActivityType.WATERED, plant_margaret_1.plant_name),
        created_at=plant_margaret_1.last_watered,
    )
    activity_margaret_diagnosis = Activity(
        user_id=margaret.id,
        plant_id=plant_margaret_1.id,
        diagnosis_id=diagnosis_margaret_1.id,
        activity_type=ActivityType.DIAGNOSIS,
        title=get_activity_title(ActivityType.DIAGNOSIS),
        created_at=diagnosis_margaret_1.created_at,
    )

    session.add_all([
        activity_emma_plant_added, activity_emma_watered, activity_emma_diagnosis,
        activity_david_plant_added, activity_david_watered, activity_david_diagnosis,
        activity_margaret_plant_added, activity_margaret_watered, activity_margaret_diagnosis,
    ])
    await session.flush()

    # ==================== CREATE PROFILES ====================

    # Calculate experience start dates
    from datetime import date
    from dateutil.relativedelta import relativedelta

    today = date.today()

    # Emma's Profile - 17-year-old student (started 6 months ago)
    profile_emma = Profile(
        user_id=emma.id,
        tagline="Student in Training 🌱",
        age=17,
        living_situation="Bedroom in Parents' House",
        experience_level="Beginner",
        experience_start_date=today - relativedelta(months=6),  # 6 months ago
    )

    # David's Profile - 37-year-old AI engineer (started 3 months ago)
    profile_david = Profile(
        user_id=david.id,
        tagline="Busy Professional",
        age=37,
        living_situation="Apartment",
        experience_level="Beginner",
        experience_start_date=today - relativedelta(months=3),  # 3 months ago
    )

    # Margaret's Profile - 70-year-old experienced gardener (started 40 years ago)
    profile_margaret = Profile(
        user_id=margaret.id,
        tagline="Master Gardener & Plant Seller",
        age=70,
        living_situation="House with Large Garden",
        experience_level="Expert",
        experience_start_date=today - relativedelta(years=40),  # 40 years ago
    )

    # Test Profile (started 1 year 2 months ago)
    # profile_test = Profile(
    #     user_id=test.id,
    #     tagline="Plant Enthusiast 🌱",
    #     age=25,
    #     living_situation="Apartment",
    #     experience_level="Intermediate",
    #     experience_start_date=today - relativedelta(years=1, months=2),  # 1 year 2 months ago
    # )

    # Admin Profile (started 10 years ago)
    profile_admin = Profile(
        user_id=admin_user.id,
        tagline="System Administrator",
        age=30,
        living_situation="Office",
        experience_level="Expert",
        experience_start_date=today - relativedelta(years=10),  # 10 years ago
        
    )

    session.add_all([profile_emma, profile_david, profile_margaret, profile_admin])
    await session.flush()


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

    # Drop all tables
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
            await session.commit()
            logger.info("Database seeded successfully")
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
