"""
REASONKEEP — Institutional Memory Assistant Schemas (Module 4)

Defines the request and response contracts for the Institutional Memory Assistant.
"""

from __future__ import annotations

from typing import Any
from pydantic import BaseModel, Field


class AssistantAskRequest(BaseModel):
    """Request contract for POST /api/assistant/ask"""

    query: str = Field(
        ...,
        min_length=1,
        description="Natural-language question about past decisions, reasons, constraints, failures, lessons",
    )
    project: str | None = Field(
        None,
        description="Optional project context to narrow or contextualize the query (e.g. 'Project Hermes')",
    )
    team: str | None = Field(
        None,
        description="Optional team or lab context (e.g. 'Perception & Sensing')",
    )
    tags: list[str] | None = Field(
        None,
        description="Optional domain tags to focus the retrieval",
    )
    memory_type: str | None = Field(
        None,
        description="Optional memory type filter (e.g. 'decision', 'failure', 'lesson')",
    )

    from pydantic import field_validator

    @field_validator("query")
    @classmethod
    def validate_query(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Query must not be empty or whitespace.")
        return s


class MemoryEvidenceItem(BaseModel):
    """An individual piece of institutional memory evidence supporting the answer."""

    id: str | None = None
    text: str
    context: str | None = None
    document_id: str | None = None
    type: str | None = None


class AssistantContext(BaseModel):
    """Contextual metadata applied during the assistant query."""

    project: str | None = None
    team: str | None = None
    tags: list[str] | None = None
    augmented_query: str


class AssistantAskResponse(BaseModel):
    """
    Structured response contract for POST /api/assistant/ask.

    Clearly distinguishes between:
      1. institutional evidence found (grounded answer, cited evidence, memories_used)
      2. no relevant institutional evidence found (found=false, no-memory explanation, zero fabrication)
    """

    query: str
    found: bool
    answer: str
    memories_used: int
    evidence: list[MemoryEvidenceItem]
    context: AssistantContext
    bank_id: str
