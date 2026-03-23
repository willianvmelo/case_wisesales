from psycopg2.extras import RealDictCursor

from src.config.database import get_db_connection


class ProductRepository:
    def list_products(self, category: str | None = None) -> list[dict]:
        query = """
            SELECT id, name, category, price, stock, image_url
            FROM products
            WHERE (%s IS NULL OR category = %s)
            ORDER BY id;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (category, category))
                return [dict(row) for row in cursor.fetchall()]

    def get_product_by_id(self, product_id: int) -> dict | None:
        query = """
            SELECT id, name, category, price, stock, image_url
            FROM products
            WHERE id = %s;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (product_id,))
                row = cursor.fetchone()
                return dict(row) if row else None