"""
REASONKEEP — Hindsight Pydantic Schemas (Module 2)

Request and response schemas for the /api/memory/* endpoints.
Only fields actually supported by hindsight-client==0.10.x are exposed.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


# ─────────────────────────────────────────────────────────────
# Request schemas
# ─────────────────────────────────────────────────────────────

class RetainRequest(BaseModel):
    """Request body for POST /api/memory/retain"""

    content: str = Field(..., description="The institutional memory text to store")
    context: str | None = Field(None, description="Optional context/category for the memory")
    document_id: str | None = Field(None, description="Optional stable document identifier")
    metadata: dict[str, str] | None = Field(None, description="Optional key-value metadata")


class RecallRequest(BaseModel):
    """Request body for POST /api/memory/recall"""

    query: str = Field(..., description="Natural language query to recall relevant memories")


class ReflectRequest(BaseModel):
    """Request body for POST /api/memory/reflect"""

    query: str = Field(..., description="Question to reason over using institutional memory")
    context: str | None = Field(None, description="Optional additional context for the reflection")


# ─────────────────────────────────────────────────────────────
# Response schemas
# ─────────────────────────────────────────────────────────────

class RetainResult(BaseModel):
    """Response for a successful retain operation"""

    found: bool = True
    bank_id: str
    items_count: int
    is_async: bool = False
    operation_id: str | None = None


class MemoryItem(BaseModel):
    """A single recalled memory item"""

    id: str
    text: str
    type: str | None = None
    context: str | None = None
    document_id: str | None = None
    metadata: dict[str, str] | None = None


class RecallResult(BaseModel):
    """Response for a recall operation"""

    found: bool
    count: int
    memories: list[MemoryItem]


class ReflectResult(BaseModel):
    """Response for a reflect operation"""

    found: bool
    response: str
    memories_used: int
    evidence: list[dict[str, Any]] = Field(default_factory=list)


class MemoryStatusResponse(BaseModel):
    """Response for GET /api/memory/status"""

    configured: bool
    bank_id: str | None
    provider: str = "hindsight"
    api_url: str | None = None


class ErrorResponse(BaseModel):
    """Standard error envelope — never exposes credentials"""

    error: str
    detail: str | None = None
