from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config.settings import settings
from src.core.handlers import register_exception_handlers
from src.routes.cart import router as cart_router
from src.routes.health import router as health_router
from src.routes.products import router as products_router

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(health_router)
app.include_router(products_router)
app.include_router(cart_router)