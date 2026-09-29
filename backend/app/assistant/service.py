"""
REASONKEEP — Institutional Memory Assistant Service (Module 4)

Executes the query flow:
USER QUESTION -> RECALL RELEVANT MEMORY -> REFLECT OVER RELEVANT MEMORY -> GROUNDED RESPONSE -> EVIDENCE

Uses the existing Hindsight service layer from Module 2. Never bypasses Hindsight.
Never fabricates institutional answers when memories do not exist.
"""

from __future__ import annotations

import logging
from app.config import settings
from app.hindsight.service import recall_memory, reflect_memory
from app.assistant.schemas import (
    AssistantAskRequest,
    AssistantAskResponse,
    AssistantContext,
    MemoryEvidenceItem,
)

logger = logging.getLogger(__name__)


def _build_augmented_query(request: AssistantAskRequest) -> tuple[str, str | None]:
    """
    Construct the augmented query and optional context string for Hindsight reflection.
    Preserves project, team, and tag specificity.
    """
    query = request.query.strip()
    context_parts: list[str] = []

    # Map project names/aliases if provided
    if request.project and request.project.strip():
        proj = request.project.strip()
        if "hermes" in proj.lower() and "campus" not in proj.lower():
            proj = f"Campus Autonomous Delivery Rover (Project Hermes)"
        context_parts.append(f"Project: {proj}")

    if request.team and request.team.strip():
        context_parts.append(f"Team: {request.team.strip()}")

    if request.tags:
        valid_tags = [t.strip() for t in request.tags if t and t.strip()]
        if valid_tags:
            context_parts.append(f"Tags: {', '.join(valid_tags)}")

    if request.memory_type and request.memory_type.strip():
        context_parts.append(f"Focus: {request.memory_type.strip()}")

    context_str = " | ".join(context_parts) if context_parts else None

    # If the user query does not mention the project, but project is specified in request
    if request.project and request.project.lower() not in query.lower():
        augmented_query = f"In {request.project}: {query}"
    else:
        augmented_query = query

    return augmented_query, context_str


async def query_assistant(request: AssistantAskRequest) -> AssistantAskResponse:
    """
    Process an inquiry against accumulated institutional memory.

    1. Augments query with project and team context.
    2. Recalls relevant candidate memory units via Hindsight Recall.
    3. Reflects over the recalled memories via Hindsight Reflect (with include_facts=True).
    4. Evaluates grounding: if no memory exists, returns found=False with clear explanation.
    5. Assembles supporting evidence facts and returns strongly typed response.
    """
    augmented_query, context_str = _build_augmented_query(request)
    bank_id = settings.HINDSIGHT_BANK_ID or "reasonkeep-university-demo"

    logger.info(
        "Assistant query: query=%r augmented=%r context=%r",
        request.query,
        augmented_query,
        context_str,
    )

    # 1. Recall candidates (Module 2 Hindsight service)
    recall_res = await recall_memory(query=augmented_query)

    # 2. Reflect for grounded reasoning (Module 2 Hindsight service)
    reflect_res = await reflect_memory(query=augmented_query, context=context_str)

    # 3. Handle NO-MEMORY state (strictly zero fabrication)
    if not reflect_res.found or reflect_res.memories_used == 0:
        no_memory_text = (
            "REASONKEEP found no relevant institutional memory for this inquiry. "
            "Previous university project records do not contain information regarding this topic."
        )
        return AssistantAskResponse(
            query=request.query,
            found=False,
            answer=no_memory_text,
            memories_used=0,
            evidence=[],
            context=AssistantContext(
                project=request.project,
                team=request.team,
                tags=request.tags,
                augmented_query=augmented_query,
            ),
            bank_id=bank_id,
        )

    # 4. Handle GROUNDED MEMORY FOUND state
    raw_answer = reflect_res.response.strip()

    # Ensure institutional phrasing convention
    preferred_prefixes = [
        "REASONKEEP found the following institutional memory",
        "Previous project records indicate",
        "Institutional records show",
        "Based on previous project records",
        "Records from",
    ]
    if not any(raw_answer.startswith(p) for p in preferred_prefixes):
        answer = f"Previous project records indicate:\n\n{raw_answer}"
    else:
        answer = raw_answer

    # 5. Extract and format supporting evidence
    evidence_items: list[MemoryEvidenceItem] = []
    seen_texts: set[str] = set()

    # Prioritize specific facts cited during reflection
    for fact in reflect_res.evidence:
        txt = fact.get("text", "").strip()
        if txt and txt not in seen_texts:
            seen_texts.add(txt)
            evidence_items.append(
                MemoryEvidenceItem(
                    id=fact.get("id"),
                    text=txt,
                    context=fact.get("context"),
                    type=fact.get("type"),
                )
            )

    # Supplement with top recalled memories if evidence list is brief
    if len(evidence_items) < 3 and recall_res.memories:
        for m in recall_res.memories:
            txt = m.text.strip()
            if txt and txt not in seen_texts:
                seen_texts.add(txt)
                evidence_items.append(
                    MemoryEvidenceItem(
                        id=m.id,
                        text=txt,
                        context=m.context,
                        document_id=m.document_id,
                        type=m.type,
                    )
                )
            if len(evidence_items) >= 5:
                break

    return AssistantAskResponse(
        query=request.query,
        found=True,
        answer=answer,
        memories_used=reflect_res.memories_used,
        evidence=evidence_items,
        context=AssistantContext(
            project=request.project,
            team=request.team,
            tags=request.tags,
            augmented_query=augmented_query,
        ),
        bank_id=bank_id,
    )
