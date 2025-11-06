#!/bin/bash
# Quick script to seed the database in Docker (Mac)

echo "🌱 Seeding database..."
docker-compose exec backend python -m app.db.seed
echo "✅ Done!"
