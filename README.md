# REASONKEEP

**Institutional memory for university engineering and research teams.**

> **Status:** Modules 1–10 COMPLETE & VERIFIED (Submission Package Ready)  
> **API Version:** `0.6.0`  
> **Memory Layer:** Hindsight Cloud (`reasonkeep-university-demo`)  
> **Domain:** Meridian Institute of Technology (MIT) — Computer Engineering Research Lab  

---

## Current Status

| Module | Scope | Status |
|---|---|---|
| **Module 1 — Project Foundation** | React 19 + TypeScript frontend shell, FastAPI backend, CORS, environment configuration | ✅ Complete & Verified |
| **Module 2 — Hindsight Integration** | Direct connection to Hindsight Cloud (`reasonkeep-university-demo`), retain, recall, reflect | ✅ Complete & Verified |
| **Module 3 — Institutional Memory Ingestion** | Structured memory model (decisions, constraints, failures, lessons), idempotent ingestion pipeline | ✅ Complete & Verified |
| **Module 4 — Institutional Memory Assistant** | Grounded Q&A assistant with real-time memory citations and zero-fabrication contract | ✅ Complete & Verified |
| **Module 5 — Decision Trace** | 10-stage historical engineering reconstruction layer with explicit unavailable stage handling | ✅ Complete & Verified |
| **Module 6 — Decision Drift Detection** | Conflict vs. alignment detection engine comparing new proposals against historical records | ✅ Complete & Verified |
| **Module 7 — Frontend Polish** | Institutional UI design system, layout-stable loading states, differentiated empty states, unified evidence cards | ✅ Complete & Verified |
| **Module 8 — Demo Dataset & Packaging** | Coherent 14-memory synthetic institutional dataset across 7 projects at Meridian Institute of Technology | ✅ Complete & Verified |
| **Module 9 — Testing & System Validation** | Automated end-to-end testing suite (10 test suites, 100% pass rate) covering retain, recall, reflect, drift, trace, error states, and security | ✅ Complete & Verified |
| **Module 10 — Submission Package** | Submission-ready documentation, architecture specifications, video script, hackathon demo script, and final package | ✅ Complete & Verified |

---

## What REASONKEEP Solves

In academic institutions and research laboratories, **engineering experience has a strict expiration date**. Every academic cycle:
- Senior undergraduate capstone teams graduate.
- Masters and PhD candidates defend their theses and leave.
- Research staff move to new institutions.

When they depart, the tacit technical knowledge vanishes:
- *Why* was a certain communication bus or database chosen?
- *What* alternatives were tested and failed?
- *Which* subtle hardware edge cases (RF interference, inductive spikes, thermal drops) destroyed earlier prototypes?

The result is **institutional amnesia**: new student cohorts arrive each fall and repeat the exact same expensive mistakes. 

**REASONKEEP solves this** by capturing structured decisions, constraints, failures, and lessons into a permanent institutional memory layer powered by **Hindsight Cloud**.

---

## Core Intelligence Surfaces

REASONKEEP provides three distinct intelligence capabilities:

### 1. Decision Drift Detection (Module 6)
- **Question Answered:** *"Does this new proposal conflict with what previous teams learned?"*
- **Mechanism:** Before students invest time or lab budget, they submit their proposed design. REASONKEEP recalls historical decisions and failure analyses, evaluates whether the proposal resurrects previously discarded options or violates codified lessons, and classifies the outcome:
  - `drift_detected` (Red): Proposal conflicts with a documented failure or rejected alternative.
  - `aligned` (Green): Proposal reinforces accumulated institutional wisdom.
  - `indeterminate` (Amber): Memory bank has relevant context but no specific stance.
  - `no_memory` (Slate): No institutional records exist for this topic (zero hallucination).

