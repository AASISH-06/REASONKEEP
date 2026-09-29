"""
REASONKEEP — Decision Trace Assembly Service (Module 5)

Reconstructs the historical reasoning timeline behind an engineering decision:
1. Context
2. Problem
3. Constraints
4. Alternatives
5. Rejected Alternatives & Why
6. Decision Made
7. Decision Rationale
8. Failure / Roadblock
9. Outcome
10. Institutional Lesson

Grounded strictly in Hindsight Cloud institutional memory. Never fabricates missing stages.
"""

from __future__ import annotations

import logging
import re
from typing import Any

from app.config import settings
from app.hindsight.service import recall_memory, reflect_memory
from app.trace.schemas import (
    DecisionTraceRequest,
    DecisionTraceResponse,
    DecisionTraceStage,
    StageStatus,
    StageType,
    TraceEvidenceItem,
)

logger = logging.getLogger(__name__)

DATE_REGEX = re.compile(r"\b(20\d\d-[01]\d-[0-3]\d|[A-Z][a-z]+ \d{4}|Fall \d{4}|Spring \d{4})\b")


def _extract_date(text: str) -> str | None:
    """Extract a date or semester string from text if present."""
    match = DATE_REGEX.search(text)
    return match.group(0) if match else None


def _clean_project_name(project: str | None, query: str) -> str:
    """Normalize project name from query and parameter."""
    if project and project.strip():
        p = project.strip()
        if "hermes" in p.lower() and "campus" not in p.lower():
            return "Campus Autonomous Delivery Rover (Project Hermes)"
        return p
    if "hermes" in query.lower():
        return "Campus Autonomous Delivery Rover (Project Hermes)"
    if "delivery rover" in query.lower() or "rover" in query.lower():
        return "Campus Autonomous Delivery Rover"
    return "Institutional Engineering Project"


def _extract_query_keywords(query: str) -> set[str]:
    """Extract substantive search terms from user query for topical alignment."""
    stopwords = {
        "trace", "the", "for", "and", "why", "what", "did", "was", "how",
        "about", "project", "campus", "selection", "decision", "made", "with",
        "from", "regarding", "previous", "teams", "team", "were", "this",
        "engineering", "history"
    }
    return {w for w in re.findall(r"\w+", query.lower()) if len(w) > 2 and w not in stopwords}


def _categorize_facts(
    facts: list[str],
    query_keywords: set[str],
) -> dict[StageType, list[tuple[str, str | None, int]]]:
    """
    Categorize retrieved Hindsight fact strings into specific decision trace stages,
    scoring each fact's topical relevance against query_keywords.
    """
    buckets: dict[StageType, list[tuple[str, str | None, int]]] = {s: [] for s in StageType}

    for f in facts:
        text = f.strip()
        if not text:
            continue
        lower = text.lower()
        fact_date = _extract_date(text)
        score = sum(1 for kw in query_keywords if kw in lower)

        # If query_keywords exist, ignore facts that have 0 relevance to the topic
        if query_keywords and score == 0:
            continue

        # 1. Rejected alternatives & Alternatives
        if "rejected" in lower or "why rejected" in lower:
            buckets[StageType.REJECTED_ALTERNATIVES].append((text, fact_date, score))
            buckets[StageType.ALTERNATIVES].append((text, fact_date, score))

        if any(k in lower for k in ["alternatives evaluated:", "alternatives considered:", "options considered:"]):
            buckets[StageType.ALTERNATIVES].append((text, fact_date, score))

        # 2. Decision Made
        if any(k in lower for k in ["decision made:", "decided to", "selected", "chose", "opted to", "migrated to", "adopted"]):
            buckets[StageType.DECISION].append((text, fact_date, score))

        # 3. Rationale / Reasons
        if any(k in lower for k in ["rationale:", "reason:", "because", "due to", "in order to", "mitigate", "provides reliable", "redundancy", "justification"]):
            buckets[StageType.RATIONALE].append((text, fact_date, score))

        # 4. Failures & Roadblocks
        if any(k in lower for k in ["failed approach", "roadblock", "failure", "failed", "crash", "froze", "multipath error", "incident", "collision halt"]):
            buckets[StageType.FAILURE].append((text, fact_date, score))

        # 5. Constraints
        if any(k in lower for k in ["constraint", "budget", "under $", "must adhere", "limited to", "maximum speed", "within 50ms", "power draw", "must detect", "safety requirements"]):
            buckets[StageType.CONSTRAINTS].append((text, fact_date, score))

        # 6. Outcomes
        if any(k in lower for k in ["observed outcome:", "outcome", "achieved", "reduced", "delivered", "eliminated", "results in", "reliability up to"]):
            buckets[StageType.OUTCOME].append((text, fact_date, score))

        # 7. Lessons
        if any(k in lower for k in ["institutional lesson", "lesson", "takeaway", "future teams", "mandatory", "essential", "never rely", "design rule"]):
            buckets[StageType.LESSON].append((text, fact_date, score))

        # 8. Problem statement
        if any(k in lower for k in ["problem", "challenge", "objective", "in shared pedestrian spaces", "obstacle detection sensor suite", "obstacle detection was required"]):
            buckets[StageType.PROBLEM].append((text, fact_date, score))

        # 9. Context
        if any(k in lower for k in ["project:", "team:", "cohort", "lab", "uasl", "hermes"]):
            buckets[StageType.CONTEXT].append((text, fact_date, score))

    # Sort each bucket by topical score descending
    for s in buckets:
        buckets[s].sort(key=lambda item: item[2], reverse=True)

    return buckets


