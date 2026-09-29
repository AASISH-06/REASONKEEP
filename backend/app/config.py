"""
REASONKEEP — Configuration Module
Reads environment variables safely using pydantic-settings.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file."""

    # ── Core ────────────────────────────────────────────────
    APP_ENV: str = "development"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"

    # ── Hindsight (Module 2) ─────────────────────────────────
    # Values are read from .env — never hard-coded.
    # Do NOT add defaults that look like real credentials.
    HINDSIGHT_API_URL: str = "https://api.hindsight.vectorize.io"
    HINDSIGHT_API_KEY: str = ""
    HINDSIGHT_BANK_ID: str = "reasonkeep-university-demo"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Singleton settings instance used throughout the application.
settings = Settings()
