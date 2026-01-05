"""
Application configuration management
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """

    # Application
    APP_NAME: str = "Mobile App Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database (Supabase PostgreSQL)
    DATABASE_URL: str = "postgresql+asyncpg://user:password@db.xxxxx.supabase.co:5432/postgres"
    DB_CONNECTION_TIMEOUT: int = 30  # Connection timeout in seconds
    DB_COMMAND_TIMEOUT: int = 30  # Query execution timeout in seconds
    DB_POOL_SIZE: int = 10  # Number of connections to keep in pool
    DB_MAX_OVERFLOW: int = 20  # Maximum overflow connections
    DB_SSL_VERIFY: bool = False  # Disable SSL verification for Supabase (self-signed certs)

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    ALLOWED_METHODS: List[str] = ["*"]
    ALLOWED_HEADERS: List[str] = ["*"]

    # Logging
    LOG_LEVEL: str = "INFO"

    # Supabase Storage
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # AI/ML
    ANTHROPIC_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env", case_sensitive=True, extra="allow"
    )


settings = Settings()
