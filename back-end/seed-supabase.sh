#!/bin/bash
# Seed script for Supabase database (local development)
# This script seeds your Supabase database directly without Docker

set -e

# Get the directory this script is in
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🌱 Seeding Supabase database..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Supabase credentials."
    exit 1
fi

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 is not installed!"
    exit 1
fi

# Run the seed script using python3 directly
echo "Running seed script..."
python3 -m app.db.seed

if [ $? -eq 0 ]; then
    echo "✅ Supabase database seeded successfully!"
else
    echo "❌ Seeding failed!"
    exit 1
fi
