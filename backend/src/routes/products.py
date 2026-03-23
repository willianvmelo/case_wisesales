from fastapi import APIRouter, Query

from src.schemas.product import ProductResponse
from src.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])

product_service = ProductService()


@router.get("", response_model=list[ProductResponse])
def list_products(category: str | None = Query(default=None)):
    return product_service.list_products(category=category)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int):
    return product_service.get_product_by_id(product_id)