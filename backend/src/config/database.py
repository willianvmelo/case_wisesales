from contextlib import contextmanager

from psycopg2.pool import SimpleConnectionPool

from src.config.settings import settings


class DatabaseConnectionError(Exception):
    pass


connection_pool = SimpleConnectionPool(
    minconn=1,
    maxconn=5,
    dsn=settings.database_url,
)


@contextmanager
def get_db_connection():
    connection = None
    try:
        connection = connection_pool.getconn()
        yield connection
        connection.commit()
    except Exception as exc:
        if connection:
            connection.rollback()
        raise DatabaseConnectionError("Failed to execute database operation") from exc
    finally:
        if connection:
            connection_pool.putconn(connection)