"""
REASONKEEP — Decision Trace Schemas (Module 5)

Defines the data contract for historical decision reconstruction:
reconstructing HOW an institutional engineering decision came to exist.
"""

from __future__ import annotations

from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class StageType(str, Enum):
    """Allowed stages in a reconstructed Decision Trace."""

    CONTEXT = "context"
    PROBLEM = "problem"
    CONSTRAINTS = "constraints"
    ALTERNATIVES = "alternatives"
    REJECTED_ALTERNATIVES = "rejected_alternatives"
    DECISION = "decision"
    RATIONALE = "rationale"
    FAILURE = "failure"
    OUTCOME = "outcome"
    LESSON = "lesson"


class StageStatus(str, Enum):
    """Evidence status of a specific stage in the Decision Trace."""

    FOUND = "found"
    PARTIAL = "partial"
    UNAVAILABLE = "unavailable"


class DecisionTraceStage(BaseModel):
    """A single stage in the reconstructed historical decision timeline."""

    stage: StageType = Field(..., description="Stage identifier")
    title: str = Field(..., description="Readable label for this stage")
    description: str | None = Field(None, description="Reconstructed historical facts for this stage")
    status: StageStatus = Field(StageStatus.UNAVAILABLE, description="found | partial | unavailable")
    evidence: list[str] = Field(default_factory=list, description="Direct supporting facts or citations from Hindsight")
    source: str | None = Field(None, description="Origin document or retrospective memo")
    confidence_basis: str | None = Field(None, description="Explanation of grounding support")
    date: str | None = Field(None, description="Documented date or academic semester if available")


class DecisionTraceRequest(BaseModel):
    """Request payload for POST /api/trace/decision"""

    query: str = Field(
        ...,
        min_length=1,
        description="Engineering decision or topic to reconstruct (e.g. 'Why did Project Hermes choose LiDAR?')",
    )
    project: str | None = Field(
        None,
        description="Optional project scope (e.g. 'Campus Autonomous Delivery Rover' or 'Project Hermes')",
    )
    team: str | None = Field(
        None,
        description="Optional team or lab cohort",
    )
    tags: list[str] | None = Field(
        default_factory=list,
        description="Optional tags to focus the retrieval",
    )
    max_evidence: int = Field(
        default=10,
        ge=1,
        le=30,
        description="Maximum number of evidence citations to extract",
    )

    from pydantic import field_validator

    @field_validator("query")
    @classmethod
    def validate_query(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Query must not be empty or whitespace.")
        return s


class TraceEvidenceItem(BaseModel):
    """A raw memory fact retrieved from Hindsight supporting the trace."""

    id: str | None = None
    text: str
    context: str | None = None
    document_id: str | None = None
    type: str | None = None


class DecisionTraceResponse(BaseModel):
    """Structured response for a Decision Trace reconstruction."""

    query: str
    found: bool
    project: str | None = None
    team: str | None = None
    trace: list[DecisionTraceStage] = Field(default_factory=list)
    memories_used: int = 0
    evidence: list[TraceEvidenceItem] = Field(default_factory=list)
    bank_id: str
    message: str | None = None


class TraceStatusResponse(BaseModel):
    """Response for GET /api/trace/status"""

    configured: bool
    bank_id: str
    provider: str = "hindsight"
