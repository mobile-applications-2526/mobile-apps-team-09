"""
Global error handling middleware
"""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.core.logging import get_logger


logger = get_logger(__name__)


def add_exception_handlers(app: FastAPI):
    """
    Add custom exception handlers to the FastAPI app

    Args:
        app: FastAPI application instance
    """

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ):
        """
        Handle validation errors with simple, readable messages
        """
        errors = exc.errors()
        
        # Create simple error messages
        simple_errors = []
        for error in errors:
            field = error['loc'][-1] if error['loc'] else 'field'
            msg = error['msg']
            
            # Simplify common validation messages
            if error['type'] == 'string_too_short':
                min_length = error['ctx'].get('min_length', 0)
                simple_errors.append(f"{field}: must be at least {min_length} characters")
            elif error['type'] == 'string_too_long':
                max_length = error['ctx'].get('max_length', 0)
                simple_errors.append(f"{field}: must be at most {max_length} characters")
            elif error['type'] == 'value_error.email':
                simple_errors.append(f"{field}: invalid email format")
            elif error['type'] == 'missing':
                simple_errors.append(f"{field}: required field")
            else:
                simple_errors.append(f"{field}: {msg}")
        
        logger.error(f"Validation error: {simple_errors}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": "Validation failed",
                "details": simple_errors
            },
        )

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
        """
        Handle database errors
        """
        logger.error(f"Database error: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Database error occurred",
                "message": "An error occurred while processing your request",
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """
        Handle general exceptions
        """
        logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "message": "An unexpected error occurred",
            },
        )
