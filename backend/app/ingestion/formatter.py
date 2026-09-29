"""
REASONKEEP — Institutional Memory Formatter (Module 3)

Transforms structured university project decisions into cohesive, high-fidelity
memory narratives for Hindsight Cloud retention. Preserves relationships between
decisions, reasons, constraints, alternatives, failures, and lessons.
Never fabricates missing information.
"""

from __future__ import annotations

from app.ingestion.schemas import InstitutionalMemoryInput


def format_institutional_memory(memory: InstitutionalMemoryInput) -> str:
    """
    Construct a coherent narrative and structured memory block from structured input.

    Preserves why decisions were made, what constraints bound the team, what alternatives
    were considered and rejected, and what lessons future cohorts must inherit.
    """
    sections: list[str] = []

    # 1. Header / Context
    header_parts = [f"PROJECT: {memory.project.strip()}"]
    if memory.team_context and memory.team_context.strip():
        header_parts.append(f"TEAM: {memory.team_context.strip()}")
    if memory.organization_context and memory.organization_context.strip():
        header_parts.append(f"ORG: {memory.organization_context.strip()}")
    if memory.date and memory.date.strip():
        header_parts.append(f"DATE/TERM: {memory.date.strip()}")
    if memory.source and memory.source.strip():
        header_parts.append(f"SOURCE: {memory.source.strip()}")
    sections.append(" | ".join(header_parts))

    # 2. Title & Type
    title_str = memory.title.strip() if memory.title and memory.title.strip() else memory.decision
    if title_str:
        sections.append(f"TOPIC: {title_str} (Type: {memory.memory_type.value.upper()})")

    # 3. Decision
    if memory.decision and memory.decision.strip():
        sections.append(f"DECISION MADE: {memory.decision.strip()}")

    # 4. Reason / Rationale
    if memory.reason and memory.reason.strip():
        sections.append(f"RATIONALE: {memory.reason.strip()}")

    # 5. Constraints
    if memory.constraints:
        valid_constraints = [c.strip() for c in memory.constraints if c and c.strip()]
        if valid_constraints:
            sections.append(f"CONSTRAINTS & REQUIREMENTS: {'; '.join(valid_constraints)}")

    # 6. Alternatives Considered
    if memory.alternatives:
        valid_alts = [a.strip() for a in memory.alternatives if a and a.strip()]
        if valid_alts:
            sections.append(f"ALTERNATIVES EVALUATED: {', '.join(valid_alts)}")

    # 7. Rejected Alternatives with Rationale
    if memory.rejected_alternatives:
        rejected_lines = []
        for ra in memory.rejected_alternatives:
            alt_name = ra.alternative.strip()
            alt_reason = ra.reason.strip()
            if alt_name and alt_reason:
                rejected_lines.append(f"Rejected '{alt_name}' because: {alt_reason}")
            elif alt_name:
                rejected_lines.append(f"Rejected '{alt_name}'")
        if rejected_lines:
            sections.append(f"REJECTED ALTERNATIVES: {' | '.join(rejected_lines)}")

    # 8. Failures or Roadblocks Encountered
    if memory.failure and memory.failure.strip():
        sections.append(f"FAILED APPROACH / ROADBLOCK: {memory.failure.strip()}")

    # 9. Outcome
    if memory.outcome and memory.outcome.strip():
        sections.append(f"OBSERVED OUTCOME: {memory.outcome.strip()}")

    # 10. Institutional Lesson for Future Teams
    if memory.lesson and memory.lesson.strip():
        sections.append(f"INSTITUTIONAL LESSON FOR FUTURE TEAMS: {memory.lesson.strip()}")

    return "\n\n".join(sections)


def extract_metadata(memory: InstitutionalMemoryInput) -> dict[str, str]:
    """
    Extract string-based key-value metadata supported by Hindsight.

    Hindsight Cloud accepts dict[str, str] for metadata.
    """
    meta: dict[str, str] = {
        "project": memory.project.strip(),
        "memory_type": memory.memory_type.value,
    }
    if memory.project_type and memory.project_type.strip():
        meta["project_type"] = memory.project_type.strip()
    if memory.team_context and memory.team_context.strip():
        meta["team_context"] = memory.team_context.strip()
    if memory.source and memory.source.strip():
        meta["source"] = memory.source.strip()
    if memory.date and memory.date.strip():
        meta["date"] = memory.date.strip()
    if memory.tags:
        valid_tags = [t.strip() for t in memory.tags if t and t.strip()]
        if valid_tags:
            meta["tags"] = ",".join(valid_tags)
    return meta
