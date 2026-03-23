from decimal import Decimal

from pydantic import BaseModel, Field


class AddCartItemRequest(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(gt=0)


class AppliedCouponResponse(BaseModel):
    code: str
    discount_type: str
    discount_value: Decimal


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    name: str
    category: str
    price: Decimal
    stock: int
    image_url: str | None = None
    quantity: int
    line_total: Decimal


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    subtotal: Decimal
    discount: Decimal
    total: Decimal
    coupon: AppliedCouponResponse | None = None