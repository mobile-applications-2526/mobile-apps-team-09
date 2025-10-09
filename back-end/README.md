# FastAPI Backend - Layered Architecture Template

A professional FastAPI backend template using **layered architecture** for mobile applications. This template follows industry best practices and provides a solid foundation for building scalable REST APIs.

> 🚀 **New to this project?** Check out the [Quick Start Guide](docs/QUICKSTART.md) to get up and running in 5 minutes!

## 🏗️ Architecture

This project implements a **3-tier layered architecture**:

```
┌─────────────────────────────────────────┐
│     Presentation Layer (API)            │
│  - REST endpoints                       │
│  - Request/Response handling            │
│  - Data validation (Pydantic schemas)   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Business Logic Layer (Services)     │
│  - Business rules                       │
│  - Data transformation                  │
│  - Authentication & Authorization       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Data Access Layer (Repositories)    │
│  - Database operations (CRUD)           │
│  - Query building                       │
│  - Data persistence                     │
└─────────────────────────────────────────┘
```

## 📁 Project Structure

```
back-end/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Application entry point
│   │
│   ├── api/                    # Presentation Layer
│   │   └── v1/
│   │       ├── endpoints/      # API endpoints
│   │       │   ├── auth.py     # Authentication routes
│   │       │   └── users.py    # User routes
│   │       └── router.py       # Main API router
│   │
│   ├── services/               # Business Logic Layer
│   │   └── user_service.py     # User business logic
│   │
│   ├── repositories/           # Data Access Layer
│   │   ├── base_repository.py  # Base repository with CRUD
│   │   └── user_repository.py  # User data access
│   │
│   ├── models/                 # Database Models
│   │   └── user.py             # User model
│   │
│   ├── schemas/                # Pydantic Schemas
│   │   └── user_schema.py      # User schemas
│   │
│   ├── core/                   # Core Configuration
│   │   ├── config.py           # Settings management
│   │   ├── security.py         # Auth utilities
│   │   ├── logging.py          # Logging setup
│   │   └── dependencies.py     # Dependency injection
│   │
│   ├── db/                     # Database Configuration
│   │   ├── database.py         # DB connection & session
│   │   └── base.py             # Base imports for migrations
│   │
│   ├── middleware/             # Custom Middleware
│   │   ├── error_handler.py    # Global error handling
│   │   └── request_logger.py   # Request logging
│   │
│   └── utils/                  # Utilities
│       ├── validators.py       # Validation functions
│       └── responses.py        # Response helpers
│
├── tests/                      # Test Suite
│   ├── conftest.py            # Pytest configuration
│   ├── test_auth.py           # Authentication tests
│   ├── test_users.py          # User endpoint tests
│   └── test_health.py         # Health check tests
│
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # Architecture guide
│   ├── QUICKSTART.md          # Quick start guide
│   └── CONTRIBUTING.md        # Contributing guidelines
│
├── requirements.txt            # Python dependencies
├── .gitignore                 # Git ignore rules
├── pytest.ini                 # Pytest configuration
└── README.md                  # This file
```

## 🚀 Getting Started

> 👥 **Team Members**: See the [Team Setup Guide](docs/SETUP.md) for detailed instructions on getting your development environment ready!

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Virtual environment (recommended)
- Docker Desktop (optional but recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd back-end
   ```

2. **Set up your environment file**

   ```bash
   # Copy the template
   cp env.example .env

   # Generate a secret key
   openssl rand -hex 32

   # Edit .env and update SECRET_KEY and passwords
   ```

3. **Create and activate virtual environment**

   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate on macOS/Linux
   source venv/bin/activate

   # Activate on Windows
   venv\Scripts\activate
   ```

4. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**

   ```bash
   # Option 1: Using uvicorn directly
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

   # Option 2: Using Python
   python -m app.main

   # Or using Docker
   docker-compose up -d
   ```

6. **Access the API**
   - API Documentation: http://localhost:8000/api/docs
   - Alternative Docs: http://localhost:8000/api/redoc
   - Health Check: http://localhost:8000/health
   - pgAdmin (if using Docker): http://localhost:5050

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run tests in verbose mode
pytest -v
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint                | Description         | Auth Required |
| ------ | ----------------------- | ------------------- | ------------- |
| POST   | `/api/v1/auth/register` | Register new user   | No            |
| POST   | `/api/v1/auth/login`    | Login and get token | No            |

### Users

| Method | Endpoint             | Description      | Auth Required |
| ------ | -------------------- | ---------------- | ------------- |
| GET    | `/api/v1/users/me`   | Get current user | Yes           |
| GET    | `/api/v1/users/`     | Get all users    | Yes           |
| GET    | `/api/v1/users/{id}` | Get user by ID   | Yes           |
| PUT    | `/api/v1/users/{id}` | Update user      | Yes           |
| DELETE | `/api/v1/users/{id}` | Delete user      | Yes (Admin)   |

### Health

| Method | Endpoint  | Description  | Auth Required |
| ------ | --------- | ------------ | ------------- |
| GET    | `/health` | Health check | No            |

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

### Getting a Token

1. Register a new user:

   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "username": "testuser",
       "password": "SecurePass123",
       "full_name": "Test User"
     }'
   ```

2. Login to get token:

   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "password": "SecurePass123"
     }'
   ```

