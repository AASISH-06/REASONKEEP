"""
REASONKEEP — Decision Drift Detection Schemas (Module 6)

Pydantic schemas for evaluating proposed engineering changes against
historical institutional memory stored in Hindsight Cloud.
Never fabricates missing historical decisions or evidence.
"""

from __future__ import annotations

from enum import Enum
from typing import Any
from pydantic import BaseModel, Field, field_validator


class DriftStatus(str, Enum):
    """Classification of a proposal against documented institutional memory."""

    DRIFT_DETECTED = "drift_detected"
    ALIGNED = "aligned"
    INDETERMINATE = "indeterminate"
    NO_MEMORY = "no_memory"


class DriftEvidenceItem(BaseModel):
    """An individual evidence unit retrieved from Hindsight memory."""

    id: str | None = None
    text: str
    context: str | None = None
    document_id: str | None = None
    type: str | None = None


class DriftAnalysisRequest(BaseModel):
    """Request payload to analyze a proposal for historical decision drift."""

    proposal: str = Field(
        ...,
        description="The current engineering proposal or architectural change to evaluate",
    )
    project: str | None = Field(
        None,
        description="Optional project scope (e.g. 'Campus Autonomous Delivery Rover')",
    )
    team: str | None = Field(
        None,
        description="Optional team or subsystem context",
    )
    tags: list[str] = Field(
        default_factory=list,
        description="Optional domain tags for contextual refinement",
    )
    max_evidence: int = Field(
        15,
        ge=1,
        le=50,
        description="Maximum supporting evidence items to return",
    )

    @field_validator("proposal")
    @classmethod
    def validate_proposal(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Proposal query must not be empty or whitespace.")
        return s


class DriftAnalysisResponse(BaseModel):
    """Structured response containing the drift classification and grounded institutional evidence."""

    proposal: str
    status: DriftStatus
    explanation: str
    confidence_basis: str
    previous_decision: str | None = None
    historical_rationale: str | None = None
    historical_constraints: list[str] = Field(default_factory=list)
    documented_conflicts: list[str] = Field(default_factory=list)
    historical_outcomes: list[str] = Field(default_factory=list)
    institutional_lesson: str | None = None
    evidence: list[DriftEvidenceItem] = Field(default_factory=list)
    memories_used: int = 0
    project: str | None = None
    team: str | None = None
    bank_id: str


class DriftStatusResponse(BaseModel):
    """Safe status metadata for Decision Drift Detection subsystem."""

    configured: bool
    bank_id: str
    provider: str = "hindsight"
