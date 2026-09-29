"""
REASONKEEP — Hindsight sub-package (Module 2)

Exports the public interface used by the rest of the application.
"""

from app.hindsight.client import get_hindsight_client, is_configured
from app.hindsight.service import recall_memory, reflect_memory, retain_memory

__all__ = [
    "get_hindsight_client",
    "is_configured",
    "retain_memory",
    "recall_memory",
    "reflect_memory",
]
