from decimal import Decimal

from pydantic import BaseModel


class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: Decimal
    stock: int
    image_url: str | None = None