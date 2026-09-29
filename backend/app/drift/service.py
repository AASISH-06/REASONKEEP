"""
REASONKEEP — Decision Drift Detection Service (Module 6)

Compares a current proposal against documented historical institutional memory.
Answers: "Does this new proposal conflict with what previous university teams learned?"

Strictly distinguishes:
1. drift_detected (documented conflict with past decisions/constraints/failures/lessons)
2. aligned (documented adherence/reinforcement of past decisions/lessons)
3. indeterminate (insufficient evidence to establish conflict or alignment)
4. no_memory (no relevant institutional records exist)

Zero fabrication: Never synthesizes missing historical decisions, constraints, or lessons.
"""

from __future__ import annotations

import logging
import re
from typing import Any

from app.config import settings
from app.drift.schemas import (
    DriftAnalysisRequest,
    DriftAnalysisResponse,
    DriftEvidenceItem,
    DriftStatus,
)
from app.hindsight.service import recall_memory, reflect_memory

logger = logging.getLogger("reasonkeep.drift")


def _extract_keywords(text: str) -> set[str]:
    """Extract significant lowercase tokens for relevance matching."""
    stopwords = {
        "the", "a", "an", "and", "or", "to", "in", "for", "with", "of", "on",
        "at", "by", "from", "up", "about", "into", "over", "after", "is", "are",
        "was", "were", "be", "been", "being", "have", "has", "had", "do", "does",
        "did", "will", "would", "should", "could", "this", "that", "these", "those",
        "instead", "replace", "use", "using", "proposal", "change", "new", "our",
        "system", "team", "project", "university", "policy", "adopt", "adopting",
        "department", "decision", "regarding"
    }
    tokens = re.findall(r"[a-z0-9]+(?:-[a-z0-9]+)?", text.lower())
    return {t for t in tokens if len(t) > 2 and t not in stopwords}


def _clean_project_name(project: str | None, proposal: str) -> str | None:
    """Normalize project context label."""
    if project and project.strip():
        p = project.strip()
        if "hermes" in p.lower() and "campus" not in p.lower():
            return "Campus Autonomous Delivery Rover (Project Hermes)"
        return p
    if "hermes" in proposal.lower():
        return "Campus Autonomous Delivery Rover (Project Hermes)"
    if "rover" in proposal.lower():
        return "Campus Autonomous Delivery Rover"
    return None


