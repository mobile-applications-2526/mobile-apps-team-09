# Supabase Database Setup Guide

## Overview

This backend now uses Supabase's PostgreSQL database instead of SQLite for production-ready data storage with better scalability, concurrency, and cloud-native features.

## Why Supabase PostgreSQL?

- **Scalability**: Better performance for multiple concurrent users
- **Cloud-native**: Automatic backups, point-in-time recovery
- **Real-time**: Built-in real-time subscriptions (if needed)
- **Production-ready**: Better suited for production deployments
- **Advanced features**: Full-text search, JSON support, triggers, and more

## Setup Instructions

### 1. Get Your Supabase Database Credentials

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Project Settings** → **Database**
4. Scroll down to **Connection string** section
5. Select **URI** tab
6. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)

### 2. Update Your Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Open `.env` and update the `DATABASE_URL`:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

   **Important**:
   - Replace `YOUR_PASSWORD` with your actual database password from Supabase
   - Replace `xxxxx` with your project reference ID
   - Note the `+asyncpg` in the connection string (required for async SQLAlchemy)

### 3. Connection Pooling (Production Recommended)

For better performance in production, use Supabase's connection pooler (port 6543):

```env
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
```

**Benefits**:
- Reduces connection overhead
- Better resource utilization
- Handles more concurrent requests

### 4. Initialize Database Tables

The application will automatically create tables on startup, but you can also run:

```bash
# If you have a migration script
alembic upgrade head

# Or start the application and tables will be created automatically
python -m uvicorn app.main:app --reload
```

### 5. Seed Initial Data (Optional)

If you have a seeding script:

```bash
# On Unix/macOS
./seed.sh

# On Windows
seed.bat
```

## Configuration Details

### Connection Pool Settings

The database configuration includes optimized connection pool settings in [`database.py`](../app/db/database.py):

```python
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_size=20,          # Max connections in pool
    max_overflow=10,       # Extra connections beyond pool_size
    pool_pre_ping=True,    # Verify connections before use
    pool_recycle=3600,     # Recycle connections after 1 hour
)
```

**Settings Explanation**:
- `pool_size=20`: Maximum number of persistent connections
- `max_overflow=10`: Additional connections when pool is full (total = 30)
- `pool_pre_ping=True`: Prevents "connection closed" errors
- `pool_recycle=3600`: Refreshes connections every hour

### Adjusting for Your Needs

For **development** (fewer users):
```python
pool_size=5
max_overflow=5
```

For **production** (many concurrent users):
```python
pool_size=50
max_overflow=20
```

## Differences from SQLite

### Data Types

PostgreSQL supports more advanced types:
- **JSONB**: Better than JSON in SQLite
- **Arrays**: Native array support
- **UUID**: Built-in UUID type
- **Full-text search**: Advanced text search capabilities

### Features Now Available

1. **Concurrent writes**: Multiple users can write simultaneously
2. **Transactions**: Full ACID compliance
3. **Stored procedures**: Create custom database functions
4. **Triggers**: Automatic actions on data changes
5. **Row-level security**: Fine-grained access control

### Migration Checklist

If migrating from SQLite:

- [x] Update `DATABASE_URL` to PostgreSQL format
- [x] Add `+asyncpg` to connection string
- [x] Configure connection pool settings
- [ ] Test all database operations
- [ ] Update any SQLite-specific queries (if any)
- [ ] Run migrations or create tables
- [ ] Seed initial data

## Troubleshooting

### Connection Refused

**Error**: `could not connect to server`

**Solution**:
1. Check your internet connection
2. Verify the database URL is correct
3. Ensure your Supabase project is active
4. Check if you're using the correct password

### SSL/TLS Errors

**Error**: `SSL connection has been closed unexpectedly`

**Solution**: Add SSL mode to your connection string:
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres?ssl=require
```

### Too Many Connections

**Error**: `remaining connection slots are reserved`

**Solution**:
1. Use the connection pooler (port 6543)
2. Reduce `pool_size` and `max_overflow`
3. Upgrade your Supabase plan for more connections

### Password Authentication Failed

**Error**: `password authentication failed for user "postgres"`

**Solution**:
1. Reset your database password in Supabase dashboard
2. Update the password in your `.env` file
3. Ensure there are no special characters that need URL encoding

## Security Best Practices

1. **Never commit `.env` to git** - it contains sensitive credentials
2. **Use environment variables** for connection strings in production
3. **Rotate passwords regularly** in Supabase dashboard
4. **Use connection pooling** for better performance and security
5. **Enable Row Level Security (RLS)** in Supabase for fine-grained access control

## Additional Resources

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [SQLAlchemy Async Documentation](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

## Next Steps

After setting up the database:

1. Review your models in `app/models/` to ensure they're PostgreSQL-compatible
2. Set up database migrations with Alembic for schema versioning
3. Configure Row Level Security in Supabase for additional security
4. Set up database backups and monitoring
5. Consider using Supabase's real-time features if needed

## Support

If you encounter issues:
1. Check the Supabase [status page](https://status.supabase.com/)
2. Review Supabase [community discussions](https://github.com/supabase/supabase/discussions)
3. Check application logs for detailed error messages
