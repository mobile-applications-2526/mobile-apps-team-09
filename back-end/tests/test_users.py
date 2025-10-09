"""
Tests for user endpoints
"""

import pytest
from httpx import AsyncClient


async def create_and_login_user(client: AsyncClient, username: str = "testuser") -> str:
    """
    Helper function to create and login a user

    Returns:
        Access token
    """
    # Register
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": f"{username}@example.com",
            "username": username,
            "password": "TestPassword123",
            "full_name": "Test User",
        },
    )

    # Login
    response = await client.post(
        "/api/v1/auth/login", json={"username": username, "password": "TestPassword123"}
    )

    return response.json()["access_token"]


@pytest.mark.asyncio
async def test_get_current_user(client: AsyncClient):
    """
    Test getting current user information
    """
    token = await create_and_login_user(client)

    response = await client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"


@pytest.mark.asyncio
async def test_get_current_user_unauthorized(client: AsyncClient):
    """
    Test getting current user without authentication
    """
    response = await client.get("/api/v1/users/me")

    assert response.status_code == 403  # No credentials provided


@pytest.mark.asyncio
async def test_get_users(client: AsyncClient):
    """
    Test getting list of users
    """
    token = await create_and_login_user(client)

    # Create another user
    await create_and_login_user(client, username="testuser2")

    response = await client.get(
        "/api/v1/users/", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


@pytest.mark.asyncio
async def test_update_user(client: AsyncClient):
    """
    Test updating user information
    """
    token = await create_and_login_user(client)

    # Get user ID
    me_response = await client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {token}"}
    )
    user_id = me_response.json()["id"]

    # Update user
    response = await client.put(
        f"/api/v1/users/{user_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Updated Name"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"


@pytest.mark.asyncio
async def test_update_other_user_forbidden(client: AsyncClient):
    """
    Test that users cannot update other users
    """
    token1 = await create_and_login_user(client, username="user1")
    await create_and_login_user(client, username="user2")

    # Try to update user2 with user1's token
    response = await client.put(
        "/api/v1/users/2",
        headers={"Authorization": f"Bearer {token1}"},
        json={"full_name": "Hacked Name"},
    )

    assert response.status_code == 403
