from psycopg2.extras import RealDictCursor

from src.config.database import get_db_connection


class CartRepository:
    def list_cart_items(self) -> list[dict]:
        query = """
            SELECT
                ci.id,
                ci.product_id,
                ci.quantity,
                p.name,
                p.category,
                p.price,
                p.stock,
                p.image_url
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            ORDER BY ci.id;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query)
                return [dict(row) for row in cursor.fetchall()]

    def get_cart_item_by_id(self, item_id: int) -> dict | None:
        query = """
            SELECT id, product_id, quantity
            FROM cart_items
            WHERE id = %s;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (item_id,))
                row = cursor.fetchone()
                return dict(row) if row else None

    def get_cart_item_by_product_id(self, product_id: int) -> dict | None:
        query = """
            SELECT id, product_id, quantity
            FROM cart_items
            WHERE product_id = %s;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (product_id,))
                row = cursor.fetchone()
                return dict(row) if row else None

    def add_cart_item(self, product_id: int, quantity: int) -> dict:
        query = """
            INSERT INTO cart_items (product_id, quantity)
            VALUES (%s, %s)
            RETURNING id, product_id, quantity;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (product_id, quantity))
                return dict(cursor.fetchone())

    def update_cart_item(self, item_id: int, quantity: int) -> dict:
        query = """
            UPDATE cart_items
            SET quantity = %s
            WHERE id = %s
            RETURNING id, product_id, quantity;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (quantity, item_id))
                return dict(cursor.fetchone())

    def delete_cart_item(self, item_id: int) -> None:
        query = """
            DELETE FROM cart_items
            WHERE id = %s;
        """

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, (item_id,))