3. Use the token in requests:
   ```bash
   curl -X GET "http://localhost:8000/api/v1/users/me" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

## 🗄️ Database

### Default Database (Development)

The project uses **SQLite** by default for easy development. The database file (`app.db`) is created automatically on first run.

### Using PostgreSQL (Production)

1. Install PostgreSQL and create a database

2. Update `.env`:

   ```env
   DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/dbname
   ```

3. The tables will be created automatically on startup

### Database Migrations (Optional)

To use Alembic for database migrations:

```bash
# Initialize Alembic (already configured)
alembic init alembic

# Create a migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 🏛️ Layered Architecture Explained

### 1. **Presentation Layer** (`app/api/`)

- **Responsibility**: Handle HTTP requests/responses
- **Components**:
  - API endpoints (routes)
  - Request validation (Pydantic schemas)
  - Response formatting
- **Example**: `app/api/v1/endpoints/users.py`

### 2. **Business Logic Layer** (`app/services/`)

- **Responsibility**: Business rules and logic
- **Components**:
  - Service classes
  - Business validations
  - Data transformations
  - Authentication logic
- **Example**: `app/services/user_service.py`

### 3. **Data Access Layer** (`app/repositories/`)

- **Responsibility**: Database operations
- **Components**:
  - Repository classes
  - CRUD operations
  - Query building
  - Data persistence
- **Example**: `app/repositories/user_repository.py`

### Benefits of This Architecture

✅ **Separation of Concerns**: Each layer has a single responsibility  
✅ **Testability**: Easy to test each layer independently  
✅ **Maintainability**: Changes in one layer don't affect others  
✅ **Scalability**: Easy to add new features and endpoints  
✅ **Reusability**: Business logic can be reused across endpoints

## 🔧 Configuration

Configuration is managed through environment variables using Pydantic Settings.

All settings are in `app/core/config.py` and can be overridden via `.env` file.

## 📝 Adding New Features

### 1. Create a New Model

```python
# app/models/item.py
from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
```

### 2. Create Schemas

```python
# app/schemas/item_schema.py
from pydantic import BaseModel

class ItemCreate(BaseModel):
    name: str
    description: str

class ItemResponse(ItemCreate):
    id: int

    class Config:
        from_attributes = True
```

### 3. Create Repository

```python
# app/repositories/item_repository.py
from app.repositories.base_repository import BaseRepository
from app.models.item import Item

class ItemRepository(BaseRepository[Item]):
    def __init__(self, session):
        super().__init__(Item, session)
```

### 4. Create Service

```python
# app/services/item_service.py
from app.repositories.item_repository import ItemRepository

class ItemService:
    def __init__(self, repository: ItemRepository):
        self.repository = repository

    async def create_item(self, item_data):
        return await self.repository.create(**item_data.dict())
```

### 5. Create Endpoints

```python
# app/api/v1/endpoints/items.py
from fastapi import APIRouter, Depends
from app.services.item_service import ItemService

router = APIRouter()

@router.post("/", response_model=ItemResponse)
async def create_item(
    item: ItemCreate,
    service: ItemService = Depends(get_item_service)
):
    return await service.create_item(item)
```

### 6. Register Router

```python
# app/api/v1/router.py
from app.api.v1.endpoints import items

api_router.include_router(items.router, prefix="/items", tags=["Items"])
```

## 🛡️ Security Best Practices

- ✅ Passwords are hashed using bcrypt
- ✅ JWT tokens for authentication
- ✅ Environment variables for sensitive data
- ✅ CORS configured
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ Input validation (Pydantic)
- ✅ Error handling middleware

## 📊 Logging

Logs are configured in `app/core/logging.py`:

```python
from app.core.logging import get_logger

logger = get_logger(__name__)
logger.info("This is an info message")
logger.error("This is an error message")
```

## 🚀 Deployment

### Using Docker (Recommended)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using Gunicorn + Uvicorn

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 📖 Documentation

### Project Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in 5 minutes
- **[Architecture Guide](docs/ARCHITECTURE.md)** - Deep dive into the layered architecture
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute to the project

### External Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Layered Architecture Pattern](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)

## 🤝 Contributing

This is a template project for interns. See the [Contributing Guide](docs/CONTRIBUTING.md) for detailed instructions.

Quick tips:

- Follow the layered architecture pattern
- Write tests for new features
- Add docstrings to your code
- Use meaningful commit messages

## 📄 License

This template is provided as-is for educational purposes.

---

**Happy Coding! 🚀**

For questions or support, please reach out to your team lead or senior developers.
