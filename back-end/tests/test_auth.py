"""
Tests for authentication endpoints
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    """
    Test user registration
    """
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "TestPassword123",
            "full_name": "Test User",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert "id" in data
    assert "hashed_password" not in data  # Password should not be in response


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    """
    Test registration with duplicate email
    """
    # Register first user
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser1",
            "password": "TestPassword123",
        },
    )

    # Try to register with same email
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser2",
            "password": "TestPassword123",
        },
    )

    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login(client: AsyncClient):
    """
    Test user login
    """
    # Register user first
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "TestPassword123",
        },
    )

    # Login
    response = await client.post(
        "/api/v1/auth/login",
        json={"username": "testuser", "password": "TestPassword123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    """
    Test login with invalid credentials
    """
    # Register user first
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "TestPassword123",
        },
    )

    # Try login with wrong password
    response = await client.post(
        "/api/v1/auth/login",
        json={"username": "testuser", "password": "WrongPassword123"},
    )

    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]
