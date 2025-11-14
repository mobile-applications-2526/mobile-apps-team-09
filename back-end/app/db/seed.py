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

    now = datetime.now(timezone.utc)
    now_naive = datetime.utcnow()
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

    # ==================== CREATE DIAGNOSES ====================

    # Diagnosis 1: Leaf Spot Disease for Charlie (Pothos)
    diagnosis_1 = Diagnosis(
        plant_id=plant_alice_1.id,
        issue_detected="Leaf Spot Disease",
        confidence_score=0.87,
        severity="Medium Severity",
        recommendation="Remove affected leaves immediately to prevent spread. Reduce watering frequency and ensure proper air circulation. Apply a fungicide spray every 7-10 days for 3 weeks. Keep the plant in a well-ventilated area and avoid getting water on the leaves.",
        image_url="https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Reduce to once every 5-7 days",
        recovery_sunlight="Indirect bright light, 4-6 hours",
        recovery_air_circulation="Ensure good ventilation",
        recovery_temperature="Keep between 65-75°F",
        created_at=now_naive - timedelta(hours=2),
    )

    # Diagnosis 2: Root Rot for Sammy (Snake Plant)
    diagnosis_2 = Diagnosis(
        plant_id=plant_alice_2.id,
        issue_detected="Root Rot",
        confidence_score=0.92,
        severity="High Severity",
        recommendation="Immediately remove plant from soil and trim all black/mushy roots with sterile scissors. Repot in fresh, well-draining soil mix. Reduce watering to once every 3-4 weeks. Ensure pot has drainage holes. Place in bright indirect light to help recovery.",
        image_url="https://images.pexels.com/photos/7728080/pexels-photo-7728080.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Once every 3-4 weeks only",
        recovery_sunlight="Bright indirect light, 6-8 hours",
        recovery_air_circulation="Good airflow around pot",
        recovery_temperature="Maintain 60-85°F",
        created_at=now_naive - timedelta(days=1),
    )

    # Diagnosis 3: Powdery Mildew for Monty (Monstera)
    diagnosis_3 = Diagnosis(
        plant_id=plant_alice_3.id,
        issue_detected="Powdery Mildew",
        confidence_score=0.78,
        severity="Low Severity",
        recommendation="Improve air circulation around the plant. Remove affected leaves. Spray with a mixture of 1 tablespoon baking soda and 1 teaspoon dish soap in 1 gallon of water. Apply weekly for 3 weeks. Reduce humidity if possible and avoid overhead watering.",
        image_url="https://images.pexels.com/photos/6492398/pexels-photo-6492398.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        created_at=now_naive - timedelta(days=2),
    )

    # Diagnosis 4: Spider Mites for Spidey (Spider Plant) - BOB
    diagnosis_4 = Diagnosis(
        plant_id=plant_bob_1.id,
        issue_detected="Spider Mites Infestation",
        confidence_score=0.95,
        severity="High Severity",
        recommendation="Isolate plant immediately from other plants. Spray entire plant with insecticidal soap or neem oil solution. Pay special attention to undersides of leaves. Repeat treatment every 3 days for 2 weeks. Increase humidity around plant. Check other nearby plants for infestation.",
        image_url="https://images.pexels.com/photos/7084309/pexels-photo-7084309.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Normal schedule after treatment",
        recovery_sunlight="Bright indirect light, 6 hours",
        recovery_air_circulation="Good ventilation essential",
        recovery_temperature="Keep between 60-75°F",
        created_at=now_naive - timedelta(hours=5),
    )

    # Diagnosis 5: Nutrient Deficiency for Peace (Peace Lily) - BOB
    diagnosis_5 = Diagnosis(
        plant_id=plant_bob_2.id,
        issue_detected="Nitrogen Deficiency",
        confidence_score=0.81,
        severity="Medium Severity",
        recommendation="Apply balanced liquid fertilizer (10-10-10 NPK) at half strength every 2 weeks during growing season. Yellowing should improve within 3-4 weeks. Ensure proper watering schedule. Consider repotting in fresh potting mix if plant hasn't been repotted in over a year.",
        image_url="https://images.pexels.com/photos/6208511/pexels-photo-6208511.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Consistent moisture, check daily",
        recovery_sunlight="Medium indirect light, 4-6 hours",
        recovery_air_circulation="Moderate ventilation",
        recovery_temperature="Keep between 65-80°F",
        created_at=now_naive - timedelta(hours=8),
    )

    # Diagnosis 6: Sunburn for Ruby (Rubber Plant) - BOB
    diagnosis_6 = Diagnosis(
        plant_id=plant_bob_3.id,
        issue_detected="Sunburn / Leaf Scorch",
        confidence_score=0.89,
        severity="Low Severity",
        recommendation="Move plant away from direct sunlight to bright indirect light location. Remove severely damaged leaves. Monitor new growth for proper coloring. Water consistently to help plant recover. New growth should return to normal color within 2-3 weeks.",
        image_url="https://images.pexels.com/photos/7084301/pexels-photo-7084301.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Regular watering, weekly",
        recovery_sunlight="Bright indirect only, 6 hours",
        recovery_air_circulation="Normal room ventilation",
        recovery_temperature="Keep between 60-75°F",
        created_at=now_naive - timedelta(days=3),
    )

    # Diagnosis 7: Overwatering for Jade (Succulent) - BOB
    diagnosis_7 = Diagnosis(
        plant_id=plant_bob_4.id,
        issue_detected="Overwatering Damage",
        confidence_score=0.84,
        severity="Medium Severity",
        recommendation="Stop watering immediately. Allow soil to dry out completely. Check for root rot by gently removing plant from pot. If roots are mushy, trim them and repot in fresh cactus/succulent soil mix. Water only when soil is completely dry, approximately every 2-3 weeks.",
        image_url="https://images.pexels.com/photos/5699665/pexels-photo-5699665.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Every 2-3 weeks when dry",
        recovery_sunlight="Bright direct light, 6-8 hours",
        recovery_air_circulation="Good airflow to dry soil",
        recovery_temperature="Keep above 55°F",
        created_at=now_naive - timedelta(hours=12),
    )

    # Diagnosis 8: Bacterial Leaf Spot for Fiddles (Fiddle Leaf Fig) - BOB
    diagnosis_8 = Diagnosis(
        plant_id=plant_bob_5.id,
        issue_detected="Bacterial Leaf Spot",
        confidence_score=0.91,
        severity="High Severity",
        recommendation="Remove all affected leaves immediately using sterile pruning shears. Improve air circulation and reduce humidity. Avoid misting leaves. Water only at soil level, never on leaves. Apply copper-based bactericide as directed. Isolate from other plants. Monitor closely for 2-3 weeks.",
        image_url="https://images.pexels.com/photos/6208345/pexels-photo-6208345.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Bottom watering only, weekly",
        recovery_sunlight="Bright indirect light, 8 hours",
        recovery_air_circulation="Excellent airflow required",
        recovery_temperature="Keep between 65-75°F",
        created_at=now_naive - timedelta(days=1, hours=6),
    )

    # Diagnosis 8b: HEALTHY Spidey (Spider Plant) - BOB's HEALTHY PLANT
    diagnosis_8b = Diagnosis(
        plant_id=plant_bob_1.id,
        issue_detected="No Issues Detected",
        confidence_score=0.94,
        severity="Healthy",
        recommendation="Great news! Your Spider Plant is thriving! Continue your excellent care routine. Spider plants are resilient and yours is showing strong, healthy growth. Keep up the consistent watering and light conditions.",
        image_url="https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Every 5-7 days, keep moist",
        recovery_sunlight="Bright indirect light, 6 hours",
        recovery_air_circulation="Normal room ventilation",
        recovery_temperature="Keep between 60-75°F",
        created_at=now_naive - timedelta(days=5),
    )

    # Diagnosis 9: Scale Insects for Orchie (Orchid)
    diagnosis_9 = Diagnosis(
        plant_id=plant_admin_1.id,
        issue_detected="Scale Insect Infestation",
        confidence_score=0.86,
        severity="Medium Severity",
        recommendation="Remove visible scale insects with cotton swab dipped in rubbing alcohol. Spray entire plant with horticultural oil or insecticidal soap. Repeat treatment weekly for 3-4 weeks. Check all nearby plants. Ensure proper air circulation to prevent future infestations.",
        image_url="https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        created_at=now_naive - timedelta(hours=18),
    )

    # Diagnosis 10: Healthy check for Allie (Aloe) - HEALTHY PLANT EXAMPLE
    diagnosis_10 = Diagnosis(
        plant_id=plant_alice_4.id,
        issue_detected="No Issues Detected",
        confidence_score=0.96,
        severity="Healthy",
        recommendation="Plant is healthy! Continue current care routine. Water every 3 weeks when soil is completely dry. Provide bright indirect to direct sunlight for 6-8 hours daily. Fertilize once in spring and once in summer with diluted succulent fertilizer.",
        image_url="https://images.pexels.com/photos/3577378/pexels-photo-3577378.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        recovery_watering="Every 3 weeks when dry",
        recovery_sunlight="Bright direct light, 6-8 hours",
        recovery_air_circulation="Normal room ventilation",
        recovery_temperature="Keep above 50°F",
        created_at=now_naive - timedelta(days=4),
    )

    # Multiple diagnoses for same plant (Charlie) to show history
    diagnosis_11 = Diagnosis(
        plant_id=plant_alice_1.id,
        issue_detected="Aphid Infestation",
        confidence_score=0.79,
        severity="Low Severity",
        recommendation="Spray plant with strong stream of water to dislodge aphids. Apply neem oil solution weekly for 3 weeks. Introduce beneficial insects like ladybugs if infestation persists. Monitor new growth regularly.",
        image_url="https://images.pexels.com/photos/4622986/pexels-photo-4622986.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1",
        created_at=now_naive - timedelta(days=7),
    )

    session.add_all(
        [
            diagnosis_1,
            diagnosis_2,
            diagnosis_3,
            diagnosis_4,
            diagnosis_5,
            diagnosis_6,
            diagnosis_7,
            diagnosis_8,
            diagnosis_8b,  # Bob's healthy plant
            diagnosis_9,
            diagnosis_10,
            diagnosis_11,
        ]
    )

    # Commit all changes
    await session.commit()
    logger.info("Database seeded successfully with users, plant species, plants, and diagnoses")


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
