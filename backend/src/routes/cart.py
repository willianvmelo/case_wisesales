from fastapi import APIRouter

from src.schemas.cart import AddCartItemRequest, CartResponse, UpdateCartItemRequest
from src.services.cart_service import CartService

router = APIRouter(prefix="/cart", tags=["cart"])

cart_service = CartService()


@router.get("", response_model=CartResponse)
def get_cart():
    return cart_service.get_cart()


@router.post("/items", response_model=CartResponse)
def add_cart_item(payload: AddCartItemRequest):
    return cart_service.add_item(
        product_id=payload.product_id,
        quantity=payload.quantity,
    )


@router.patch("/items/{item_id}", response_model=CartResponse)
def update_cart_item(item_id: int, payload: UpdateCartItemRequest):
    return cart_service.update_item(item_id=item_id, quantity=payload.quantity)


@router.delete("/items/{item_id}", response_model=CartResponse)
def delete_cart_item(item_id: int):
    return cart_service.remove_item(item_id=item_id)