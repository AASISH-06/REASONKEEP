# REASONKEEP — Hindsight Integration Guide

> Status: Integrated & Operational (Module 2 & Module 3 Complete)  
> Bank ID: `reasonkeep-university-demo`  
> Service Endpoint: `https://api.hindsight.vectorize.io`  
> Client SDK: `hindsight-client==0.10.1`

---

## 1. Overview

Hindsight Cloud serves as the single source of truth for REASONKEEP's institutional memory. REASONKEEP does not duplicate memory in a local database or local vector store.

The integration provides:
1. **Retain**: Storing structured decisions, reasoning, constraints, failures, and lessons (`POST /api/memory/retain`, `POST /api/ingest/decision`).
2. **Recall**: Semantic and contextual retrieval over accumulated institutional memory (`POST /api/memory/recall`).
3. **Reflect**: Grounded reasoning over historical institutional decisions with factual citations (`POST /api/memory/reflect`).

---

## 2. Ingestion Flow & Formatting

When structured memory is ingested:
1. The client sends structured JSON to `POST /api/ingest/decision`.
2. `app.ingestion.schemas.InstitutionalMemoryInput` validates the input (requiring project and at least one substantive field).
3. `app.ingestion.formatter.format_institutional_memory` transforms the input into a cohesive narrative preserving:
   - Project, Team, and Organization context
   - Decision and Core Rationale
   - Constraints driving the choice
   - Alternatives considered and specific reasons for rejection
   - Failures encountered
   - Observed outcome
   - Institutional lessons for future student cohorts
4. `app.ingestion.service.ingest_institutional_decision` calls `app.hindsight.service.retain_memory`.
5. Hindsight Cloud retains the memory in bank `reasonkeep-university-demo`.

---

## 3. Grounding & Reflection

`POST /api/memory/reflect` uses `include_facts=True` when invoking `client.areflect()`.
- Grounded answers: Hindsight cites the specific memories in `based_on.memories`.
- Ungrounded / absent memories: If the topic has no records in the memory bank (e.g. asking about "1982 policy on medieval poetry"), the service detects negative indicators and returns `found: false`, ensuring zero fabrication.

---

## 4. Environment Configuration

```env
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BANK_ID=reasonkeep-university-demo
HINDSIGHT_API_URL=https://api.hindsight.vectorize.io
```

---

## 5. Synthetic Demo Dataset

Located in `backend/app/ingestion/demo_data.py`:
- 7 interconnected scenarios for the fictional **University Autonomous Systems Lab (UASL)**.
- Can be seeded via `POST /api/ingest/demo-seed` or via the frontend **⚡ Seed All 7 Demo Memories** button.
- Labeled clearly: `DEMO / SYNTHETIC DATA`.
