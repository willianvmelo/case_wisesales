from datetime import datetime, timezone
from decimal import Decimal

from src.core.exceptions import AppException
from src.repositories.cart_repository import CartRepository
from src.repositories.coupon_repository import CouponRepository
from src.repositories.product_repository import ProductRepository


class CartService:
    def __init__(
        self,
        cart_repository: CartRepository | None = None,
        product_repository: ProductRepository | None = None,
        coupon_repository: CouponRepository | None = None,
    ):
        self.cart_repository = cart_repository or CartRepository()
        self.product_repository = product_repository or ProductRepository()
        self.coupon_repository = coupon_repository or CouponRepository()

    def _calculate_discount(self, subtotal: Decimal, applied_coupon: dict | None) -> Decimal:
        if not applied_coupon:
            return Decimal("0.00")

        discount_type = applied_coupon["discount_type"]
        discount_value = applied_coupon["discount_value"]

        if discount_type == "percentage":
            discount = subtotal * (discount_value / Decimal("100"))
        else:
            discount = discount_value

        return min(discount, subtotal)

    def _build_cart_response(self) -> dict:
        items = self.cart_repository.list_cart_items()
        enriched_items = []
        subtotal = Decimal("0.00")

        for item in items:
            line_total = item["price"] * item["quantity"]
            subtotal += line_total

            enriched_items.append(
                {
                    "id": item["id"],
                    "product_id": item["product_id"],
                    "name": item["name"],
                    "category": item["category"],
                    "price": item["price"],
                    "stock": item["stock"],
                    "image_url": item["image_url"],
                    "quantity": item["quantity"],
                    "line_total": line_total,
                }
            )

        applied_coupon = self.coupon_repository.get_applied_coupon()
        discount = self._calculate_discount(subtotal, applied_coupon)
        total = subtotal - discount

        coupon = None
        if applied_coupon:
            coupon = {
                "code": applied_coupon["code"],
                "discount_type": applied_coupon["discount_type"],
                "discount_value": applied_coupon["discount_value"],
            }

        return {
            "items": enriched_items,
            "subtotal": subtotal,
            "discount": discount,
            "total": total,
            "coupon": coupon,
        }

    def get_cart(self) -> dict:
        return self._build_cart_response()

    def add_item(self, product_id: int, quantity: int) -> dict:
        product = self.product_repository.get_product_by_id(product_id)
        if not product:
            raise AppException("Product not found", status_code=404)

        if product["stock"] <= 0:
            raise AppException("Product is out of stock", status_code=409)

        existing_item = self.cart_repository.get_cart_item_by_product_id(product_id)

        final_quantity = quantity
        if existing_item:
            final_quantity += existing_item["quantity"]

        if final_quantity > product["stock"]:
            raise AppException("Insufficient stock for requested quantity", status_code=409)

        if existing_item:
            self.cart_repository.update_cart_item(existing_item["id"], final_quantity)
        else:
            self.cart_repository.add_cart_item(product_id, quantity)

        return self._build_cart_response()

    def update_item(self, item_id: int, quantity: int) -> dict:
        existing_item = self.cart_repository.get_cart_item_by_id(item_id)
        if not existing_item:
            raise AppException("Cart item not found", status_code=404)

        product = self.product_repository.get_product_by_id(existing_item["product_id"])
        if not product:
            raise AppException("Product not found", status_code=404)

        if quantity > product["stock"]:
            raise AppException("Insufficient stock for requested quantity", status_code=409)

        self.cart_repository.update_cart_item(item_id, quantity)
        return self._build_cart_response()

    def remove_item(self, item_id: int) -> dict:
        existing_item = self.cart_repository.get_cart_item_by_id(item_id)
        if not existing_item:
            raise AppException("Cart item not found", status_code=404)

        self.cart_repository.delete_cart_item(item_id)
        return self._build_cart_response()

    def apply_coupon(self, code: str) -> dict:
        coupon = self.coupon_repository.get_coupon_by_code(code)
        if not coupon:
            raise AppException("Coupon not found", status_code=404)

        if not coupon["active"]:
            raise AppException("Coupon is inactive", status_code=409)

        now = datetime.now(timezone.utc).replace(tzinfo=None)
        if coupon["expires_at"] <= now:
            raise AppException("Coupon is expired", status_code=409)

        self.coupon_repository.clear_applied_coupon()
        self.coupon_repository.apply_coupon(coupon["id"])

        return self._build_cart_response()

    def remove_coupon(self) -> dict:
        applied_coupon = self.coupon_repository.get_applied_coupon()
        if not applied_coupon:
            raise AppException("No coupon applied to cart", status_code=404)

        self.coupon_repository.clear_applied_coupon()
        return self._build_cart_response()