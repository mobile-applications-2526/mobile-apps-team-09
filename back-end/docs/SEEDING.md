# 🌱 Database Seeding Guide

## ⚠️ IMPORTANT WARNING

**The seeding script will DROP ALL EXISTING DATA and recreate the database from scratch!**

This is designed for development and testing purposes. Every time you run the seed script, it will:

1. 🗑️ Drop all database tables
2. 🔨 Recreate all tables
3. 🌱 Insert fresh seed data

**DO NOT use this in production!**

---

## Overview

This guide explains how the database seeding works in the Plant Management application. Seeding populates your database with initial test data, making it easier to develop and test the application.

## What Gets Seeded?

The seed file (`app/db/seed.py`) creates:

### 👥 **3 Test Users**

1. **Alice** (`alice@plantsense.com` / `alicejohnson123`)

   - Username: `alice`
   - Regular user
   - Has 4 plants

2. **Bob** (`bob@plantsense.com` / `bobsmith123`)

   - Username: `bob`
   - Regular user
   - Has 5 plants

3. **Admin** (`admin@plantsense.com` / `adminuser123`)
   - Username: `admin`
   - Superuser with admin privileges
   - Has 1 plant

### 🌿 **11 Plant Species**

#### Easy Care:

- Golden Pothos
- Snake Plant
- Spider Plant
- Jade Plant
- Aloe Vera

#### Medium Care:

- Monstera Deliciosa
- Peace Lily
- Rubber Plant

#### Hard Care:

- Fiddle Leaf Fig
- Orchid
- Calathea

Each species includes:

- Common and scientific names
- Watering frequency (days between watering)
- Sunlight requirements (hours/day and type)
- Humidity preferences
- Minimum temperature tolerance
- Care difficulty level

### 🪴 **10 Sample Plants**

Plants are distributed among users with:

- Unique names
- Location in the home
- Last watered timestamps
- Associated species information

---

## How to Seed the Database

### ⚠️ Remember: This will delete all existing data!

### Quick Reference by Platform

| Platform           | Command                                             | File           |
| ------------------ | --------------------------------------------------- | -------------- |
| Mac/Linux (Docker) | `./seed.sh`                                         | Shell script   |
| Windows (Docker)   | `seed.bat`                                          | Batch file     |
| All (Docker)       | `docker-compose exec backend python -m app.db.seed` | Direct command |
| All (No Docker)    | `python -m app.db.seed`                             | Direct Python  |

---

### Method 1: Using Platform-Specific Scripts (Docker)

**Mac/Linux:**

```bash
./seed.sh
```

**Windows:**

```bash
seed.bat
```

Both scripts do the same thing - they're just convenient wrappers!

---

### Method 2: Direct Docker Command (All Platforms)

```bash
docker-compose exec backend python -m app.db.seed
```

This works on Mac, Linux, and Windows!

---

### Method 3: Without Docker (Local Development)

**All Platforms:**

```bash
# From the back-end directory
python -m app.db.seed
```

**Requirements:**

- Database is running (PostgreSQL or SQLite)
- Python environment is activated
- Dependencies are installed

---

## How It Works

### 1. **Import Dependencies**

```python
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.plant_species import PlantSpecies
from app.models.plant import Plant
from app.core.security import get_password_hash
```

The seed file imports all necessary models and utilities.

### 2. **Password Hashing**

```python
hashed_password=get_password_hash("alicejohnson123")
```

Uses bcrypt (via passlib) to securely hash passwords. The same method used in production authentication.

**Password Pattern:**

- Format: `{fullname}{123}` (no spaces, all lowercase)
- Example: `alice johnson` → `alicejohnson123`

### 3. **Async Database Operations**

Since your app uses **async SQLAlchemy**, all database operations are asynchronous:

```python
async def seed_data(session: AsyncSession) -> None:
    # Create objects
    user1 = User(email="alice@example.com", ...)
    session.add(user1)

    # Flush to get IDs without committing
    await session.flush()

    # Commit all changes
    await session.commit()
```

**Why `flush()`?**

- Gets database-generated IDs (like auto-increment primary keys)
- Doesn't commit the transaction yet
- Allows you to use those IDs for related records (foreign keys)

### 4. **Automatic Table Dropping and Recreation**

```python
async def init_db() -> None:
    # Drop all tables first
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    # Create fresh tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed data
    await seed_data(session)
```

The `init_db()` function now **automatically drops all tables** before recreating and seeding. This ensures a clean slate every time.

### 5. **Table Creation**

```python
async with engine.begin() as conn:
    await conn.run_sync(Base.metadata.create_all)
```

Creates all tables based on your SQLAlchemy models before seeding.

---

## Key Concepts Explained

### Foreign Keys and Relationships

