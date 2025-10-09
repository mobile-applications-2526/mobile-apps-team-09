# Contributing Guidelines

## For Interns and Team Members

This guide will help you contribute to the project following best practices.

## Getting Started

1. **Clone and setup**

   ```bash
   git clone <repository-url>
   cd back-end
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Adding a New Feature

Follow the layered architecture pattern:

#### Step 1: Create Database Model

```python
# app/models/your_model.py
from sqlalchemy import Column, Integer, String
from app.db.database import Base

class YourModel(Base):
    __tablename__ = "your_table"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
```

#### Step 2: Create Schemas

```python
# app/schemas/your_schema.py
from pydantic import BaseModel

class YourModelCreate(BaseModel):
    name: str

class YourModelResponse(YourModelCreate):
    id: int

    class Config:
        from_attributes = True
```

#### Step 3: Create Repository

```python
# app/repositories/your_repository.py
from app.repositories.base_repository import BaseRepository
from app.models.your_model import YourModel

class YourRepository(BaseRepository[YourModel]):
    def __init__(self, session):
        super().__init__(YourModel, session)

    # Add custom queries here
```

#### Step 4: Create Service

```python
# app/services/your_service.py
from app.repositories.your_repository import YourRepository

class YourService:
    def __init__(self, repository: YourRepository):
        self.repository = repository

    async def create_item(self, data):
        # Add business logic here
        return await self.repository.create(**data.dict())
```

#### Step 5: Create Endpoints

```python
# app/api/v1/endpoints/your_endpoints.py
from fastapi import APIRouter, Depends
from app.services.your_service import YourService

router = APIRouter()

@router.post("/")
async def create_item(
    data: YourModelCreate,
    service: YourService = Depends(get_your_service)
):
    return await service.create_item(data)
```

#### Step 6: Register Router

```python
# app/api/v1/router.py
from app.api.v1.endpoints import your_endpoints

api_router.include_router(
    your_endpoints.router,
    prefix="/your-resource",
    tags=["Your Resource"]
)
```

### 2. Writing Tests

Always write tests for new features:

```python
# tests/test_your_feature.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_item(client: AsyncClient):
    response = await client.post(
        "/api/v1/your-resource/",
        json={"name": "Test Item"}
    )

    assert response.status_code == 201
    assert response.json()["name"] == "Test Item"
```

### 3. Code Style

- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to functions and classes
- Keep functions small and focused

**Example:**

```python
async def create_user(self, user_data: UserCreate) -> User:
    """
    Create a new user

    Args:
        user_data: User creation data

    Returns:
        Created user instance

    Raises:
        HTTPException: If email already exists
    """
    # Implementation
```

## Code Review Checklist

Before submitting a pull request, ensure:

- [ ] Code follows layered architecture
- [ ] All tests pass (`pytest`)
- [ ] New features have tests
- [ ] Docstrings are added
- [ ] No secrets or sensitive data in code
- [ ] Environment variables are used for configuration
- [ ] Error handling is implemented
- [ ] Logging is added where appropriate

## Common Mistakes to Avoid

### ❌ Don't Mix Layers

```python
# BAD - Business logic in endpoint
@router.post("/users")
async def create_user(user_data: UserCreate, db: Session = Depends()):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(400, "Email exists")
    # ...
```

```python
# GOOD - Use service layer
@router.post("/users")
async def create_user(user_data: UserCreate, service: UserService = Depends()):
    return await service.create_user(user_data)
```

### ❌ Don't Hardcode Values

```python
# BAD
SECRET_KEY = "my-secret-key"

# GOOD
from app.core.config import settings
SECRET_KEY = settings.SECRET_KEY
```

### ❌ Don't Ignore Errors

```python
# BAD
try:
    user = await service.create_user(data)
except:
    pass  # Don't do this!

# GOOD
try:
    user = await service.create_user(data)
except ValueError as e:
    logger.error(f"Invalid user data: {e}")
    raise HTTPException(status_code=400, detail=str(e))
```

## Git Workflow

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add user authentication endpoint"
git commit -m "Fix: Resolve email validation bug"
git commit -m "Refactor: Improve user service error handling"

# Bad
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### Pull Request Process

1. **Create feature branch**

   ```bash
   git checkout -b feature/user-authentication
   ```

2. **Make changes and commit**

   ```bash
   git add .
   git commit -m "Add user authentication with JWT"
   ```

3. **Push to remote**

   ```bash
   git push origin feature/user-authentication
   ```

4. **Create Pull Request**

   - Go to GitHub/GitLab
   - Create PR from your branch to `main`
   - Add description of changes
   - Request review from team lead

5. **Address Review Comments**
   - Make requested changes
   - Push updates to same branch
   - PR will update automatically

## Testing

### Run All Tests

```bash
pytest
```

### Run Specific Test

```bash
pytest tests/test_auth.py::test_login
```

### Run with Coverage

```bash
pytest --cov=app --cov-report=html
```

### View Coverage Report

```bash
open htmlcov/index.html  # macOS
start htmlcov/index.html  # Windows
```

## Debugging

### Using Print Statements

```python
# Temporary debugging
print(f"User data: {user_data}")
```

### Using Logging

```python
# Better approach
from app.core.logging import get_logger

logger = get_logger(__name__)
logger.info(f"Creating user: {user_data.email}")
logger.error(f"Failed to create user: {error}")
```

### Using Debugger

```python
# Add breakpoint
import pdb; pdb.set_trace()

# Or use IDE debugger (recommended)
```

## Database Migrations

### Create Migration

```bash
alembic revision --autogenerate -m "Add items table"
```

### Apply Migration

```bash
alembic upgrade head
```

### Rollback Migration

```bash
alembic downgrade -1
```

## Documentation

### Update README

When adding new features, update:

- API endpoints table
- Example requests
- Configuration options

### Add Docstrings

```python
def complex_function(param1: str, param2: int) -> dict:
    """
    Brief description of what the function does.

    Args:
        param1: Description of param1
        param2: Description of param2

    Returns:
        Description of return value

    Raises:
        ValueError: When param2 is negative
    """
    # Implementation
```

## Questions and Help

- Check existing documentation first
- Ask in team chat
- Consult with senior developers
- Review similar code in the project

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Project Architecture Guide](ARCHITECTURE.md)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Happy Coding! Remember: Clean code is better than clever code. 🚀**
