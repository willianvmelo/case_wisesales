import sys
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from src.config.database import get_db_connection # noqa: E402


@pytest.fixture(autouse=True)
def reset_cart_state():
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM cart_coupon;")
            cursor.execute("DELETE FROM cart_items;")