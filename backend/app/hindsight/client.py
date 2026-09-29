"""
REASONKEEP — Hindsight Client (Module 2)

Initializes the official hindsight-client once and provides a singleton
accessor used throughout the application. Configuration is read exclusively
from environment variables — the API key is never exposed in logs or responses.

Verified against hindsight-client==0.10.1 API signatures.

Hindsight.__init__(base_url, api_key, timeout, ...)
  — bank_id is NOT in the constructor; it is passed per-call.
"""

from __future__ import annotations

import logging

from hindsight_client import Hindsight

from app.config import settings

logger = logging.getLogger(__name__)

# Module-level singleton — initialized once at import time.
_client: Hindsight | None = None


def get_hindsight_client() -> Hindsight:
    """
    Return the application-wide Hindsight client singleton.

    Raises RuntimeError if Hindsight is not configured (missing env vars).
    The API key is read once here and never logged or re-exposed.
    """
    global _client

    if _client is not None:
        return _client

    if not settings.HINDSIGHT_API_KEY:
        raise RuntimeError(
            "HINDSIGHT_API_KEY is not set. "
            "Copy backend/.env.example to backend/.env and fill in your credentials."
        )
    if not settings.HINDSIGHT_API_URL:
        raise RuntimeError("HINDSIGHT_API_URL is not set.")

    _client = Hindsight(
        base_url=settings.HINDSIGHT_API_URL,
        api_key=settings.HINDSIGHT_API_KEY,
        timeout=30.0,
    )

    logger.info(
        "Hindsight client initialized — endpoint: %s  bank: %s",
        settings.HINDSIGHT_API_URL,
        settings.HINDSIGHT_BANK_ID,
    )

    return _client


def is_configured() -> bool:
    """Return True if Hindsight credentials are available in the environment."""
    return bool(settings.HINDSIGHT_API_KEY and settings.HINDSIGHT_API_URL and settings.HINDSIGHT_BANK_ID)
