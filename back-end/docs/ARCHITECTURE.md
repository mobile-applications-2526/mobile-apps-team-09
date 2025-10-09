# Architecture Documentation

## Overview

This backend follows a **Layered Architecture** pattern, which is one of the most common architectural patterns used in enterprise applications. This pattern organizes code into horizontal layers, each with a specific responsibility.

## Layered Architecture

### Layer 1: Presentation Layer (API)

**Location**: `app/api/`

**Responsibility**:

- Handle HTTP requests and responses
- Validate incoming data
- Format outgoing data
- Route requests to appropriate services

**Components**:

- **Endpoints**: Individual route handlers (e.g., `users.py`, `auth.py`)
- **Schemas**: Pydantic models for request/response validation
- **Router**: Aggregates all endpoints

**Example Flow**:

```python
# Endpoint receives request
@router.post("/users", response_model=UserResponse)
async def create_user(user_data: UserCreate, service: UserService = Depends()):
    # Validate data (automatic via Pydantic)
    # Call service layer
    user = await service.create_user(user_data)
    # Return response (automatic serialization)
    return user
```

**Best Practices**:

- Keep endpoints thin - only handle HTTP concerns
- Don't put business logic in endpoints
- Use dependency injection for services
- Validate all input using Pydantic schemas
- Return appropriate HTTP status codes

---

### Layer 2: Business Logic Layer (Services)

**Location**: `app/services/`

**Responsibility**:

- Implement business rules and logic
- Coordinate between multiple repositories
- Handle complex operations
- Enforce authorization rules
- Transform data between layers

**Components**:

- **Service Classes**: Contain business logic (e.g., `UserService`)
- **Business Validations**: Custom validation rules
- **Data Transformations**: Convert between different data formats

**Example Flow**:

```python
class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def create_user(self, user_data: UserCreate):
        # Business rule: Check if email exists
        if await self.repository.email_exists(user_data.email):
            raise HTTPException(400, "Email already exists")

        # Business logic: Hash password
        hashed_password = get_password_hash(user_data.password)

        # Delegate to repository
        return await self.repository.create(
            email=user_data.email,
            hashed_password=hashed_password
        )
```

**Best Practices**:

- One service per domain entity (UserService, ItemService, etc.)
- Services should not know about HTTP (no Request/Response objects)
- Services coordinate repositories but don't directly access the database
- Keep services focused on business logic, not data access

---

### Layer 3: Data Access Layer (Repositories)

**Location**: `app/repositories/`

**Responsibility**:

- Interact directly with the database
- Perform CRUD operations
- Build database queries
- Abstract database implementation details

**Components**:

- **Base Repository**: Generic CRUD operations
- **Specific Repositories**: Domain-specific queries (e.g., `UserRepository`)
- **Database Models**: SQLAlchemy ORM models

**Example Flow**:

```python
class UserRepository(BaseRepository[User]):
    async def get_by_email(self, email: str) -> Optional[User]:
        # Build and execute query
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def email_exists(self, email: str) -> bool:
        user = await self.get_by_email(email)
        return user is not None
```

**Best Practices**:

- Repositories only handle data access - no business logic
- Use base repository for common operations
- Create custom methods for complex queries
- Return domain models, not database objects
- Keep database concerns isolated in this layer

---

## Data Flow

### Request Flow (Top to Bottom)

```
Client Request
    ↓
[Middleware] → Request logging, CORS, etc.
    ↓
[Presentation Layer] → Validate request, extract data
    ↓
[Business Logic Layer] → Apply business rules
    ↓
[Data Access Layer] → Query database
    ↓
[Database]
```

### Response Flow (Bottom to Top)

```
[Database] → Return data
    ↓
[Data Access Layer] → Map to domain models
    ↓
[Business Logic Layer] → Transform/enrich data
    ↓
[Presentation Layer] → Serialize to JSON
    ↓
[Middleware] → Add headers, log response
    ↓
Client Response
```

---

## Dependency Injection

We use FastAPI's dependency injection system to wire layers together:

```python
# Layer 3: Repository depends on database session
def get_user_repository(session: AsyncSession = Depends(get_session)):
    return UserRepository(session)

# Layer 2: Service depends on repository
def get_user_service(repo: UserRepository = Depends(get_user_repository)):
    return UserService(repo)

# Layer 1: Endpoint depends on service
@router.get("/users/me")
async def get_current_user(service: UserService = Depends(get_user_service)):
    return await service.get_current_user()
```

**Benefits**:

- Automatic dependency resolution
- Easy to test (can mock dependencies)
- Loose coupling between layers
- Single Responsibility Principle

---

## Cross-Cutting Concerns

Some features span multiple layers:

### Authentication & Authorization

```
Middleware → Extract JWT token
    ↓
Dependency → Verify token, load user
    ↓
Endpoint → Check permissions
    ↓
Service → Enforce business rules
```

### Error Handling

