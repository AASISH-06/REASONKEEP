"""
REASONKEEP — Hindsight Memory Service (Module 2)

Business logic layer for Retain / Recall / Reflect operations.
All calls go to real Hindsight Cloud — no mocking, no local dictionaries.

Key design rules:
- Use ASYNC methods (aretain / arecall / areflect) inside FastAPI async endpoints.
  Calling the sync wrappers inside an already-running asyncio loop raises
  RuntimeError: This event loop is already running.
- Never fabricate memory. If Hindsight returns nothing, return found=False.
- Distinguish clearly: memory found / memory not found / Hindsight error.
- Never expose the API key in error messages or logs.
- bank_id is passed per-call (it is NOT in the Hindsight constructor).

Verified against hindsight-client==0.10.1 exact signatures:
  aretain(bank_id, content, timestamp, context, document_id, metadata, ...)
  arecall(bank_id, query, max_tokens, budget, ...)
  areflect(bank_id, query, budget, context, ...)
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.config import settings
from app.hindsight.client import get_hindsight_client
from app.hindsight.schemas import (
    MemoryItem,
    RecallResult,
    ReflectResult,
    RetainResult,
)

logger = logging.getLogger(__name__)


def _bank_id() -> str:
    """Return the configured bank ID, raising a clean error if missing."""
    bid = settings.HINDSIGHT_BANK_ID
    if not bid:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="HINDSIGHT_BANK_ID is not configured.",
        )
    return bid


def _get_client():
    """Return the Hindsight client, raising a clean 503 if not configured."""
    try:
        return get_hindsight_client()
    except RuntimeError as exc:
        logger.error("Hindsight client unavailable: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Hindsight memory service is not configured. Check environment variables.",
        ) from exc


# ─────────────────────────────────────────────────────────────
# RETAIN
# ─────────────────────────────────────────────────────────────

async def retain_memory(
    content: str,
    context: str | None = None,
    document_id: str | None = None,
    metadata: dict[str, str] | None = None,
    tags: list[str] | None = None,
) -> RetainResult:
    """
    Store a piece of institutional memory in Hindsight Cloud.

    Uses aretain() (async) to avoid event-loop conflicts with FastAPI.
    """
    client = _get_client()
    bank = _bank_id()

    try:
        response = await client.aretain(
            bank_id=bank,
            content=content,
            timestamp=datetime.now(tz=timezone.utc),
            context=context or None,
            document_id=document_id or None,
            metadata=metadata or None,
            tags=tags or None,
        )
        logger.info(
            "aretain() → bank=%s items_count=%d",
            bank,
            response.items_count,
        )
        return RetainResult(
            found=response.success,
            bank_id=response.bank_id,
            items_count=response.items_count,
            is_async=response.var_async,
            operation_id=response.operation_id,
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Hindsight aretain() failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Memory retain failed. The Hindsight service returned an error.",
        ) from exc


# ─────────────────────────────────────────────────────────────
# RECALL
# ─────────────────────────────────────────────────────────────

async def recall_memory(query: str) -> RecallResult:
    """
    Recall relevant institutional memories for a query.

    Uses arecall() (async) to avoid event-loop conflicts with FastAPI.
    Returns RecallResult with found=True/False and a list of MemoryItem.
    Never fabricates results — if Hindsight returns nothing, found=False.
    """
    client = _get_client()
    bank = _bank_id()

    try:
        response = await client.arecall(
            bank_id=bank,
            query=query,
            max_tokens=4096,
            budget="mid",
        )

        results = response.results or []
        found = len(results) > 0

        logger.info(
            "arecall() → bank=%s query=%r found=%d items",
            bank,
            query[:80],
            len(results),
        )

        memories = [
            MemoryItem(
                id=r.id,
                text=r.text,
                type=r.type,
                context=r.context,
                document_id=r.document_id,
                metadata=r.metadata,
            )
            for r in results
        ]

        return RecallResult(
            found=found,
            count=len(memories),
            memories=memories,
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Hindsight arecall() failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Memory recall failed. The Hindsight service returned an error.",
        ) from exc


# ─────────────────────────────────────────────────────────────
# REFLECT
# ─────────────────────────────────────────────────────────────

async def reflect_memory(query: str, context: str | None = None) -> ReflectResult:
    """
    Reflect over institutional memory to produce a grounded reasoning response.

    Uses areflect() (async) — NOT a plain LLM call.
    Returns ReflectResult with found=True/False.
    Never replaces Hindsight Reflect with local generation.
    """
    client = _get_client()
    bank = _bank_id()

    try:
        response = await client.areflect(
            bank_id=bank,
            query=query,
            budget="low",
            context=context or None,
            include_facts=True,
        )

        # Determine whether Hindsight grounded the response on actual relevant memories.
        memories_used = 0
        evidence: list[dict[str, Any]] = []
        if response.based_on and response.based_on.memories:
            memories_used = len(response.based_on.memories)
            for m in response.based_on.memories:
                evidence.append({
                    "id": getattr(m, "id", None),
                    "text": getattr(m, "text", ""),
                    "type": getattr(m, "type", None),
                    "context": getattr(m, "context", None),
                    "occurred_start": getattr(m, "occurred_start", None),
                    "occurred_end": getattr(m, "occurred_end", None),
                })

        # If Hindsight explicitly indicates no relevant information was found, mark found=False
        text_prefix = (response.text or "")[:250].lower()
        not_found_indicators = [
            "does not contain",
            "does not record",
            "no information",
            "no mention",
            "not found in",
            "no relevant",
            "no records",
            "cannot find",
            "could not find",
        ]
        explicitly_not_found = any(ind in text_prefix for ind in not_found_indicators)

        found = bool(response.text and memories_used > 0 and not explicitly_not_found)

        logger.info(
            "areflect() → bank=%s query=%r memories_used=%d",
            bank,
            query[:80],
            memories_used,
        )

        return ReflectResult(
            found=found,
            response=response.text,
            memories_used=memories_used,
            evidence=evidence if found else [],
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Hindsight areflect() failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Memory reflect failed. The Hindsight service returned an error.",
        ) from exc
