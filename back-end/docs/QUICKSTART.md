# 🚀 Quick Start Guide

Get up and running with the FastAPI backend in 5 minutes!

## Prerequisites

Make sure you have these installed:

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/downloads/)

## Step-by-Step Setup

### 1. Navigate to Backend Directory

```bash
cd back-end
```

### 2. Create Virtual Environment

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal prompt.

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs FastAPI, SQLAlchemy, and all other required packages.

### 4. Create Environment File

Create a file named `.env` in the `back-end` directory:

```env
# Application
APP_NAME="Mobile App Backend"
APP_VERSION="1.0.0"
DEBUG=True
ENVIRONMENT=development

# Server
HOST=0.0.0.0
PORT=8000

# Database (SQLite for development)
DATABASE_URL=sqlite+aiosqlite:///./app.db

# Security (change this in production!)
SECRET_KEY=super-secret-key-change-this-please
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
ALLOWED_METHODS=*
ALLOWED_HEADERS=*

# Logging
LOG_LEVEL=INFO
```

### 5. Run the Application

```bash
uvicorn app.main:app --reload
```

You should see output like:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 6. Test the API

Open your browser and visit:

- **API Documentation**: http://localhost:8000/api/docs
- **Health Check**: http://localhost:8000/health

You should see the interactive API documentation (Swagger UI).

## 🎉 You're Ready!

The backend is now running. Here's what to do next:

### Try the API

#### 1. Register a User

Using the Swagger UI at http://localhost:8000/api/docs:

1. Find `POST /api/v1/auth/register`
2. Click "Try it out"
3. Enter this JSON:
   ```json
   {
     "email": "test@example.com",
     "username": "testuser",
     "password": "TestPass123",
     "full_name": "Test User"
   }
   ```
4. Click "Execute"

#### 2. Login

1. Find `POST /api/v1/auth/login`
2. Click "Try it out"
3. Enter:
   ```json
   {
     "username": "testuser",
     "password": "TestPass123"
   }
   ```
4. Copy the `access_token` from the response

#### 3. Get Current User

1. Click the "Authorize" button at the top
2. Paste your token (without "Bearer")
3. Click "Authorize"
4. Find `GET /api/v1/users/me`
5. Click "Try it out" → "Execute"

You should see your user information!

## 📝 Quick Commands

### Run Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=app
```

### Check Code Style

```bash
black app/
flake8 app/
```

### Run in Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🐳 Using Docker (Optional)

If you prefer Docker:

```bash
# Build and run
docker-compose up -d

# After making changes to the code
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The API will be available at http://localhost:8000

## 🔧 Troubleshooting

### Problem: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: Make sure virtual environment is activated and dependencies are installed:

```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Problem: `Port 8000 is already in use`

**Solution**: Either:

- Stop the other process using port 8000
- Or use a different port:
  ```bash
  uvicorn app.main:app --reload --port 8001
  ```

### Problem: `Database error`

**Solution**: Delete the database file and restart:

```bash
rm app.db
uvicorn app.main:app --reload
```

### Problem: `Import error` or `Cannot find module`

**Solution**: Make sure you're running from the `back-end` directory:

```bash
pwd  # Should show .../back-end
ls   # Should show app/, tests/, requirements.txt, etc.
```

## 📚 Next Steps

1. **Read the Documentation**

   - [README.md](../README.md) - Full documentation
   - [docs/ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview
   - [docs/CONTRIBUTING.md](CONTRIBUTING.md) - How to add features

2. **Explore the Code**

   - Look at `app/api/v1/endpoints/` for API examples
   - Check `app/services/` for business logic
   - Review `app/repositories/` for database operations

3. **Add Your First Feature**

   - Follow the guide in [docs/CONTRIBUTING.md](CONTRIBUTING.md)
   - Start with something simple like a "Hello World" endpoint

4. **Join the Team Chat**
   - Ask questions
   - Share what you learned
   - Help other interns

## 🆘 Need Help?

- Check [README.md](../README.md) for detailed documentation
- Look at existing code for examples
- Ask your team lead or senior developers
- Search the FastAPI docs: https://fastapi.tiangolo.com/

## 🎓 Learning Resources

- **FastAPI Tutorial**: https://fastapi.tiangolo.com/tutorial/
- **Python Async/Await**: https://realpython.com/async-io-python/
- **SQLAlchemy ORM**: https://docs.sqlalchemy.org/en/20/tutorial/
- **REST API Best Practices**: https://restfulapi.net/

---

**Congratulations! You've successfully set up the backend. Happy coding! 🎉**