async def assemble_decision_trace(request: DecisionTraceRequest) -> DecisionTraceResponse:
    """
    Assemble an evidence-backed Decision Trace.

    1. Gathers relevant facts using Hindsight Recall and Reflect.
    2. Enforces zero hallucination: if no institutional record exists, returns found=False.
    3. Maps verified facts to the 10 decision timeline stages.
    4. Unproven stages are explicitly marked 'unavailable' rather than fabricated.
    """
    bank_id = settings.HINDSIGHT_BANK_ID or "reasonkeep-university-demo"
    query = request.query.strip()
    project_label = _clean_project_name(request.project, query)

    # Contextual query enhancement
    augmented_query = query
    if request.project and request.project.lower() not in query.lower():
        augmented_query = f"In {request.project}: {query}"

    context_str = f"Project: {project_label}"
    if request.team:
        context_str += f" | Team: {request.team}"

    logger.info("Decision Trace requested: query=%r project=%r", query, project_label)

    # 1. Recall candidates from Hindsight Cloud
    recall_res = await recall_memory(query=augmented_query)

    # 2. Reflect with grounded facts
    reflect_res = await reflect_memory(query=augmented_query, context=context_str)

    # 3. Handle NO-MEMORY check (strictly zero fabrication)
    if not reflect_res.found or reflect_res.memories_used == 0:
        return DecisionTraceResponse(
            query=query,
            found=False,
            project=request.project,
            team=request.team,
            trace=[],
            memories_used=0,
            evidence=[],
            bank_id=bank_id,
            message="No institutional decision trace found for this topic. Previous university project records contain no documentation.",
        )

    # 4. Collect all distinct evidence facts from Hindsight
    raw_evidence_texts: list[str] = []
    seen_texts: set[str] = set()
    evidence_items: list[TraceEvidenceItem] = []

    # Facts cited by Hindsight reflect
    for f in reflect_res.evidence:
        txt = f.get("text", "").strip()
        if txt and txt not in seen_texts:
            seen_texts.add(txt)
            raw_evidence_texts.append(txt)
            evidence_items.append(
                TraceEvidenceItem(
                    id=f.get("id"),
                    text=txt,
                    context=f.get("context"),
                    type=f.get("type"),
                )
            )

    # Also include recalled memories matching the query, breaking out multi-section records
    for m in recall_res.memories:
        txt = m.text.strip()
        sections = [s.strip() for s in txt.split("\n\n") if s.strip()]
        for sec in sections:
            if sec and sec not in seen_texts:
                seen_texts.add(sec)
                raw_evidence_texts.append(sec)
                evidence_items.append(
                    TraceEvidenceItem(
                        id=m.id,
                        text=sec,
                        context=m.context,
                        document_id=m.document_id,
                        type=m.type,
                    )
                )
        if len(evidence_items) >= request.max_evidence:
            break

    # 5. Categorize facts into trace stages with keyword relevance scoring
    query_keywords = _extract_query_keywords(query)
    categorized = _categorize_facts(raw_evidence_texts, query_keywords)

    # Stage definitions metadata
    STAGE_METADATA = [
        (StageType.CONTEXT, "Project & Organizational Context"),
        (StageType.PROBLEM, "Problem Statement & Requirements"),
        (StageType.CONSTRAINTS, "Technical & Operational Constraints"),
        (StageType.ALTERNATIVES, "Alternatives Evaluated"),
        (StageType.REJECTED_ALTERNATIVES, "Rejected Alternatives & Rationale"),
        (StageType.DECISION, "Final Decision Made"),
        (StageType.RATIONALE, "Decision Justification & Rationale"),
        (StageType.FAILURE, "Failure History & Roadblocks"),
        (StageType.OUTCOME, "Observed Deployment Outcome"),
        (StageType.LESSON, "Institutional Takeaway for Future Teams"),
    ]

    stages: list[DecisionTraceStage] = []

    for stage_type, stage_title in STAGE_METADATA:
        facts_for_stage = categorized.get(stage_type, [])
        if facts_for_stage:
            # Stage has verified evidence
            stage_facts = [f[0] for f in facts_for_stage]
            # Use most relevant fact as description
            description = stage_facts[0]
            stage_date = next((f[1] for f in facts_for_stage if f[1]), None)
            stages.append(
                DecisionTraceStage(
                    stage=stage_type,
                    title=stage_title,
                    description=description,
                    status=StageStatus.FOUND,
                    evidence=stage_facts[:3],
                    confidence_basis=f"Supported by {len(stage_facts)} institutional memory fact(s) in Hindsight Cloud.",
                    date=stage_date,
                )
            )
        else:
            # Stage was NOT documented in memory — strictly do NOT fabricate
            stages.append(
                DecisionTraceStage(
                    stage=stage_type,
                    title=stage_title,
                    description="No documented institutional evidence found for this stage.",
                    status=StageStatus.UNAVAILABLE,
                    evidence=[],
                    confidence_basis="Hindsight Cloud memory contains no recorded facts for this stage.",
                    date=None,
                )
            )

    found_stages = [s for s in stages if s.status == StageStatus.FOUND]

    return DecisionTraceResponse(
        query=query,
        found=len(found_stages) > 0,
        project=project_label,
        team=request.team,
        trace=stages,
        memories_used=reflect_res.memories_used,
        evidence=evidence_items[:request.max_evidence],
        bank_id=bank_id,
        message=f"Reconstructed Decision Trace: {len(found_stages)} stages documented, {len(stages) - len(found_stages)} unavailable in institutional memory.",
    )