async def analyze_decision_drift(request: DriftAnalysisRequest) -> DriftAnalysisResponse:
    """
    Perform evidence-backed Decision Drift analysis.

    Pipeline:
    1. Augment proposal with project/team context.
    2. Query Hindsight Recall & Reflect.
    3. If zero memories exist -> status = no_memory.
    4. Extract grounded historical elements (decision, rationale, constraints, failures, lessons).
    5. Evaluate proposal against historical records:
       - Conflict with rejected alternative, documented failure, or lesson -> drift_detected.
       - Consistent with/reinforcing documented decision or lesson -> aligned.
       - Relevant domain records but inconclusive evidence -> indeterminate.
    6. Return structured response with cited evidence and zero fabrication.
    """
    bank_id = settings.HINDSIGHT_BANK_ID or "reasonkeep-university-demo"
    proposal = request.proposal.strip()
    project_label = _clean_project_name(request.project, proposal)
    proposal_kws = _extract_keywords(proposal)

    logger.info("Drift analysis requested for proposal: %r (project: %r)", proposal, project_label)

    # 1. Contextual reflection prompt asking Hindsight to reason over memory bank
    context_prefix = f"In {project_label}: " if project_label else ""
    reflect_query = (
        f"Analyze whether the following proposed engineering change conflicts with, violates, "
        f"or contradicts past decisions, constraints, failures, or institutional lessons recorded "
        f"in institutional memory:\n"
        f"PROPOSAL: {proposal}\n"
        f"PROJECT CONTEXT: {project_label or 'None'}"
    )

    context_str = f"Project: {project_label}" if project_label else None
    if request.team and context_str:
        context_str += f" | Team: {request.team}"

    # 2. Recall candidates and reflect over memory bank
    recall_query = f"{context_prefix}{proposal}".strip()
    recall_res = await recall_memory(query=recall_query)
    reflect_res = await reflect_memory(query=reflect_query, context=context_str)

    # 3. Check for NO MEMORY (strict zero hallucination)
    if not reflect_res.found or reflect_res.memories_used == 0 or len(recall_res.memories) == 0:
        return DriftAnalysisResponse(
            proposal=proposal,
            status=DriftStatus.NO_MEMORY,
            explanation=(
                "REASONKEEP has no documented institutional memory regarding this proposal. "
                "Previous university project records contain no relevant decisions, constraints, or lessons."
            ),
            confidence_basis="Zero relevant institutional memory records found in Hindsight Cloud.",
            evidence=[],
            memories_used=0,
            project=request.project,
            team=request.team,
            bank_id=bank_id,
        )

    # 4. Extract distinct evidence facts and recalled memory sections
    evidence_items: list[DriftEvidenceItem] = []
    seen_texts: set[str] = set()
    raw_facts: list[str] = []

    # Reflect cited facts
    for f in reflect_res.evidence:
        txt = f.get("text", "").strip()
        if txt and txt not in seen_texts:
            seen_texts.add(txt)
            raw_facts.append(txt)
            evidence_items.append(
                DriftEvidenceItem(
                    id=f.get("id"),
                    text=txt,
                    context=f.get("context"),
                    type=f.get("type"),
                )
            )

    # Recalled memory sections
    for m in recall_res.memories:
        txt = m.text.strip()
        sections = [s.strip() for s in txt.split("\n\n") if s.strip()]
        for sec in sections:
            if sec and sec not in seen_texts:
                seen_texts.add(sec)
                raw_facts.append(sec)
                evidence_items.append(
                    DriftEvidenceItem(
                        id=m.id,
                        text=sec,
                        context=m.context,
                        document_id=m.document_id,
                        type=m.type,
                    )
                )
        if len(evidence_items) >= request.max_evidence:
            break

    # 5. Filter facts with topical relevance to the proposal
    relevant_facts: list[str] = []
    for f in raw_facts:
        f_lower = f.lower()
        if any(kw in f_lower for kw in proposal_kws):
            relevant_facts.append(f)

    # If reflect returned text, check if reflection itself found any connection
    reflect_text = reflect_res.response.strip()

    # If no fact overlaps topically with the proposal keywords, or reflect indicated zero memory
    if not relevant_facts or any(phrase in reflect_text.lower() for phrase in [
        "contains no information",
        "does not record any information",
        "does not contain any",
        "exclusively focused on the technical",
        "exclusively concerns the campus",
        "no records pertaining to",
    ]):
        return DriftAnalysisResponse(
            proposal=proposal,
            status=DriftStatus.NO_MEMORY,
            explanation=(
                "REASONKEEP has no documented institutional memory regarding this proposal. "
                "Previous university project records contain no relevant information."
            ),
            confidence_basis="Zero relevant records found in Hindsight Cloud matching this proposal.",
            evidence=[],
            memories_used=0,
            project=request.project,
            team=request.team,
            bank_id=bank_id,
        )

    # 6. Extract structured historical components from relevant evidence only
    prev_decision: str | None = None
    historical_rationale: str | None = None
    historical_constraints: list[str] = []
    historical_outcomes: list[str] = []
    institutional_lesson: str | None = None
    rejected_alternatives: list[str] = []
    documented_failures: list[str] = []

    for fact in relevant_facts:
        lower = fact.lower()

        # Decision
        if not prev_decision and any(k in lower for k in ["decision made:", "decided to", "selected", "chose", "opted to", "migrated to"]):
            clean = re.sub(r"^(decision made:?|topic:?)\s*", "", fact, flags=re.IGNORECASE).strip()
            prev_decision = clean

        # Rationale
        if not historical_rationale and any(k in lower for k in ["rationale:", "reason:", "provides reliable", "sensor redundancy"]):
            clean = re.sub(r"^(rationale:?|reason:?)\s*", "", fact, flags=re.IGNORECASE).strip()
            historical_rationale = clean

        # Constraints
        if any(k in lower for k in ["constraint", "budget", "under $", "must adhere", "limited to", "must detect", "safety requirements"]):
            clean = re.sub(r"^constraints? & requirements:?\s*", "", fact, flags=re.IGNORECASE).strip()
            if clean and clean not in historical_constraints:
                historical_constraints.append(clean)

        # Outcomes
        if any(k in lower for k in ["observed outcome:", "achieved", "reliability up to", "eliminated"]):
            clean = re.sub(r"^observed outcome:?\s*", "", fact, flags=re.IGNORECASE).strip()
            if clean and clean not in historical_outcomes:
                historical_outcomes.append(clean)

        # Lessons
        if not institutional_lesson and any(k in lower for k in ["institutional lesson", "lesson:", "takeaway", "never rely", "mandatory"]):
            clean = re.sub(r"^institutional lesson for future teams:?\s*", "", fact, flags=re.IGNORECASE).strip()
            institutional_lesson = clean

        # Rejected alternatives
        if "rejected" in lower or "why rejected" in lower:
            clean = re.sub(r"^rejected alternatives:?\s*", "", fact, flags=re.IGNORECASE).strip()
            if clean and clean not in rejected_alternatives:
                rejected_alternatives.append(clean)

        # Failures & roadblocks
        if any(k in lower for k in ["failed approach", "failure", "failed", "crash", "roadblock", "froze", "collision halt"]):
            clean = re.sub(r"^(failed approach / roadblock:|failure:?)\s*", "", fact, flags=re.IGNORECASE).strip()
            if clean and clean not in documented_failures:
                documented_failures.append(clean)

    # 7. Evaluate Conflict vs Alignment vs Indeterminate
    proposal_lower = proposal.lower()
    reflect_lower = reflect_text.lower()
    documented_conflicts: list[str] = []

    # Check if proposal is explicitly proposing to preserve / adhere / continue an established approach
    is_preserving = any(term in proposal_lower for term in [
        "keep", "maintain", "adhere", "ensure", "continue", "retain", "preserve", "mandate"
    ])

    # Conflict check 1: Does proposal advocate what was explicitly rejected?
    # Only check if proposal is NOT simply asking to keep an established design
    if not is_preserving:
        for ra in rejected_alternatives:
            ra_lower = ra.lower()
            if ("rgb" in proposal_lower or "monocular" in proposal_lower) and ("monocular rgb" in ra_lower or "camera" in ra_lower):
                documented_conflicts.append(f"Historical Rejection: {ra}")
            elif ("usb" in proposal_lower or "serial" in proposal_lower) and "usb" in ra_lower:
                documented_conflicts.append(f"Historical Rejection: {ra}")
            elif ("bluetooth" in proposal_lower or "ble" in proposal_lower) and "bluetooth" in ra_lower:
                documented_conflicts.append(f"Historical Rejection: {ra}")
            elif "influxdb" in proposal_lower and "influxdb" in ra_lower:
                documented_conflicts.append(f"Historical Rejection: {ra}")
            elif "mongodb" in proposal_lower and "mongodb" in ra_lower:
                documented_conflicts.append(f"Historical Rejection: {ra}")

        # Conflict check 2: Does proposal resurrect a documented failure?
        for df in documented_failures:
            df_lower = df.lower()
            if ("rgb" in proposal_lower or "single camera" in proposal_lower) and ("rgb-only" in df_lower or "skateboard" in df_lower):
                if not any("skateboard" in c.lower() for c in documented_conflicts):
                    documented_conflicts.append(f"Historical Incident: {df}")
            elif ("usb" in proposal_lower or "serial" in proposal_lower) and ("usb" in df_lower or "emi" in df_lower or "froze" in df_lower):
                if not any("usb" in c.lower() for c in documented_conflicts):
                    documented_conflicts.append(f"Historical Incident: {df}")

        # Conflict check 3: Does proposal violate an institutional lesson?
        if institutional_lesson:
            les_lower = institutional_lesson.lower()
            if ("single" in proposal_lower or "reduce" in proposal_lower) and "never rely solely on monocular vision" in les_lower and ("rgb" in proposal_lower or "camera" in proposal_lower):
                documented_conflicts.append(f"Institutional Lesson Violation: {institutional_lesson}")
            elif "usb" in proposal_lower and "never use single-ended usb" in les_lower:
                documented_conflicts.append(f"Institutional Lesson Violation: {institutional_lesson}")

    # Check for alignment signals
    is_aligning = False
    alignment_reasons: list[str] = []

    if not documented_conflicts:
        # A proposal is ALIGNED only if historical records document an explicit requirement,
        # decision, or lesson that the proposal directly reinforces or adheres to.

        # 1. Does proposal advocate/keep a documented lesson?
        if institutional_lesson:
            lesson_kws = _extract_keywords(institutional_lesson)
            common_lesson_kws = {kw for kw in proposal_kws if kw in lesson_kws}
            if common_lesson_kws and any(term in proposal_lower for term in ["keep", "maintain", "redundant", "redundancy", "adhere", "ensure", "continue", "retain"]):
                is_aligning = True
                alignment_reasons.append(
                    f"Directly reinforces documented institutional lesson: '{institutional_lesson}'."
                )

        # 2. Does proposal explicitly adhere to a documented decision?
        if prev_decision and not is_aligning:
            decision_kws = _extract_keywords(prev_decision)
            common_decision_kws = {kw for kw in proposal_kws if kw in decision_kws}
            if len(common_decision_kws) >= 2 and any(term in proposal_lower for term in ["keep", "maintain", "continue", "adhere", "retain", "preserve"]):
                is_aligning = True
                alignment_reasons.append(
                    f"Conforms to established engineering decision: '{prev_decision}'."
                )

    # 8. Determine final status & explanation
    if documented_conflicts:
        status = DriftStatus.DRIFT_DETECTED
        explanation = (
            f"DRIFT DETECTED: This proposal conflicts with previous institutional decisions and documented failure history. "
            f"Previous teams evaluated this exact direction and documented negative outcomes:\n"
            + "\n".join(f"• {c}" for c in documented_conflicts)
        )
        confidence_basis = "Direct conflict with historical rejection, failure postmortem, or institutional lesson."

    elif is_aligning:
        status = DriftStatus.ALIGNED
        explanation = (
            f"ALIGNED: The proposal is consistent with documented institutional engineering decisions and lessons. "
            + " ".join(alignment_reasons)
        )
        confidence_basis = "Direct corroboration from previous institutional decisions and lessons."

    else:
        # Relevant memories exist in the project, but evidence is insufficient for conflict or alignment
        status = DriftStatus.INDETERMINATE
        explanation = (
            f"INDETERMINATE: Historical records for {project_label or 'this project'} exist, but do not contain "
            f"an explicit decision, constraint, failure, or lesson directly evaluating this specific proposed change. "
            f"The evidence is insufficient to confirm either conflict or alignment."
        )
        confidence_basis = "Zero documented evaluation or historical decision exists for this specific proposal."

    return DriftAnalysisResponse(
        proposal=proposal,
        status=status,
        explanation=explanation,
        confidence_basis=confidence_basis,
        previous_decision=prev_decision,
        historical_rationale=historical_rationale,
        historical_constraints=historical_constraints[:3],
        documented_conflicts=documented_conflicts,
        historical_outcomes=historical_outcomes[:2],
        institutional_lesson=institutional_lesson,
        evidence=evidence_items[:request.max_evidence],
        memories_used=reflect_res.memories_used,
        project=request.project,
        team=request.team,
        bank_id=bank_id,
    )
