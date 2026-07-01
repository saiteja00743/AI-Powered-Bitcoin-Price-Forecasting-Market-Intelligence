from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    IBM_API_KEY: str = "mock"
    IBM_SCORING_URL: str = "mock"
    OPENAI_API_KEY: str = "mock"
    COINGECKO_API_KEY: str = "mock"
    CRYPTOPANIC_API_KEY: str = "mock"
    APP_ENV: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
