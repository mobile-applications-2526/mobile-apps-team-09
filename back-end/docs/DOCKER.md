# 🐳 Docker Guide - PlantSense Backend

A comprehensive guide to understanding and using Docker with the PlantSense backend.

## 📋 Table of Contents

- [Docker Basics](#docker-basics)
- [Common Commands](#common-commands)
- [Understanding Flags](#understanding-flags)
- [Volumes & Data Persistence](#volumes--data-persistence)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 Docker Basics

### What is Docker Compose?

Docker Compose allows you to define and run multi-container applications. Our project has 3 containers:

- **backend** - FastAPI application
- **db** - PostgreSQL database
- **pgadmin** - Database management UI

All defined in `docker-compose.yml`.

---

## 🚀 Common Commands

### Starting & Stopping

```bash
# Start all containers (background mode)
docker-compose up -d

# Start all containers (foreground - see logs)
docker-compose up

# Stop all containers (keeps data)
docker-compose down

# Stop and remove ALL data (volumes)
docker-compose down -v
```

### Building & Rebuilding

```bash
# Build images and start
docker-compose up -d --build

# Force rebuild from scratch
docker-compose build --no-cache

# Rebuild just one service
docker-compose build backend
```

### Viewing Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs backend
docker-compose logs db

# Follow specific service logs
docker-compose logs -f backend
```

### Container Management

```bash
# List running containers
docker-compose ps

# Restart a service
docker-compose restart backend

# Stop a specific service
docker-compose stop backend

# Start a specific service
docker-compose start backend
```

### Executing Commands in Containers

```bash
# Open bash shell in backend container
docker-compose exec backend bash

# Run a Python command
docker-compose exec backend python -m app.db.seed

# Access PostgreSQL directly
docker-compose exec db psql -U plantsense -d plantsense_db

# Run a SQL command
docker-compose exec db psql -U plantsense -d plantsense_db -c "SELECT * FROM users;"
```

---

## 🏴 Understanding Flags

### `-d` (Detached Mode)

**With `-d`:**

```bash
docker-compose up -d
```

- ✅ Runs containers in the **background**
- ✅ Terminal is free to use
- ✅ Containers keep running after command exits
- ✅ Use for normal development

**Without `-d`:**

```bash
docker-compose up
```

- ✅ Runs in the **foreground**
- ✅ Shows all logs in real-time
- ✅ `Ctrl+C` stops containers
- ✅ Use for debugging

**Example:**

```bash
# Normal use - background
docker-compose up -d

# Debugging - see logs
docker-compose up
```

---

### `--build`

**With `--build`:**

```bash
docker-compose up --build
```

- ✅ **Rebuilds** Docker images before starting
- ✅ Picks up changes to `Dockerfile`
- ✅ Installs new packages from `requirements.txt`
- ✅ Use when you modify dependencies

**Without `--build`:**

```bash
docker-compose up
```

- ✅ Uses **existing** images
- ✅ Faster startup
- ✅ Use for normal restarts

**When to use `--build`:**

- ✅ First time setup
- ✅ Added/removed Python packages
- ✅ Changed `Dockerfile`
- ✅ Modified build steps
- ❌ NOT needed for code changes in mounted volumes

**Example:**

```bash
# Added 'requests' to requirements.txt
docker-compose down
docker-compose up -d --build  # Rebuild to install it
```

---

### `-v` (Remove Volumes)

**With `-v`:**

```bash
docker-compose down -v
```

- ⚠️ **DANGER**: Deletes ALL data!
- ❌ Removes database data
- ❌ Removes pgAdmin configuration
- ❌ Everything is gone!
- ✅ Use for fresh start

**Without `-v`:**

```bash
docker-compose down
```

- ✅ Keeps all data
- ✅ Database persists
- ✅ pgAdmin settings saved
- ✅ Use for normal shutdown

---

### `--no-cache`

```bash
docker-compose build --no-cache
```

- ✅ Builds from scratch (ignores cache)
- ✅ Use when build is acting weird
- ⚠️ Slower build time

---

## 💾 Volumes & Data Persistence

### Understanding Volumes

Volumes are Docker's way of persisting data. Our project has 2 volumes:

```yaml
volumes:
  plantsense_data: # Database data
  pgadmin_data: # pgAdmin settings
```

### How Data Persistence Works

```bash
# Day 1 - Initial setup
docker-compose up -d
./seed.sh                # Seed database with test data

# Day 2 - Regular restart
docker-compose down      # Stop containers
docker-compose up -d     # Start again
# ✅ Data is STILL THERE! No need to seed again

# Fresh start
docker-compose down -v   # Delete volumes
docker-compose up -d     # Start fresh
./seed.sh               # Need to seed again
```

### Volume Management

```bash
# List all volumes
docker volume ls

# Inspect a volume
docker volume inspect back-end_plantsense_data

# Remove a specific volume (careful!)
docker volume rm back-end_plantsense_data

# Remove all unused volumes
docker volume prune
```

---

## 🗂️ Complete Workflows

### Normal Development (Data Persists)

```bash
# Day 1 - Setup
docker-compose up -d --build
./seed.sh

# Work on your code...
# Make changes to .py files in app/

# Day 2+ - Just restart
docker-compose down
docker-compose up -d
# ✅ Data persists, no need to seed!
```

### Added a New Python Package

```bash
# 1. Add package to requirements.txt
echo "requests==2.31.0" >> requirements.txt

# 2. Rebuild
docker-compose down
docker-compose up -d --build

# ✅ Package installed!
```

### Fresh Reset (Clean Start)

```bash
# Delete everything and start fresh
docker-compose down -v
docker-compose up -d --build
./seed.sh

# ✅ Brand new environment!
```

### Debugging Mode

```bash
# Stop background containers
docker-compose down

# Start in foreground to see logs
docker-compose up

# Watch logs scroll...
# Press Ctrl+C when done

# Back to background
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Problem: "Port already in use"

```bash
# Error: Bind for 0.0.0.0:8000 failed: port is already allocated

# Solution 1: Stop other services using that port
lsof -i :8000
kill <PID>

# Solution 2: Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead
```

### Problem: "Container won't start"

```bash
# View container logs
docker-compose logs backend

# Check container status
docker-compose ps

# Restart specific container
docker-compose restart backend
```

### Problem: "Changes not showing up"

```bash
# For Python code changes (in mounted volumes):
docker-compose restart backend  # Just restart

# For Dockerfile or requirements.txt changes:
docker-compose up -d --build    # Need to rebuild
```

### Problem: "Database connection refused"

```bash
# Database might not be ready yet
# Wait a few seconds and try again

# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Problem: "No seed data after restart"

```bash
# Check if you used -v flag
# If you did: docker-compose down -v
# Then you MUST seed again:
./seed.sh

# If you didn't use -v, check volume exists:
docker volume ls | grep plantsense

# If volume exists but no data:
docker-compose exec db psql -U plantsense -d plantsense_db -c "SELECT COUNT(*) FROM users;"
# If returns 0, run: ./seed.sh
```

### Problem: "pgAdmin server disappeared"

```bash
# This happens if you used: docker-compose down -v
# The -v flag deletes the pgAdmin configuration

# Solution: Don't use -v unless you want a fresh start
docker-compose down      # ✅ Keeps config
docker-compose down -v   # ❌ Deletes config
```

---

## ✅ Best Practices

### DO ✅

```bash
# Normal daily workflow
docker-compose down          # Stop (keeps data)
docker-compose up -d         # Start

# After adding packages
docker-compose up -d --build

# For debugging
docker-compose logs -f backend

# Regular seeding (once at start)
./seed.sh
```

### DON'T ❌

```bash
# Don't use -v unless you want to delete everything!
docker-compose down -v      # ❌ Deletes all data

# Don't use --build every time (slower)
docker-compose up --build   # ❌ Only when needed

# Don't leave containers running in foreground
docker-compose up           # ❌ Use -d for background
```

---

## 📊 Quick Reference Table

| Command         | When to Use           | Data Persists? | Rebuilds? |
| --------------- | --------------------- | -------------- | --------- |
| `up -d`         | Normal startup        | ✅ Yes         | ❌ No     |
| `up -d --build` | After package changes | ✅ Yes         | ✅ Yes    |
| `down`          | Stop containers       | ✅ Yes         | ❌ No     |
| `down -v`       | Fresh start           | ❌ NO          | ❌ No     |
| `restart`       | Quick restart         | ✅ Yes         | ❌ No     |
| `logs -f`       | Debug/watch logs      | ✅ Yes         | ❌ No     |

---

## 🎓 Understanding Our Setup

### Container Architecture

```
┌─────────────────────────────────────────┐
│         backend (FastAPI)               │
│         Port: 8000                      │
│         Volume: ./app -> /app/app       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         db (PostgreSQL)                 │
│         Port: 5431 (external)           │
│         Volume: plantsense_data         │
└─────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────┐
│         pgadmin (UI)                    │
│         Port: 5050                      │
│         Volume: pgadmin_data            │
└─────────────────────────────────────────┘
```

### Access Points

| Service     | URL                            | Purpose     |
| ----------- | ------------------------------ | ----------- |
| Backend API | http://localhost:8000          | REST API    |
| API Docs    | http://localhost:8000/api/docs | Swagger UI  |
| Database    | localhost:5431                 | PostgreSQL  |
| pgAdmin     | http://localhost:5050          | Database UI |

---

## 🆘 Getting Help

### View Container Status

```bash
docker-compose ps
```

### View Logs

```bash
docker-compose logs -f
```

### Enter Container

```bash
docker-compose exec backend bash
```

### Check Everything

```bash
# All in one diagnostic
docker-compose ps && docker volume ls && docker-compose logs --tail=50
```

---

## 📝 Summary

**Most Common Commands:**

```bash
# Daily use
docker-compose up -d         # Start
docker-compose down          # Stop (keeps data)
docker-compose logs -f       # Watch logs

# When you change requirements.txt
docker-compose up -d --build

# Seed database (once)
./seed.sh

# Fresh start (deletes everything)
docker-compose down -v
docker-compose up -d --build
./seed.sh
```

**Remember:**

- `-d` = background mode (always use unless debugging)
- `--build` = rebuild (only when Dockerfile/requirements change)
- `-v` = delete volumes (⚠️ deletes all data!)

---

**Need more help?** Check the [main README](README.md) or ask your team! 🚀
