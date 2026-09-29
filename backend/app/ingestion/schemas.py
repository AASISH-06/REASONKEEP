"""
REASONKEEP — Institutional Memory Ingestion Schemas (Module 3)

Defines the structured data models for capturing institutional memory across
university engineering, research, and technical project teams.
Preserves WHY something was decided, not merely WHAT was done.
"""

from __future__ import annotations

from enum import Enum
from typing import Any
from pydantic import BaseModel, Field, model_validator


class MemoryType(str, Enum):
    """Allowed memory types in REASONKEEP institutional memory model."""

    DECISION = "decision"
    CONSTRAINT = "constraint"
    ALTERNATIVE = "alternative"
    FAILURE = "failure"
    OUTCOME = "outcome"
    LESSON = "lesson"
    PROJECT = "project"


class RejectedAlternative(BaseModel):
    """An alternative considered by the team but rejected, with reasoning."""

    alternative: str = Field(..., min_length=1, description="The alternative approach/tool considered")
    reason: str = Field(..., min_length=1, description="Specific technical or operational reason for rejection")


class InstitutionalMemoryInput(BaseModel):
    """
    Structured institutional knowledge representation.

    Captures context, decisions, constraints, trade-offs, failures, and lessons
    to ensure future student cohorts and research teams retain accumulated wisdom.
    """

    project: str = Field(
        ...,
        min_length=1,
        description="Name of the university engineering/research project (e.g. Autonomous Campus Rover)",
    )
    project_type: str | None = Field(
        default="engineering_project",
        description="Category of the project (e.g. capstone, competition_team, research_lab, student_club)",
    )
    organization_context: str | None = Field(
        default="University Engineering & Research",
        description="Higher education context (department, lab, or academic faculty)",
    )
    memory_type: MemoryType = Field(
        default=MemoryType.DECISION,
        description="Type of memory item: decision, constraint, alternative, failure, outcome, lesson, project",
    )
    title: str | None = Field(
        None,
        description="Brief descriptive title of this memory entry",
    )
    decision: str | None = Field(
        None,
        description="The technical or architectural decision made",
    )
    reason: str | None = Field(
        None,
        description="The rationale and justification behind the decision",
    )
    constraints: list[str] = Field(
        default_factory=list,
        description="Physical, budgetary, academic, or technical constraints driving the choice",
    )
    alternatives: list[str] = Field(
        default_factory=list,
        description="Alternative technologies, architectures, or methods evaluated",
    )
    rejected_alternatives: list[RejectedAlternative] = Field(
        default_factory=list,
        description="Specific rejected alternatives along with the reason for rejection",
    )
    failure: str | None = Field(
        None,
        description="Failed experiments, roadblocks, or bugs encountered that led to this understanding",
    )
    outcome: str | None = Field(
        None,
        description="Measured outcome or observed effect of this decision",
    )
    lesson: str | None = Field(
        None,
        description="Key institutional takeaway or advice for successor student teams",
    )
    team_context: str | None = Field(
        None,
        description="Team or lab context (e.g. Robotics Subsystem Team, Avionics Cohort 2024)",
    )
    date: str | None = Field(
        None,
        description="Date or academic term (e.g. 2026-09-28 or Fall 2024)",
    )
    source: str | None = Field(
        None,
        description="Origin source document or meeting log (e.g. design-review-minutes, sprint-retro)",
    )
    tags: list[str] = Field(
        default_factory=list,
        description="Domain tags for indexing (e.g. ['robotics', 'sensors', 'lidar'])",
    )

    @model_validator(mode="after")
    def validate_content_presence(self) -> InstitutionalMemoryInput:
        """Validate that project is not whitespace and at least one substantive field is provided."""
        if not self.project or not self.project.strip():
            raise ValueError("project must not be empty or whitespace.")

        substantive = [
            self.decision,
            self.reason,
            self.lesson,
            self.failure,
            self.outcome,
            self.title,
        ]
        if not any(s and s.strip() for s in substantive):
            raise ValueError(
                "Institutional memory must contain at least one substantive content field "
                "(decision, reason, lesson, failure, outcome, or title)."
            )
        return self


class IngestResult(BaseModel):
    """Result of an institutional memory ingestion operation."""

    success: bool
    project: str
    memory_type: str
    title: str | None = None
    formatted_content: str
    bank_id: str
    items_count: int
    operation_id: str | None = None
