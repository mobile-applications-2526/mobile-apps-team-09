# 🚀 Team Setup Guide - PlantSense AI

Welcome to the PlantSense AI backend team! This guide will help you get your development environment set up.

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ **Python 3.11+** - [Download](https://www.python.org/downloads/)
- ✅ **Git** - [Download](https://git-scm.com/downloads/)
- ✅ **Docker Desktop** (optional but recommended) - [Download](https://www.docker.com/products/docker-desktop/)

## 🎯 Quick Start (5 minutes)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd mobile-apps-team-09/back-end
```

### Step 2: Create Your Environment File

```bash
# Copy the template
cp env.example .env
```

### Step 3: Generate a Secret Key

```bash
# On macOS/Linux:
openssl rand -hex 32

# On Windows (PowerShell):
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output and paste it into your `.env` file as the `SECRET_KEY` value.

### Step 4: Update Database Password

Open `.env` and change:

```env
POSTGRES_PASSWORD=CHANGE_THIS_PASSWORD
```

to something like:

```env
POSTGRES_PASSWORD=my_secure_password_123
```

### Step 5: Choose Your Setup

You have two options:

#### **Option A: Using Docker (Recommended)** 🐳

```bash
# Start everything (API + Database + pgAdmin)
docker-compose up -d

# Check if it's running
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

API will be available at: http://localhost:8000/api/docs

#### **Option B: Local Python Setup** 🐍

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Update .env to use SQLite instead of PostgreSQL
# Change DATABASE_URL to:
# DATABASE_URL=sqlite+aiosqlite:///./plantsense.db

# Run the server
uvicorn app.main:app --reload
```

API will be available at: http://localhost:8000/api/docs

## ✅ Verify Your Setup

1. **Open your browser** and go to: http://localhost:8000/api/docs
2. **You should see** the Swagger UI with the PlantSense AI API documentation
3. **Test the health endpoint**:
   - Go to http://localhost:8000/health
   - You should see: `{"status": "healthy", "version": "1.0.0", ...}`

## 🧪 Running Tests

```bash
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

## 🗄️ Database Management

### Using pgAdmin (Web Interface)

#### Step 1: Access pgAdmin

Open your browser and go to: **http://localhost:5050**

Login with:

- **Email**: `admin@plantsense.com` (or what you set in `PGADMIN_EMAIL` in your `.env`)
- **Password**: Your `PGADMIN_PASSWORD` from `.env`

#### Step 2: Add PostgreSQL Server

Once logged in, you'll see the pgAdmin welcome screen. Now you need to register your database server:

1. **Click "Add New Server"** (the blue database icon)

   OR

   Right-click **"Servers"** in the left panel → **"Register"** → **"Server..."**

2. **Fill in the connection details:**

   **General Tab:**

   - **Name**: `PlantSense AI` (or any name you prefer)

   **Connection Tab:**

   - **Host name/address**: `db` (this is the Docker service name)
   - **Port**: `5432`
   - **Maintenance database**: `plantsense_db` (matches `POSTGRES_DB` in your `.env`)
   - **Username**: `plantsense` (matches `POSTGRES_USER` in your `.env`)
   - **Password**: Your `POSTGRES_PASSWORD` from your `.env` file
   - ✅ **Check "Save password"** (optional, for convenience)

3. **Click "Save"**

#### Step 3: Explore Your Database

After connecting, you should see:

1. Expand **Servers** → **PlantSense AI**
2. Expand **Databases** → **plantsense_db**
3. Expand **Schemas** → **public** → **Tables**
4. You should see the **`users`** table! 🎉

#### Quick Reference - Connection Details

```
Host: db
Port: 5432
Database: plantsense_db
Username: plantsense
Password: (from your .env file)
```

> **💡 Tip**: If you don't remember your password, check your `.env` file:
>
> ```bash
> cat .env | grep POSTGRES_PASSWORD
> ```

#### Troubleshooting pgAdmin Connection

**If you get "could not connect to server":**

1. Make sure all Docker containers are running:

   ```bash
   docker-compose ps
   ```

2. Try using the container name instead:

   - **Host name/address**: `plantsense_postgres` (instead of `db`)

3. Make sure pgAdmin and PostgreSQL are on the same network:
   ```bash
   docker network ls
   docker network inspect plantsense_network
   ```

### Using Database CLI

```bash
# Connect to PostgreSQL (Docker)
docker exec -it plantsense_postgres psql -U plantsense -d plantsense_db

# Common commands:
# \dt          - List tables
# \d users     - Describe users table
# SELECT * FROM users; - Query users
# \q           - Quit
```

## 🔧 Common Issues & Solutions

### Issue: "Port 8000 already in use"

**Solution**:

```bash
# Find what's using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process or change the port in .env
PORT=8001
```

### Issue: "ModuleNotFoundError: No module named 'fastapi'"

**Solution**:

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Database connection error"

**Solution**:

```bash
# If using Docker, make sure containers are running
docker-compose ps

# Restart containers
docker-compose restart

# If using local setup, check DATABASE_URL in .env
```

### Issue: "Permission denied: '.env'"

**Solution**:

```bash
# Make sure you copied env.example to .env
cp env.example .env
```

## 📁 Project Structure Overview

```
back-end/
├── app/
│   ├── api/              # API endpoints (presentation layer)
│   ├── services/         # Business logic
│   ├── repositories/     # Database access
│   ├── models/           # Database models
│   ├── schemas/          # Request/response validation
│   ├── core/             # Configuration & utilities
│   ├── middleware/       # Custom middleware
│   └── main.py          # Application entry point
├── tests/               # Test files
├── docs/                # Documentation
├── .env                 # Your local config (DON'T COMMIT!)
├── env.example          # Template (safe to commit)
└── requirements.txt     # Python dependencies
```

## 🤝 Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Run tests**:

   ```bash
   pytest
   ```

4. **Format code**:

   ```bash
   black app/
   ```

5. **Commit and push**:

   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request** on GitHub/GitLab

## 🔐 Security Reminders

- ✅ **NEVER commit `.env`** - it's already in .gitignore
- ✅ **Use strong passwords** in your local .env
- ✅ **Rotate secrets regularly**
- ✅ **Don't share .env files** - each team member should have their own

## 📚 Helpful Resources

- **API Documentation**: http://localhost:8000/api/docs (when running)
- **Architecture Guide**: [docs/ARCHITECTURE.md](ARCHITECTURE.md)
- **Contributing Guide**: [docs/CONTRIBUTING.md](CONTRIBUTING.md)
- **Security Guide**: [docs/SECURITY.md](SECURITY.md)
- **FastAPI Docs**: https://fastapi.tiangolo.com/

## 🆘 Getting Help

1. **Check existing documentation** in the `docs/` folder
2. **Search for similar issues** in the git repository
3. **Ask in team chat**
4. **Contact senior developers**

## 🎓 Next Steps

Once you have everything running:

1. **Explore the API** at http://localhost:8000/api/docs
2. **Read the architecture guide** to understand the codebase
3. **Try making a simple change** (add a new endpoint)
4. **Run the tests** to ensure everything works
5. **Read the contributing guide** before starting work

---

**Welcome to the team! Happy coding! 🌱🚀**