### 2. Decision Trace (Module 5)
- **Question Answered:** *"How did this decision come to exist?"*
- **Mechanism:** Reconstructs the complete 10-stage engineering lineage of a past decision:
  1. `01. Context` — Organizational & project background
  2. `02. Problem` — Core engineering problem
  3. `03. Constraints` — Budget, physical, timing, or environmental bounds
  4. `04. Alternatives` — Viable technical alternatives evaluated
  5. `05. Rejected Alternatives` — Options discarded and reason why
  6. `06. Decision` — Final selected engineering architecture
  7. `07. Rationale` — Technical justification & evidence basis
  8. `08. Roadblock / Failures` — Hardware/software failures encountered during testing
  9. `09. Outcome` — Observed field performance & quantitative results
  10. `10. Institutional Lesson` — Inherited advice for successor teams
- **Unavailable Stage Rule:** If historical documentation lacks evidence for a stage, it explicitly returns `DOCUMENTATION UNAVAILABLE` rather than synthesizing speculative content.

### 3. Institutional Memory Assistant (Module 4)
- **Question Answered:** *"What did past cohorts learn about X?"*
- **Mechanism:** Grounded conversational Q&A over accumulated institutional knowledge with interactive citation badges (`CIT-0X`) linking directly to unified `EvidenceCards`.

---

## The Zero-Fabrication Principle

In university engineering, **a hallucinated fact can burn hardware or corrupt datasets**. REASONKEEP enforces a strict zero-fabrication contract:
- When queried on topics with zero historical documentation (e.g., *"University policy on medieval poetry recitation in 1845"*), the system strictly returns empty states and clean `no_memory` flags.
- Zero speculative conflicts, zero fake citations, and zero invented historical stages are ever generated.

---

## Institutional Domain & Demo Dataset

- **Institution:** Meridian Institute of Technology (MIT)
- **Unit:** Computer Engineering Research Lab
- **Dataset:** 14 curated, deterministic records across 7 active projects:
  1. `MIT-CE-SCN` — Smart Campus Network Infrastructure (PostgreSQL vs. MongoDB, MQTT buffer overflow)
  2. `MIT-CE-RDP` — Distributed Research Data Pipeline (Apache Kafka streaming, metadata schema drift)
  3. `MIT-CE-CEM` — Campus Energy Monitoring System (Modbus RS-485 vs. Wi-Fi, chiller plant RF shielding failure)
  4. `MIT-CE-EAA` — Edge Attendance & Analytics (Local SQLite inference vs. cloud streaming, flash memory corruption)
  5. `MIT-CE-LEM` — Laboratory Equipment Monitoring (Dedicated Ethernet for -80°C freezers, Wi-Fi alert failure)
  6. `MIT-CE-ESG` — Environmental Sensor Gateway (LoRaWAN 915 MHz through stone buildings, solar power starvation)
  7. `MIT-CE-ROV` — Campus Delivery Rover / Project Hermes (Dual LiDAR + stereo vision vs. RGB camera, motor bus back-EMF freeze)

All records are mirrored in human-readable Markdown in `demo_data/` and support deterministic, idempotent 1-click seeding via `/api/ingest/demo-seed`.

---

## System Architecture

```
User (Student / Researcher / Lab Engineer)
   │
   ▼
Frontend (React 19 + TypeScript + Vite + Tailwind CSS) [Port 5173]
   │  • Decision Drift Panel (Module 6)
   │  • Decision Trace Panel (Module 5)
   │  • Institutional Memory Assistant Panel (Module 4)
   │  • Ingestion Dev Panel (Module 3 & 8)
   │  • Memory Inspection Panel (Module 2)
   │  • Unified Evidence Cards (Module 7)
   │
   ▼ HTTP / REST (CORS Restricted)
Backend (Python 3.11+ / FastAPI) [Port 8000]
   │  • app.api.drift        → POST /api/drift/analyze
   │  • app.api.trace        → POST /api/trace/decision
   │  • app.api.assistant    → POST /api/assistant/ask
   │  • app.api.ingestion    → POST /api/ingest/decision, POST /api/ingest/demo-seed
   │  • app.api.memory       → POST /api/memory/retain, recall, reflect, GET /status
   │  • app.drift.service    → Drift Conflict & Alignment Classifier
   │  • app.trace.service    → 10-Stage Reconstruction & Evidence Mapping
   │  • app.hindsight        → Official Hindsight SDK Singleton Wrapper
   │
   ▼ HTTPS / Bearer Token Auth
Hindsight Cloud (api.hindsight.vectorize.io)
      Memory Bank: reasonkeep-university-demo
      (14 Structured Institutional Records across 7 Projects)
```

