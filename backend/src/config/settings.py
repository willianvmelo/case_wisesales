from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Wise Sales API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "wisesales"
    db_user: str = "wisesales"
    db_password: str = "wisesales123"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def database_url(self) -> str:
        return (
            f"dbname={self.db_name} "
            f"user={self.db_user} "
            f"password={self.db_password} "
            f"host={self.db_host} "
            f"port={self.db_port}"
        )


settings = Settings()