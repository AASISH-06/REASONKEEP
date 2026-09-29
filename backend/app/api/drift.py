"""
REASONKEEP — Decision Drift API Router (Module 6)

Exposes:
  POST /api/drift/analyze — Evaluate proposal against historical institutional memory
  GET  /api/drift/status  — Drift detection subsystem configuration status (safe, no secrets)
"""

from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.drift.schemas import (
    DriftAnalysisRequest,
    DriftAnalysisResponse,
    DriftStatusResponse,
)
from app.drift.service import analyze_decision_drift
from app.hindsight.client import is_configured

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/drift", tags=["Decision Drift"])


@router.get("/status", response_model=DriftStatusResponse)
async def drift_status() -> DriftStatusResponse:
    """
    Return Decision Drift Detection service status.

    Never exposes HINDSIGHT_API_KEY.
    """
    configured = is_configured()
    return DriftStatusResponse(
        configured=configured,
        bank_id=settings.HINDSIGHT_BANK_ID if configured else "not_configured",
        provider="hindsight",
    )


@router.post("/analyze", response_model=DriftAnalysisResponse)
async def analyze_drift(body: DriftAnalysisRequest) -> DriftAnalysisResponse:
    """
    Analyze whether a current proposal conflicts with documented historical memory.

    Compares proposal against past decisions, constraints, failures, and lessons
    retrieved from Hindsight Cloud.
    """
    try:
        return await analyze_decision_drift(body)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error during Decision Drift analysis")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Decision Drift analysis failed: {exc}",
        ) from exc
