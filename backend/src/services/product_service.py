from src.core.exceptions import AppException
from src.repositories.product_repository import ProductRepository


class ProductService:
    def __init__(self, repository: ProductRepository | None = None):
        self.repository = repository or ProductRepository()

    def list_products(self, category: str | None = None) -> list[dict]:
        return self.repository.list_products(category=category)

    def get_product_by_id(self, product_id: int) -> dict:
        product = self.repository.get_product_by_id(product_id)

        if not product:
            raise AppException("Product not found", status_code=404)

        return product