"""
Standard API response utilities
"""

from typing import Any, Optional
from pydantic import BaseModel


class SuccessResponse(BaseModel):
    """
    Standard success response format
    """

    success: bool = True
    message: str
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """
    Standard error response format
    """

    success: bool = False
    message: str
    error: Optional[str] = None
    detail: Optional[Any] = None


def success_response(message: str, data: Optional[Any] = None) -> dict:
    """
    Create a success response

    Args:
        message: Success message
        data: Optional response data

    Returns:
        Response dictionary
    """
    return {"success": True, "message": message, "data": data}


def error_response(
    message: str, error: Optional[str] = None, detail: Optional[Any] = None
) -> dict:
    """
    Create an error response

    Args:
        message: Error message
        error: Optional error type
        detail: Optional error details

    Returns:
        Response dictionary
    """
    return {"success": False, "message": message, "error": error, "detail": detail}
