@echo off
REM Quick script to seed the database in Docker (Windows)

echo 🌱 Seeding database...
docker-compose exec backend python -m app.db.seed
echo ✅ Done!
