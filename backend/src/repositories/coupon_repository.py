from psycopg2.extras import RealDictCursor

from src.config.database import get_db_connection


class CouponRepository:
    def get_coupon_by_code(self, code: str) -> dict | None:
        query = """
            SELECT id, code, discount_type, discount_value, active, expires_at
            FROM coupons
            WHERE code = %s;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, (code,))
                row = cursor.fetchone()
                return dict(row) if row else None

    def get_applied_coupon(self) -> dict | None:
        query = """
            SELECT
                c.id,
                c.code,
                c.discount_type,
                c.discount_value,
                c.active,
                c.expires_at
            FROM cart_coupon cc
            JOIN coupons c ON c.id = cc.coupon_id
            ORDER BY cc.id DESC
            LIMIT 1;
        """

        with get_db_connection() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query)
                row = cursor.fetchone()
                return dict(row) if row else None

    def clear_applied_coupon(self) -> int:
        query = "DELETE FROM cart_coupon;"

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query)
                return cursor.rowcount

    def apply_coupon(self, coupon_id: int) -> None:
        query = """
            INSERT INTO cart_coupon (coupon_id)
            VALUES (%s);
        """

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, (coupon_id,))