**Sole Memory Layer:** Hindsight Cloud is the exclusive memory and vector storage engine. No secondary vector databases (Chroma, Pinecone, Redis) or local database systems (PostgreSQL, SQLite) are used.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 · Vite · TypeScript · Tailwind CSS | Institutional UI, type safety, responsive layout |
| **Backend** | Python 3.11+ · FastAPI · Pydantic v2 | High-performance asynchronous REST API |
| **Memory Layer** | Hindsight Cloud (`reasonkeep-university-demo`) | Authoritative institutional memory bank |
| **Testing** | Python `unittest` · `asyncio` | 10 end-to-end automated test suites |
| **Configuration** | `pydantic-settings` · `.env` | Isolated environment secrets management |

---

## Setup & Running Locally

### 1. Prerequisites
- **Node.js**: ≥ 18
- **Python**: ≥ 3.11
- **Hindsight Cloud Account**: Free API Key from [vectorize.io](https://vectorize.io)

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your HINDSIGHT_API_KEY and HINDSIGHT_BANK_ID

# Start FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend health check: `http://127.0.0.1:8000/health`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```
Frontend URL: `http://localhost:5173`

### 4. Running the Automated Test Suite (Module 9)
```bash
cd backend
python tests/run_all_tests.py
```
Executes all 10 automated test suites with 100% pass validation in ~12 seconds.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health status and API version (`0.6.0`) |
| `GET` | `/api/memory/status` | Hindsight Cloud configuration and connection status |
| `POST` | `/api/memory/retain` | Direct memory ingestion into Hindsight Cloud bank |
| `POST` | `/api/memory/recall` | Semantic vector and keyword memory recall |
| `POST` | `/api/memory/reflect` | Grounded reflection and synthesis over bank memories |
| `POST` | `/api/ingest/decision` | Ingest a structured institutional decision / incident |
| `POST` | `/api/ingest/demo-seed` | Idempotently seed the 14 demo memories across 7 projects |
| `GET` | `/api/ingest/demo-data` | Preview demo dataset records |
| `POST` | `/api/assistant/ask` | Grounded Q&A with real-time memory citations |
| `POST` | `/api/trace/decision` | Reconstruct 10-stage historical decision progression |
| `POST` | `/api/drift/analyze` | Evaluate engineering proposal for decision drift & conflicts |

---

## Security & Isolation Guarantees

1. **Backend-Only Secrets**: `HINDSIGHT_API_KEY` is loaded strictly via backend environment variables. It is never exposed in browser network responses, frontend bundles, or error messages.
2. **Sanitized Error Handling**: If upstream services return an error, the backend returns sanitized HTTP messages with zero stack traces, filesystem paths, or token leakage.
3. **Repository Cleanliness**: `.env` is strictly git-ignored; `.env.example` provides non-sensitive placeholders only.

---

## Documentation Links

- [System Architecture](docs/architecture.md)
- [Hackathon Demo Script](docs/demo-script.md)
- [Demo Video Storyboard & Script](docs/demo-video-script.md)
- [Project Explanation & Submission Overview](docs/project-explanation.md)
- [Module 9 Testing & Validation Report](docs/module_9_report.md)
- [Module 8 Demo Dataset Report](docs/module_8_report.md)

---

## Project Status

> **Modules 1–10 are COMPLETE, VERIFIED, and LOCKED.**  
> REASONKEEP is fully packaged and submission-ready.
