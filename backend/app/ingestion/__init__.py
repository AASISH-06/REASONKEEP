"""
REASONKEEP — Institutional Memory Ingestion Sub-Package (Module 3)

Exports the public ingestion models, formatter, and ingestion service.
"""

from app.ingestion.demo_data import DEMO_MEMORIES
from app.ingestion.formatter import extract_metadata, format_institutional_memory
from app.ingestion.schemas import (
    IngestResult,
    InstitutionalMemoryInput,
    MemoryType,
    RejectedAlternative,
)
from app.ingestion.service import ingest_institutional_decision

__all__ = [
    "MemoryType",
    "RejectedAlternative",
    "InstitutionalMemoryInput",
    "IngestResult",
    "format_institutional_memory",
    "extract_metadata",
    "ingest_institutional_decision",
    "DEMO_MEMORIES",
]
