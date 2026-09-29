"""
REASONKEEP — Institutional Memory Ingestion Service (Module 3 & Module 8)

Coordinates ingestion validation, formatting, and retention into the existing
Hindsight Cloud memory bank via app.hindsight.service.retain_memory.
Never bypasses the existing Hindsight service.
Provides idempotent seeding using deterministic document IDs.
"""

from __future__ import annotations

import logging
import re
from fastapi import HTTPException, status

from app.hindsight.service import recall_memory, retain_memory
from app.ingestion.formatter import extract_metadata, format_institutional_memory
from app.ingestion.schemas import IngestResult, InstitutionalMemoryInput

logger = logging.getLogger(__name__)


def _generate_document_id(project: str, title: str | None, date: str | None, source: str | None = None) -> str:
    """Generate a clean, deterministic document identifier."""
    if source and (source.strip().startswith("MIT-") or source.strip().startswith("UASL-")):
        return source.strip().upper()

    slug_proj = re.sub(r"[^a-zA-Z0-9]+", "-", project.strip().lower()).strip("-")
    slug_title = (
        re.sub(r"[^a-zA-Z0-9]+", "-", title.strip().lower()).strip("-")
        if title and title.strip()
        else "entry"
    )
    date_part = (
        re.sub(r"[^a-zA-Z0-9]+", "-", date.strip().lower()).strip("-")
        if date and date.strip()
        else "current"
    )
    return f"DOC-{slug_proj[:20]}-{slug_title[:24]}-{date_part[:10]}".upper()


async def ingest_institutional_decision(
    memory_input: InstitutionalMemoryInput,
    check_existing: bool = False,
) -> IngestResult:
    """
    Ingest a structured institutional memory decision into Hindsight.

    1. Formats structured fields into a coherent narrative.
    2. Builds metadata and tags supported by Hindsight.
    3. If check_existing=True, verifies if document_id is already present (idempotency).
    4. Calls the existing Hindsight service (retain_memory).
    5. Returns a detailed IngestResult.
    """
    # 1. Format the content
    formatted_content = format_institutional_memory(memory_input)

    # 2. Extract metadata and context
    metadata = extract_metadata(memory_input)
    context = f"{memory_input.project.strip()} | {memory_input.memory_type.value}"
    doc_id = _generate_document_id(
        project=memory_input.project,
        title=memory_input.title or memory_input.decision,
        date=memory_input.date,
        source=memory_input.source,
    )
    tags = [t.strip() for t in memory_input.tags if t and t.strip()]

    # 3. Idempotent check (Module 8 Requirement)
    if check_existing:
        try:
            recall_check = await recall_memory(query=doc_id)
            if recall_check.found and any(m.document_id == doc_id for m in recall_check.memories):
                logger.info(
                    "Idempotency check: memory with document_id=%s already present in Hindsight Cloud. Skipping retain.",
                    doc_id,
                )
                return IngestResult(
                    success=True,
                    project=memory_input.project.strip(),
                    memory_type=memory_input.memory_type.value,
                    title=memory_input.title,
                    formatted_content=formatted_content,
                    bank_id=recall_check.memories[0].context or "reasonkeep-university-demo",
                    items_count=0,
                    operation_id=f"idempotent-cached-{doc_id}",
                )
        except Exception as check_exc:
            logger.warning("Idempotency check failed (proceeding to retain): %s", check_exc)

    logger.info(
        "Ingesting institutional memory: project=%r type=%s doc_id=%s tags=%d",
        memory_input.project,
        memory_input.memory_type.value,
        doc_id,
        len(tags),
    )

    # 4. Retain via existing Hindsight service
    try:
        retain_res = await retain_memory(
            content=formatted_content,
            context=context,
            document_id=doc_id,
            metadata=metadata,
            tags=tags if tags else None,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to retain institutional memory in Hindsight")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to retain memory in Hindsight service.",
        ) from exc

    return IngestResult(
        success=retain_res.found,
        project=memory_input.project.strip(),
        memory_type=memory_input.memory_type.value,
        title=memory_input.title,
        formatted_content=formatted_content,
        bank_id=retain_res.bank_id,
        items_count=retain_res.items_count,
        operation_id=retain_res.operation_id,
    )
