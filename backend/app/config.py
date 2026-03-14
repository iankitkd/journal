from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Journal API"

    # Database
    database_url: str

    # Groq
    groq_api_key: str
    llm_model: str

    class Config:
        env_prefix = "ARVYAX_"
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

