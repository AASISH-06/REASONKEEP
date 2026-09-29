"""
REASONKEEP — Decision Trace API Router (Module 5)

Exposes:
  POST /api/trace/decision — Reconstruct historical reasoning behind an engineering decision
  GET  /api/trace/status   — Trace service configuration status (safe, no secrets)
"""

from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.hindsight.client import is_configured
from app.trace.schemas import (
    DecisionTraceRequest,
    DecisionTraceResponse,
    TraceStatusResponse,
)
from app.trace.service import assemble_decision_trace

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/trace", tags=["Decision Trace"])


@router.get("/status", response_model=TraceStatusResponse)
async def trace_status() -> TraceStatusResponse:
    """
    Return Decision Trace service status.

    Never exposes HINDSIGHT_API_KEY.
    """
    configured = is_configured()
    return TraceStatusResponse(
        configured=configured,
        bank_id=settings.HINDSIGHT_BANK_ID if configured else "not_configured",
        provider="hindsight",
    )


@router.post("/decision", response_model=DecisionTraceResponse)
async def trace_decision(body: DecisionTraceRequest) -> DecisionTraceResponse:
    """
    Reconstruct an evidence-backed Decision Trace.

    Reconstructs context, problem, constraints, alternatives, rejected alternatives,
    decision, rationale, failures, outcome, and institutional lessons from Hindsight Cloud.
    """
    try:
        return await assemble_decision_trace(body)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error during Decision Trace reconstruction")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Decision Trace failed: {exc}",
        ) from exc
