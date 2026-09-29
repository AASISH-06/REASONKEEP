"""
REASONKEEP — Memory API Router (Module 2)

Exposes:
  GET  /api/memory/status   — Hindsight connection status (no secrets exposed)
  POST /api/memory/retain   — Store institutional memory
  POST /api/memory/recall   — Retrieve relevant memories
  POST /api/memory/reflect  — Reason over memories
"""

from __future__ import annotations

from fastapi import APIRouter

from app.config import settings
from app.hindsight.client import is_configured
from app.hindsight.schemas import (
    MemoryStatusResponse,
    RecallRequest,
    RecallResult,
    ReflectRequest,
    ReflectResult,
    RetainRequest,
    RetainResult,
)
from app.hindsight.service import recall_memory, reflect_memory, retain_memory

router = APIRouter(prefix="/api/memory", tags=["Memory"])


@router.get("/status", response_model=MemoryStatusResponse)
async def memory_status() -> MemoryStatusResponse:
    """
    Return Hindsight configuration status.

    Never exposes the API key.
    Returns bank_id and the configured API URL (not the key).
    """
    configured = is_configured()
    return MemoryStatusResponse(
        configured=configured,
        bank_id=settings.HINDSIGHT_BANK_ID if configured else None,
        provider="hindsight",
        api_url=settings.HINDSIGHT_API_URL if configured else None,
    )


@router.post("/retain", response_model=RetainResult)
async def retain(body: RetainRequest) -> RetainResult:
    """
    Store institutional memory in Hindsight Cloud.

    Accepts free-text content plus optional context, document_id, and metadata.
    """
    return await retain_memory(
        content=body.content,
        context=body.context,
        document_id=body.document_id,
        metadata=body.metadata,
    )


@router.post("/recall", response_model=RecallResult)
async def recall(body: RecallRequest) -> RecallResult:
    """
    Recall relevant institutional memories for a query.

    Returns found=True with memories list if results exist,
    found=False with empty list if no relevant memories are found.
    """
    return await recall_memory(query=body.query)


@router.post("/reflect", response_model=ReflectResult)
async def reflect(body: ReflectRequest) -> ReflectResult:
    """
    Reflect over institutional memory to produce a grounded response.

    Uses Hindsight Reflect — NOT a plain LLM call.
    Returns found=True only when Hindsight grounded the answer on real memories.
    """
    return await reflect_memory(query=body.query, context=body.context)
