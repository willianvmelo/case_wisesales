from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.config.database import DatabaseConnectionError
from src.core.exceptions import AppException


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def app_exception_handler(_: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.message},
        )

    @app.exception_handler(DatabaseConnectionError)
    async def database_exception_handler(_: Request, exc: DatabaseConnectionError):
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_: Request, __: Exception):
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )