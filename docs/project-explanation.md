# REASONKEEP — Project Explanation & Submission Overview

> System: REASONKEEP v0.6.0  
> Track: Institutional Memory & AI Engineering  
> Institution Domain: Meridian Institute of Technology (MIT) — Computer Engineering Research Lab  
> Memory Bank: `reasonkeep-university-demo` (Hindsight Cloud)  
> Current Status: Modules 1–10 Complete & Verified (Submission Package Ready)  

---

## 1. The Problem

In university engineering departments, research laboratories, and capstone programs, **institutional knowledge suffers from chronic, catastrophic turnover**. 

Every semester:
- Senior engineering students graduate and leave campus.
- Masters and PhD researchers defend their theses and transition to industry.
- Postdocs and lab managers move on to new appointments.

With each cohort departure, **the tacit context behind technical decisions vanishes**. What remains in GitHub repos or lab drives are raw code files, schematics, and sparse READMEs — with zero memory of:
- **Why** a specific communication protocol or database was selected.
- **Which** alternatives were evaluated and subsequently rejected.
- **What** catastrophic hardware or environmental edge cases caused previous prototypes to burn out or drop packets.

Consequently, new student cohorts routinely repeat the exact same failures, waste thousands of dollars in capstone budgets, and spend months rediscovering lessons that predecessor cohorts already solved.

---

## 2. Why It Matters

1. **Massive Redundant Effort**: Undergraduate capstones and graduate research projects operate on compressed 3-to-9 month timelines. Wasting 2 months repeating a previously solved sensor failure can derail an entire research grant or capstone delivery.
2. **Safety and Hardware Destruction**: In physical systems (autonomous rovers, high-voltage battery banks, freezer telemetry), repeating past electrical or communication mistakes risks hardware damage or sample loss.
3. **Traditional Tools Fail**:
   - **Wikis/Confluence**: Become write-only graveyards that new cohorts never read before proposing designs.
   - **Generic LLMs**: Know general engineering concepts, but have zero knowledge of lab-specific physical constraints (e.g., campus quad stone walls, inductive motor back-EMF spikes, chiller plant RF shielding).
   - **Vector Search / RAG**: Retrieves fragmented chunks based on keyword similarity without understanding the relational progression of decisions, rejected options, and post-mortem lessons.

---

## 3. The Solution: REASONKEEP

**REASONKEEP** is an institutional engineering memory platform specifically designed for university labs and technical research teams. Powered directly by **Hindsight Cloud**, REASONKEEP preserves decisions, constraints, failures, and lessons as living institutional memory.

Rather than acting as a passive document archive, REASONKEEP provides three active intelligence surfaces:

1. **Decision Drift Detection**: Automatically screens new engineering proposals against historical institutional memory, immediately alerting teams if their proposal re-introduces previously discarded designs or violates documented lessons.
2. **10-Stage Decision Trace**: Automatically reconstructs the complete chronological lineage of how an engineering decision came to exist — from initial problem and constraints to discarded alternatives, field failures, and quantitative outcomes.
3. **Institutional Memory Assistant**: Provides grounded, real-time question-answering over past lab cohorts with explicit citation pills and grounded evidence cards.

---

## 4. How It Works

```
NEW PROPOSAL / INQUIRY
          ↓
   REST API Layer (FastAPI Backend)
          ↓
   Hindsight Service Layer (Official Hindsight SDK Singleton)
          ↓
   HTTPS Bearer Authorization (Backend-Only Isolation)
          ↓
   Hindsight Cloud Memory Bank (reasonkeep-university-demo)
     ├── Semantic Recall (Vector & Keyword Retrieval)
     └── Grounded Reflection (Synthesizing Grounded Facts)
          ↓
   Zero-Fabrication Contract Validation
          ↓
   Intelligence Engines:
     ├── Drift Classifier (Conflict vs. Alignment vs. Indeterminate)
     ├── 10-Stage Trace Mapper (Historical Progression Reconstruction)
     └── Assistant Orchestrator (Grounded Fact & Citation Linking)
          ↓
   Unified Evidence Presentation (React 19 + TypeScript Frontend)
```

1. **Ingestion**: When a team finishes a project or solves an incident, they record structured memory (decision, problem, constraints, rejected alternatives, failure post-mortems, and lessons learned).
2. **Retention**: Records are ingested into Hindsight Cloud with deterministic identifiers (`MIT-CE-SCN-DEC-001`, `MIT-CE-ROV-FAIL-001`). Idempotent seeding guarantees zero duplicates across demonstration runs.
3. **Query & Recall**: When a team submits a question or design proposal, REASONKEEP performs semantic recall over the institutional memory bank.
4. **Reflection & Grounding**: Hindsight Cloud reflects over the recalled memories, extracting factual relationships and direct historical citations.
5. **Enforcement**: If no memories exist for a topic, REASONKEEP strictly returns a clean `no_memory` status, preventing any speculative hallucination.

---

## 5. System Architecture

