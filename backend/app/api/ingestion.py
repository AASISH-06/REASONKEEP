"""
REASONKEEP — Ingestion API Router (Module 3 & Module 8)

Exposes:
  POST /api/ingest/decision   — Ingest structured institutional engineering memory
  POST /api/ingest/demo-seed  — Ingest curated synthetic university engineering memories (idempotent)
  GET  /api/ingest/demo-data  — Preview the synthetic demo dataset
"""

from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.ingestion.demo_data import DEMO_MEMORIES
from app.ingestion.schemas import IngestResult, InstitutionalMemoryInput
from app.ingestion.service import ingest_institutional_decision

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ingest", tags=["Ingestion"])


class DemoSeedResult(BaseModel):
    """Result of seeding synthetic demo memories with idempotency guarantees."""

    total: int
    successful: int
    failed: int
    already_present: int = 0
    newly_seeded: int = 0
    results: list[IngestResult]
    note: str = "DEMO / SYNTHETIC DATA for Meridian Institute of Technology — Computer Engineering Research Lab"


@router.post("/decision", response_model=IngestResult)
async def ingest_decision(body: InstitutionalMemoryInput) -> IngestResult:
    """
    Ingest a structured institutional engineering memory into Hindsight Cloud.

    Preserves decisions, reasoning, constraints, alternatives, failures,
    outcomes, and lessons for future university engineering teams.
    """
    try:
        return await ingest_institutional_decision(body, check_existing=False)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error during institutional memory ingestion")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ingestion failed: {exc}",
        ) from exc


@router.get("/demo-data", response_model=list[InstitutionalMemoryInput])
async def get_demo_data() -> list[InstitutionalMemoryInput]:
    """
    Return the curated synthetic university engineering memories.

    Clearly labeled as DEMO / SYNTHETIC DATA.
    """
    return DEMO_MEMORIES


@router.post("/demo-seed", response_model=DemoSeedResult)
async def seed_demo_memories() -> DemoSeedResult:
    """
    Batch ingest the curated synthetic engineering memories into Hindsight Cloud.

    Uses deterministic document IDs and idempotent presence checking to prevent
    duplicate memory accumulation across repeated executions.
    """
    results: list[IngestResult] = []
    successful = 0
    failed = 0
    already_present = 0
    newly_seeded = 0

    for mem in DEMO_MEMORIES:
        try:
            res = await ingest_institutional_decision(mem, check_existing=True)
            results.append(res)
            if res.success:
                successful += 1
                if res.operation_id and res.operation_id.startswith("idempotent-cached-"):
                    already_present += 1
                else:
                    newly_seeded += 1
            else:
                failed += 1
        except Exception as exc:
            logger.error("Failed to seed demo memory %r: %s", mem.title, exc)
            failed += 1

    return DemoSeedResult(
        total=len(DEMO_MEMORIES),
        successful=successful,
        failed=failed,
        already_present=already_present,
        newly_seeded=newly_seeded,
        results=results,
    )