```
Repository → Raises specific exceptions
    ↓
Service → Catches and transforms to business errors
    ↓
Endpoint → Returns appropriate HTTP responses
    ↓
Middleware → Formats error response
```

### Logging

```
Middleware → Log request/response
    ↓
Service → Log business operations
    ↓
Repository → Log database operations
```

---

## Design Patterns Used

### 1. Repository Pattern

- **Purpose**: Abstract data access logic
- **Location**: `app/repositories/`
- **Benefit**: Can switch database without changing business logic

### 2. Service Pattern

- **Purpose**: Encapsulate business logic
- **Location**: `app/services/`
- **Benefit**: Reusable business logic across endpoints

### 3. Dependency Injection

- **Purpose**: Manage dependencies between components
- **Location**: `app/core/dependencies.py`
- **Benefit**: Loose coupling, easier testing

### 4. DTO (Data Transfer Object)

- **Purpose**: Transfer data between layers
- **Location**: `app/schemas/`
- **Benefit**: Type safety, validation

---

## Testing Strategy

### Unit Tests

- Test each layer independently
- Mock dependencies from other layers
- Focus on business logic in services

```python
async def test_user_service_create():
    # Mock repository
    mock_repo = Mock(UserRepository)
    mock_repo.email_exists.return_value = False

    # Test service
    service = UserService(mock_repo)
    user = await service.create_user(user_data)

    # Verify
    assert user.email == user_data.email
    mock_repo.create.assert_called_once()
```

### Integration Tests

- Test multiple layers together
- Use test database
- Verify complete flows

```python
async def test_create_user_endpoint(client):
    response = await client.post("/api/v1/users", json=user_data)
    assert response.status_code == 201
    assert response.json()["email"] == user_data["email"]
```

---

## Benefits of This Architecture

### 1. Separation of Concerns

- Each layer has a clear, single responsibility
- Changes in one layer don't affect others
- Example: Can change database (repository) without touching business logic (services)

### 2. Testability

- Each layer can be tested independently
- Easy to mock dependencies
- Clear test boundaries

### 3. Maintainability

- Code is organized logically
- Easy to find and fix bugs
- New developers can understand structure quickly

### 4. Scalability

- Can scale different layers independently
- Easy to add new features
- Can refactor one layer without affecting others

### 5. Reusability

- Business logic in services can be reused across endpoints
- Repository methods can be shared
- Common patterns in base classes

---

## Common Pitfalls to Avoid

### ❌ Don't Put Business Logic in Endpoints

```python
# BAD
@router.post("/users")
async def create_user(user_data: UserCreate, db: Session = Depends()):
    # Don't do this!
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(400, "Email exists")
    # Business logic in endpoint!
```

### ✅ Put Business Logic in Services

```python
# GOOD
@router.post("/users")
async def create_user(user_data: UserCreate, service: UserService = Depends()):
    return await service.create_user(user_data)

# Service handles business logic
class UserService:
    async def create_user(self, user_data: UserCreate):
        if await self.repository.email_exists(user_data.email):
            raise HTTPException(400, "Email exists")
        return await self.repository.create(...)
```

### ❌ Don't Access Database Directly from Services

```python
# BAD
class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session  # Don't do this!

    async def get_user(self, user_id: int):
        # Service directly querying database
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
```

### ✅ Use Repositories for Data Access

```python
# GOOD
class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def get_user(self, user_id: int):
        return await self.repository.get_by_id(user_id)
```

---

## Extending the Architecture

### Adding a New Entity

1. **Create Model** (`app/models/item.py`)
2. **Create Schemas** (`app/schemas/item_schema.py`)
3. **Create Repository** (`app/repositories/item_repository.py`)
4. **Create Service** (`app/services/item_service.py`)
5. **Create Endpoints** (`app/api/v1/endpoints/items.py`)
6. **Register Router** (in `app/api/v1/router.py`)

### Adding Complex Business Logic

```python
# Example: Transfer money between accounts
class TransactionService:
    def __init__(
        self,
        account_repo: AccountRepository,
        transaction_repo: TransactionRepository
    ):
        self.account_repo = account_repo
        self.transaction_repo = transaction_repo

    async def transfer_money(self, from_id: int, to_id: int, amount: float):
        # Business rule: Check balance
        from_account = await self.account_repo.get_by_id(from_id)
        if from_account.balance < amount:
            raise InsufficientFundsError()

        # Business logic: Update both accounts
        await self.account_repo.update(from_id, balance=from_account.balance - amount)
        to_account = await self.account_repo.get_by_id(to_id)
        await self.account_repo.update(to_id, balance=to_account.balance + amount)

        # Record transaction
        await self.transaction_repo.create(
            from_account=from_id,
            to_account=to_id,
            amount=amount
        )
```

---

## Conclusion

This layered architecture provides:

- Clear separation of concerns
- Easy testing and maintenance
- Scalable and extensible design
- Industry-standard patterns

By following these patterns and principles, you'll build maintainable, scalable applications that are easy to understand and extend.