```python
# First, create and flush users to get their IDs
user1 = User(email="alice@example.com", ...)
session.add(user1)
await session.flush()  # Now user1.id is available

# Then use the ID for foreign key relationships
plant = Plant(
    user_id=user1.id,        # Foreign key to users table
    species_id=species.id,   # Foreign key to plant_species table
    plant_name="Charlie"
)
```

**Order matters!** You must create parent records (users, species) before child records (plants).

### Timezone-Aware Dates

```python
from datetime import datetime, timezone, timedelta

now = datetime.now(timezone.utc)
three_days_ago = now - timedelta(days=3)

plant = Plant(
    last_watered=three_days_ago,  # Stored with timezone info
    ...
)
```

Uses UTC timezone to avoid ambiguity across different server locations.

### Session Management

```python
async with AsyncSessionLocal() as session:
    try:
        await seed_data(session)
        # session.commit() is called in seed_data()
    except Exception as e:
        await session.rollback()  # Undo changes on error
        raise
```

**Transaction safety:**

- If seeding fails, `rollback()` undoes all changes
- Database remains in a consistent state

---

## Advanced Usage

### Understanding the Full Reset Process

Every time you run the seed script, it performs a complete reset:

```python
# 1. Drop everything
Base.metadata.drop_all()  # ❌ All tables deleted

# 2. Recreate structure
Base.metadata.create_all()  # ✅ Fresh tables created

# 3. Insert data
seed_data()  # 🌱 New data added
```

This ensures:

- ✅ No stale data
- ✅ No foreign key conflicts
- ✅ Clean testing environment
- ✅ Consistent state every time

### Custom Seeding

You can modify `seed_data()` to add your own test data:

```python
# Add more users
user3 = User(
    email="carol@plantsense.com",
    username="carol",
    full_name="carol williams",
    hashed_password=get_password_hash("carolwilliams123"),
    is_active=True,
)
session.add(user3)
await session.flush()

# Add more plant species
species_cactus = PlantSpecies(
    common_name="Barrel Cactus",
    scientific_name="Ferocactus spp.",
    watering_frequency_days=30,
    care_difficulty="easy",
)
session.add(species_cactus)
await session.flush()

# Add plants for new user
plant = Plant(
    user_id=user3.id,
    species_id=species_cactus.id,
    plant_name="Spike",
    location="Desert Room",
)
session.add(plant)
```

---

## Troubleshooting

### "DATABASE_URL is not set"

Make sure your `.env` file has the database connection string:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/dbname
```

### "Import could not be resolved"

This is a linting error. The imports work fine when run in your Docker container where dependencies are installed.

### Want to Keep Existing Data?

The current seed script **always drops all data**. If you want to keep existing data:

1. Comment out the drop tables section in `init_db()`
2. Add logic to check for existing users before seeding

### Foreign Key Constraint Errors

Make sure parent records are created and flushed before creating child records:

```python
# ❌ Wrong - user1.id not available yet
user1 = User(...)
plant = Plant(user_id=user1.id)  # Error!

# ✅ Correct - flush first
user1 = User(...)
session.add(user1)
await session.flush()  # Get ID
plant = Plant(user_id=user1.id)  # Works!
```

---

## Integration with Application Startup

To automatically seed on startup (optional), modify `app/main.py`:

```python
from app.db.seed import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager"""
    # Startup
    setup_logging()
    await init_db()  # ⚠️ This will drop all data on every restart!
    yield
    # Shutdown
```

⚠️ **WARNING:** This will drop and recreate your database **every time the app starts**! Only do this in early development.

---

After seeding, test your data:

### Login as a User

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "alicejohnson123"}'
```

### Login as Admin

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "adminuser123"}'
```

### Get Plants

```bash
curl -X GET "http://localhost:8000/api/v1/plants" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Plant Species

```bash
curl -X GET "http://localhost:8000/api/v1/plant-species"
```

---

## Summary

The seeding system:

- ✅ **Drops all existing data** on every run
- ✅ Uses secure password hashing (bcrypt)
- ✅ Creates realistic test data
- ✅ Uses @plantsense.com email domain
- ✅ Password format: `{fullname}123` (lowercase, no spaces)
- ✅ Handles async operations properly
- ✅ Maintains data integrity with foreign keys
- ✅ Includes comprehensive test scenarios
- ✅ Provides both easy and hard-to-care-for plants

### Quick Reference - Test Accounts

| Username | Email                | Password        | Role  |
| -------- | -------------------- | --------------- | ----- |
| alice    | alice@plantsense.com | alicejohnson123 | User  |
| bob      | bob@plantsense.com   | bobsmith123     | User  |
| admin    | admin@plantsense.com | adminuser123    | Admin |

Now you have a fully functional database with test data to develop against! 🎉

**Remember:** Every time you run the seed script, all your data will be replaced with fresh test data!
