"""
REASONKEEP — Institutional Memory Assistant API Router (Module 4)

Exposes:
  POST /api/assistant/ask — Query institutional engineering memory with grounded reasoning
"""

from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException, status

from app.assistant.schemas import AssistantAskRequest, AssistantAskResponse
from app.assistant.service import query_assistant

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])


@router.post("/ask", response_model=AssistantAskResponse)
async def ask_assistant(body: AssistantAskRequest) -> AssistantAskResponse:
    """
    Query the Institutional Memory Assistant.

    Answers natural-language questions about previous decisions, reasons,
    constraints, rejected alternatives, failures, and lessons from institutional memory.
    """
    try:
        return await query_assistant(body)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Error in assistant query")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assistant query failed: {exc}",
        ) from exc