```
Browser (Student / Researcher)
   │
   ▼
Frontend (React 19 + TypeScript + Vite + Tailwind CSS)
   │  • Decision Drift Panel
   │  • 10-Stage Decision Trace Panel
   │  • Institutional Memory Assistant Panel
   │  • Ingestion Dev Panel
   │  • Memory Inspection Panel
   │  • Unified Evidence Cards
   │
   ▼ HTTP / REST (CORS Restricted)
FastAPI Backend (Python 3.11+)
   │  • app.api (drift, trace, assistant, ingestion, memory, health)
   │  • app.drift (Classification Engine)
   │  • app.trace (10-Stage Reconstruction Engine)
   │  • app.assistant (Grounded Q&A Service)
   │  • app.ingestion (Idempotent Formatter)
   │  • app.hindsight (Async Hindsight SDK Service)
   │
   ▼ HTTPS / Bearer Auth
Hindsight Cloud (api.hindsight.vectorize.io)
      Memory Bank: reasonkeep-university-demo
      (14 Curated Records across 7 Projects)
```

**Sole Memory Layer Guarantee**:  
Hindsight Cloud is the exclusive persistence store. The system does not use SQLite, PostgreSQL, Redis, Pinecone, Chroma, or LangChain. All memory retention, semantic recall, and reflection execute through Hindsight Cloud.

---

## 6. Key Innovations

1. **Decision Drift Detection**:  
   Moves beyond static search by actively evaluating the *directional validity* of new proposals. If a proposal contradicts a lesson learned from a prior student failure, it raises a bold `DRIFT DETECTED` conflict warning before hardware is purchased.
2. **10-Stage Historical Decision Trace**:  
   Transforms unstructured memories into a rigorous 10-stage engineering lineage:
   - `01. Context`
   - `02. Problem`
   - `03. Constraints`
   - `04. Alternatives`
   - `05. Rejected Alternatives`
   - `06. Decision`
   - `07. Rationale`
   - `08. Roadblock / Failures`
   - `09. Outcome`
   - `10. Institutional Lesson`
3. **Explicit "Documentation Unavailable" Handling**:  
   If an engineering stage was not recorded by prior teams, REASONKEEP marks it as `DOCUMENTATION UNAVAILABLE` rather than generating plausible fiction.
4. **Strict Zero-Fabrication Contract**:  
   When tested with unknown topics (e.g., *"University policy on medieval poetry recitation in 1845"*), the system produces zero speculative conflicts, zero fake citations, and an unambiguous empty-memory state.

---

## 7. Technology Stack

| Component | Technology | Rationale |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS | Fast, accessible, type-safe institutional UI with zero layout shifts |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2 | High-performance asynchronous REST API with strict request validation |
| **Memory Store** | Hindsight Cloud (`reasonkeep-university-demo`) | Authoritative institutional memory bank handling retain, recall, reflect |
| **Testing** | Python `unittest`, `asyncio` | Native end-to-end regression and verification test suite (10 test suites) |
| **Security** | Pydantic Settings, `.env` isolation | `HINDSIGHT_API_KEY` remains strictly backend-only; zero leakage |

---

## 8. Demo Flow Overview

The verified demonstration follows a 4-minute interactive progression:
1. **The Problem**: Introduce the annual knowledge loss in university research labs.
2. **Decision Drift**: Test conflicting proposals (e.g., replacing LiDAR with an RGB camera, or using USB serial instead of isolated CAN bus) and demonstrate instant conflict detection grounded in past failures.
3. **Decision Trace**: Reconstruct the complete 10-stage decision progression for the campus delivery rover's obstacle detection system.
4. **Memory Assistant**: Ask technical trade-off questions and examine the grounded evidence cards.
5. **Zero-Fabrication Negative Control**: Submit an out-of-scope query (*"Medieval Poetry 1845"*) to demonstrate zero hallucination.

---

## 9. Zero-Fabrication & Grounding Approach

In high-stakes engineering environments, **a false answer is worse than no answer**. REASONKEEP implements a multi-layer grounding defense:

1. **Pre-Query Filtering**: Semantic recall retrieves only high-confidence memories from the dedicated bank.
2. **Reflect Grounding**: Hindsight Cloud synthesizes answers strictly bounded by recalled records.
3. **Empty Memory Guardrails**: If `memories_used == 0` or recall confidence is insufficient:
   - Assistant returns `found = False` and clean no-memory text.
   - Decision Trace returns `found = False` and an empty trace.
   - Decision Drift returns `status = "no_memory"` and empty conflict arrays.
4. **Citation Traceability**: Every fact in an answer or conflict explanation is tied to a permanent `CIT-0X` badge backed by an interactive `EvidenceCard`.

---

## 10. Current Limitations & Future Possibilities

### Current Limitations
- **Single Institutional Domain**: Currently demonstrated on the Meridian Institute of Technology Computer Engineering Research Lab dataset (14 curated records across 7 projects).
- **Manual Ingestion Gate**: Memory records are submitted via the structured Ingestion API or demo seeding; automated git commit scrapers are not included in this phase.
- **Credit Quota Dependence**: Live reflection depends on Hindsight Cloud account API credits (sanitized error handling is in place if credits expire).

### Future Possibilities (Clearly Marked as Future Work)
- **Multi-Lab Partitioning**: Extending Hindsight bank namespaces to isolate different research labs within the same university while allowing cross-department search for shared infrastructure.
- **CI/CD Integration**: A GitHub Action that runs Decision Drift against pull requests or Architecture Decision Records (ADRs) before code merges.
- **Automated Ingestion Connectors**: Ingesting approved graduate theses, lab meeting minutes, and Slack incident channels directly into Hindsight memory banks.
