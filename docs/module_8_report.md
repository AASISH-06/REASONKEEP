# REASONKEEP — Module 8 Engineering Report
**Module 8: Demo Dataset & Packaging**  
**Institution:** Meridian Institute of Technology (MIT)  
**Department / Lab:** Computer Engineering Research Lab  
**API Version:** `0.6.0`  
**Memory Bank:** `reasonkeep-university-demo` (Hindsight Cloud)  
**Status:** ✅ Complete, Verified, and Locked

---

## 1. Executive Summary

Module 8 establishes a coherent, realistic, synthetic institutional memory dataset for **REASONKEEP**, grounding all engineering memory, decision traces, and drift detection capabilities in a singular fictional institution: the **Meridian Institute of Technology (MIT) Computer Engineering Research Lab**.

Prior to Module 8, earlier development stages relied on fragmented, disparate test snippets. Module 8 replaces all ad-hoc data with a cohesive 14-record institutional repository spanning 7 interrelated technical projects. Every record implements deterministic, human-readable document identifiers (`MIT-CE-...`), provides idempotent ingestion into Hindsight Cloud, and is mirrored as human-readable source Markdown files in `demo_data/`.

Live verification confirmed 100% test pass rates across historical retrieval, rejected alternatives analysis, 10-stage decision trace reconstruction, decision drift conflict detection, failure post-mortem cross-referencing, and negative control zero-fabrication enforcement.

---

## 2. Institutional Setting & Fictional Identity

To ensure institutional coherence and eliminate synthetic discordance, all data is strictly unified under a single institutional setting:

* **Institution:** Meridian Institute of Technology (MIT)
* **Unit:** Computer Engineering Research Lab
* **Cohort Scope:** Graduate research cohorts, undergraduate senior design teams, and lab infrastructure engineers spanning 2023 through 2026.
* **Operating Reality:** University campus environment featuring historical stone buildings, dense outdoor student walkways, central server racks, thermal research freezers, and distributed field gateways.
* **Privacy & Synthetic Compliance:** 100% synthetic technical data. Zero real personal names, real student IDs, contact info, or proprietary campus schematics are used.

---

## 3. Complete Demo Dataset Inventory

The dataset comprises **14 curated records** across **7 projects**: 8 Architectural Decision Records (ADRs) and 6 Incident Post-Mortems / Failure Analyses.

| Document ID | Project Name | Memory Type | Title / Focus | Primary Outcome / Takeaway |
|---|---|---|---|---|
| `MIT-CE-SCN-DEC-001` | Smart Campus Network Infrastructure | `decision` | Standardizing on PostgreSQL 16 over MongoDB for Sensor Telemetry Storage | Enforces relational integrity and ACID guarantees across 5,000 sensors. |
| `MIT-CE-SCN-INC-001` | Smart Campus Network Infrastructure | `incident` | Central MQTT Ingestion Gateway Buffer Drop Under Telemetry Spike | Edge buffers overflowed; ring buffers and flow control implemented. |
| `MIT-CE-RDP-DEC-001` | Distributed Research Data Pipeline | `decision` | Selecting Apache Kafka over RabbitMQ for High-Throughput Event Streaming | 7-day replay window and partitioning chosen over transient broker queues. |
| `MIT-CE-RDP-DEC-002` | Distributed Research Data Pipeline | `decision` | Rejecting MongoDB in Favor of PostgreSQL for Research Data Pipeline Metadata | Unstructured documents caused schema drift and broken join foreign keys. |
| `MIT-CE-CEM-DEC-001` | Campus Energy Monitoring System | `decision` | Migrating Energy Submeters from Wi-Fi to Modbus RS-485 Serial Network | Wi-Fi dropouts eliminated; industrial RS-485 provides 99.98% packet delivery. |
| `MIT-CE-CEM-FAIL-001` | Campus Energy Monitoring System | `incident` | Wi-Fi Submeter Packet Drop and Data Loss in Central Chiller Plant | RF shielding from metal enclosures caused 38% loss; Wi-Fi banned for energy meters. |
| `MIT-CE-EAA-DEC-001` | Edge Attendance & Analytics | `decision` | Local Edge Inference with SQLite Cache Instead of Direct Cloud Streaming | Preserves campus network bandwidth and protects student biometric privacy. |
| `MIT-CE-EAA-FAIL-001` | Edge Attendance & Analytics | `incident` | MicroSD Card Corruption in Edge Analytics Nodes Due to Power Cycling | Classroom breaker cutoffs corrupted ext4 filesystems; pSLC flash + UPS required. |
| `MIT-CE-LEM-DEC-001` | Laboratory Equipment Monitoring | `decision` | Dedicated Hardwired Ethernet for Ultra-Low-Temperature (-80°C) Freezer Telemetry | Wi-Fi banned for mission-critical life science samples; dual hardwired sensors mandated. |
| `MIT-CE-LEM-FAIL-001` | Laboratory Equipment Monitoring | `incident` | Loss of Biology Samples Due to Stale Wi-Fi Telemetry and Missed Freezer Alert | Access point reboot left freezer unmonitored during compressor failure. |
| `MIT-CE-ESG-DEC-001` | Environmental Sensor Gateway | `decision` | Deploying LoRaWAN 915 MHz for Outdoor Environmental Monitoring Across Campus Quad | Sub-GHz frequency penetrates dense stone architecture up to 2.4 km. |
| `MIT-CE-ESG-INC-001` | Environmental Sensor Gateway | `incident` | Gateway Power Starvation and Battery Depletion During Winter Fog Inversion | 10W solar panels failed during 4 consecutive overcast days; upgraded to 35W panels. |
| `MIT-CE-ROV-DEC-001` | Campus Delivery Rover | `decision` | Dual 32-Beam LiDAR and Stereo Vision Redundancy Over Monocular RGB Camera | Monocular vision failed on dusk curbs; dual LiDAR + stereo ensures 99.4% detection. |
| `MIT-CE-ROV-FAIL-001` | Campus Delivery Rover | `incident` | Motor Controller USB Bus Freeze Induced by Back-EMF Transients | Inductive motor kick froze FTDI chips; mandatory isolated CAN bus implemented. |

---

## 4. Project-by-Project Narrative Breakdown

### Project 1: Smart Campus Network Infrastructure (`MIT-CE-SCN`)
* **Mission:** Campus-wide IoT telemetry ingestion and relational storage for building sensors.
* **Core Decisions & Incidents:** Standardized on PostgreSQL 16 (`MIT-CE-SCN-DEC-001`) after rejecting MongoDB due to relational consistency requirements across sensor installations. Incident `MIT-CE-SCN-INC-001` resolved central gateway drops under peak morning telemetry spikes through memory-backed ring buffers.

### Project 2: Distributed Research Data Pipeline (`MIT-CE-RDP`)
* **Mission:** Multi-source data pipeline routing lab instruments to central storage.
* **Core Decisions & Incidents:** Evaluated Apache Kafka vs. RabbitMQ (`MIT-CE-RDP-DEC-001`), selecting Kafka for immutable 7-day replay and partitioning. Rejected MongoDB (`MIT-CE-RDP-DEC-002`) after a graduate cohort experienced catastrophic schema drift and broken cross-table lookups.

### Project 3: Campus Energy Monitoring System (`MIT-CE-CEM`)
* **Mission:** Real-time electrical energy consumption tracking across academic facilities.
* **Core Decisions & Incidents:** Early student cohorts deployed commercial Wi-Fi smart plugs, resulting in incident `MIT-CE-CEM-FAIL-001` where thick chiller plant concrete and metal switchgear caused 38% telemetry packet loss. Led to ADR `MIT-CE-CEM-DEC-001`, migrating all submeters to shielded Modbus RS-485 serial networks.

### Project 4: Edge Attendance & Analytics (`MIT-CE-EAA`)
* **Mission:** Privacy-preserving edge computing nodes installed in lecture halls.
* **Core Decisions & Incidents:** Mandated local inference with SQLite edge buffers (`MIT-CE-EAA-DEC-001`) to protect student privacy. Incident `MIT-CE-EAA-FAIL-001` diagnosed repeated corruption of consumer MicroSD cards caused by custodial evening breaker cuts, instituting a mandatory hardware rule for power-loss protected pSLC flash.

### Project 5: Laboratory Equipment Monitoring (`MIT-CE-LEM`)
* **Mission:** Continuous temperature monitoring for biology department ultra-low-temperature (-80°C) freezers storing valuable cell cultures.
* **Core Decisions & Incidents:** Incident `MIT-CE-LEM-FAIL-001` recorded a catastrophic sample loss when an AP firmware reboot silenced Wi-Fi temperature heartbeats during a compressor failure. Led to decision `MIT-CE-LEM-DEC-001`: Wi-Fi is strictly banned for life-safety and critical lab equipment; dedicated PoE hardwired Ethernet is mandatory.

### Project 6: Environmental Sensor Gateway (`MIT-CE-ESG`)
* **Mission:** Outdoor solar-powered weather, humidity, and air quality nodes across the historic campus quad.
* **Core Decisions & Incidents:** Selected LoRaWAN 915 MHz (`MIT-CE-ESG-DEC-001`) to penetrate 19th-century granite buildings without needing campus Wi-Fi credentials. Incident `MIT-CE-ESG-INC-001` documented solar battery starvation during November winter fog, establishing sizing guidelines of 35W panels and 20Ah LiFePO4 packs.

### Project 7: Campus Delivery Rover (`MIT-CE-ROV`)
* **Mission:** Autonomous sidewalk delivery vehicle navigating pedestrian walkways.
* **Core Decisions & Incidents:** Mandated dual 32-beam LiDAR + stereo camera redundancy (`MIT-CE-ROV-DEC-001`) after single RGB cameras failed on low-lying curbs at dusk. Incident `MIT-CE-ROV-FAIL-001` diagnosed rover freezes caused by inductive motor back-EMF spikes over USB serial lines, establishing the mandatory galvanically isolated CAN bus requirement.

---

## 5. Document Taxonomy & Deterministic ID Strategy

All documents follow a deterministic naming convention that prevents collisions and enables idempotent synchronization:

$$\text{MIT-CE}-\langle\text{PROJECT}\rangle-\langle\text{TYPE}\rangle-\langle\text{INDEX}\rangle$$

* **Institution & Unit:** `MIT-CE` (Meridian Institute of Technology — Computer Engineering)
* **Project Codes:** `SCN`, `RDP`, `CEM`, `EAA`, `LEM`, `ESG`, `ROV`
* **Artifact Types:** `DEC` (Architectural Decision Record), `INC` (Operational Incident), `FAIL` (Hardware/Field Failure Post-Mortem)
* **Index:** 3-digit zero-padded index (`001`, `002`)

---

## 6. Ingestion Architecture & Idempotency Guarantees

Seeding demo memories across repeated hackathon demonstrations must never inflate the memory bank with duplicate entries.

```
POST /api/ingest/demo-seed
             │
             ▼
   Iterate 14 Memories
             │
             ▼
   Check Existing in Hindsight Cloud via recall_memory(doc_id)
      ├── Found: Record Already Present
      │     └── Skip retain_memory(), increment already_present counter
      └── Not Found: New Record
            └── Call retain_memory(), increment newly_seeded counter
             │
             ▼
   Return DemoSeedResult(total=14, newly_seeded=N, already_present=M, failed=0)
```

### Live Seeding Test Results
```
--- FIRST RUN ---
Run 1: Total=14, Success=14, Newly=14, Already=0, Failed=0

--- SECOND RUN (Idempotency Check) ---
Run 2: Total=14, Success=14, Newly=0, Already=14, Failed=0
SUCCESS: Idempotent seeding verified!
```

---

## 7. Human-Readable Repository Structure (`demo_data/`)

Every retained record in Hindsight Cloud has an exact, human-readable source counterpart in the repository:

```
demo_data/
├── README.md
├── projects/
│   ├── README.md
│   ├── smart_campus_network.md
│   ├── research_data_pipeline.md
│   ├── campus_energy_monitoring.md
│   ├── edge_attendance_analytics.md
│   ├── laboratory_equipment_monitoring.md
│   ├── environmental_sensor_gateway.md
│   └── campus_delivery_rover.md
├── decisions/
│   ├── README.md
│   ├── MIT-CE-SCN-DEC-001.md
│   ├── MIT-CE-RDP-DEC-001.md
│   ├── MIT-CE-RDP-DEC-002.md
│   ├── MIT-CE-CEM-DEC-001.md
│   ├── MIT-CE-EAA-DEC-001.md
│   ├── MIT-CE-LEM-DEC-001.md
│   ├── MIT-CE-ESG-DEC-001.md
│   └── MIT-CE-ROV-DEC-001.md
└── incidents/
    ├── README.md
    ├── MIT-CE-SCN-INC-001.md
    ├── MIT-CE-CEM-FAIL-001.md
    ├── MIT-CE-EAA-FAIL-001.md
    ├── MIT-CE-LEM-FAIL-001.md
    ├── MIT-CE-ESG-INC-001.md
    └── MIT-CE-ROV-FAIL-001.md
```

---

## 8. Institutional Memory Assistant Verification

The Institutional Memory Assistant (`POST /api/assistant/ask`) was queried against accumulated institutional memory:

### Test 1: Historical Decision Query
* **Query:** *"Why was PostgreSQL selected for the smart campus network?"*
* **Response Status:** `found=True`, Evidence Count: 123
* **Synthesized Grounded Answer:**
  > *"Previous project records indicate: The Campus Infrastructure Group at the Meridian Institute of Technology standardized on PostgreSQL 16 for the Smart Campus Network for several key architectural reasons: relational integrity guarantees across 5,000 concurrent sensor feeds, ACID compliance for device state transitions, and built-in TimescaleDB extension compatibility for time-series aggregation..."*

### Test 2: Rejected Alternative Query
* **Query:** *"Why was MongoDB rejected for the research data pipeline?"*
* **Response Status:** `found=True`, Evidence Count: 121
* **Synthesized Grounded Answer:**
  > *"Previous project records indicate: The Data Systems Research Cohort rejected MongoDB for the Research Data Pipeline primarily due to its inability to enforce relational integrity and strict foreign-key relationships across instrument metadata, which previously resulted in orphaned telemetry records during schema modifications..."*

---

## 9. Decision Trace Verification (10-Stage Reconstruction)

Decision Trace (`POST /api/trace/decision`) was executed to reconstruct the historical reasoning timeline for PostgreSQL selection.

* **Query:** *"Why was PostgreSQL selected for the smart campus network?"*
* **Response Status:** `found=True`, Stages Count: 10, Evidence Count: 10
* **Reconstructed 10-Stage Trajectory:**
  1. `[context]`: Project & Organizational Context — *Found*
  2. `[problem]`: Problem Statement & Requirements — *Unavailable (Zero-Fabrication preserved)*
  3. `[constraints]`: Technical & Operational Constraints — *Unavailable (Zero-Fabrication preserved)*
  4. `[alternatives]`: Alternatives Evaluated — *Found*
  5. `[rejected_alternatives]`: Rejected Alternatives & Rationale — *Found*
  6. `[decision]`: Final Decision Made — *Found*
  7. `[rationale]`: Decision Justification & Rationale — *Found*
  8. `[failure]`: Failure History & Roadblocks — *Found*
  9. `[outcome]`: Observed Deployment Outcome — *Found*
  10. `[lesson]`: Institutional Takeaway for Future Teams — *Found*

*Zero fabrication contract observed:* The 2 stages without explicit matching text were marked `unavailable` with honest disclosure rather than hallucinated text.

---

## 10. Decision Drift Verification (5 Core Scenarios)

The Decision Drift Detection engine (`POST /api/drift/analyze`) evaluated new engineering proposals against historical memory:

### Scenario 1: MongoDB Proposal (Resurrecting Rejected Alternative)
* **Proposal:** *"Replace PostgreSQL with MongoDB in the research data pipeline to allow dynamic unstructured sensor schemas."*
* **Classification:** `status: drift_detected`
* **Confidence Basis:** *"Direct conflict with historical rejection, failure postmortem, or institutional lesson."*
* **Documented Conflicts Detected:** 8 historical conflicts flagged (including schema fragmentation, lack of foreign keys, and past pipeline downtime).

### Scenario 2: Single RGB Camera (Resurrecting Failed Perception)
* **Proposal:** *"Replace the rover's LiDAR and stereo vision system with a single RGB camera to reduce cost."*
* **Classification:** `status: drift_detected`
* **Documented Conflicts Detected:** 5 historical conflicts flagged (low-light dusk failures, curb misclassification).

### Scenario 3: Modbus Shielded Serial (Aligned)
* **Proposal:** *"Standardize all plant room energy meters on shielded Modbus RS-485 serial cables."*
* **Classification:** `status: aligned`
* **Institutional Reinforcement:** Confirms adherence to ADR `MIT-CE-CEM-DEC-001`.

### Scenario 4: Chassis Powder Coat Color (Indeterminate)
* **Proposal:** *"Change the rover chassis powder coat color from matte black to safety orange."*
* **Classification:** `status: indeterminate`
* **Grounded Basis:** No engineering constraints or failure histories exist regarding aesthetic chassis colors; zero speculative rules generated.

### Scenario 5: Medieval Poetry Policy (Negative Control)
* **Proposal:** *"Adopt a university policy for medieval poetry recitation in 1845."*
* **Classification:** `status: no_memory`
* **Result:** Correctly identified that no institutional engineering records exist for 1845 or medieval literature.

---

## 11. Failure History & Cross-Project Learning Analysis

Module 8 demonstrates cross-project knowledge transfer where mistakes in one team inform policies in another:

1. **The Wi-Fi Ban for Critical Telemetry:**
   - *Origin:* Project 3 (`MIT-CE-CEM-FAIL-001`) experienced 38% packet dropouts when commercial Wi-Fi smart plugs were installed in chiller rooms.
   - *Escalation:* Project 5 (`MIT-CE-LEM-FAIL-001`) suffered biology sample loss when an AP rebooted and dropped freezer telemetry during a compressor outage.
   - *Cross-Project Rule:* Hardwired Ethernet or sub-GHz LoRaWAN is mandated across all lab safety and facility monitoring systems. Wi-Fi is strictly banned for life-safety or continuous sub-minute telemetry.

2. **Electrical Isolation Across Microcontrollers:**
   - *Origin:* Project 7 (`MIT-CE-ROV-FAIL-001`) experienced rover CPU lockups due to inductive motor back-EMF spikes over USB serial lines.
   - *Cross-Project Rule:* Galvanically isolated CAN bus or optoisolated RS-485 is required whenever logic microcontrollers interface with inductive motor loads.

---

## 12. Negative Control & Zero-Fabrication Enforcement

To guarantee institutional integrity, negative controls were systematically evaluated:

* **Query:** *"Did the department previously build a medieval poetry system in 1845?"*
* **System Response:**
  > *"The provided records do not contain any information regarding a 'medieval poetry system' or any events or projects from the year 1845. The retrieved data focuses exclusively on modern campus infrastructure, robotics, research data pipelines, environmental monitoring, and laboratory safety systems at the Meridian Institute of Technology, with recorded events spanning from 2023 to 2026."*
* **Enforcement:** Zero speculative projects synthesized. Zero fictional personas created. Transparent disclosure of missing knowledge.

---

## 13. Frontend Integration & Verification

1. **TopBar & Institutional Branding:**
   - Subtitle: `Meridian Institute of Technology • Computer Engineering Research Lab`
   - Badge: `MODULE 8 · DEMO DATASET`
2. **IngestionDevPanel Seeding Flow:**
   - Seed button updated to **`⚡ Seed All 14 Demo Memories`**.
   - Displays real-time counts: `Total: 14`, `Newly Seeded: N`, `Already Present: M`, `Errors: 0`.
3. **Module Roadmap & Tech Stack Cards (`FoundationPage.tsx` & `data/index.ts`):**
   - Module 7: **Completed**
   - Module 8: **Completed** ("Demo Dataset & Verification")
   - Module 9: **Locked** ("Autonomous Institutional Agent: Strictly locked out of scope")
4. **Vite Production Bundle Verification:**
   - Ran `npm run build`:
     ```
     ✓ 37 modules transformed.
     dist/index.html                   0.93 kB │ gzip:  0.51 kB
     dist/assets/index-5pT_sQVY.css   25.03 kB │ gzip:  5.68 kB
     dist/assets/index-CPA8gVde.js   294.52 kB │ gzip: 83.56 kB
     ✓ built in 1.12s
     ```
   - Zero TypeScript or bundling errors.

---

## 14. System Health & Performance Baseline

* **Backend Health (`GET /health`):**
  ```json
  {
    "status": "ok",
    "service": "reasonkeep-api",
    "version": "0.6.0"
  }
  ```
* **Memory Bank (`GET /api/memory/status`):**
  - Provider: `hindsight`
  - Bank ID: `reasonkeep-university-demo`
  - Configured: `true`
* **Idempotent Ingestion Latency:** ~2.1s per record on first retain, ~0.4s per record on idempotent verification.
* **Assistant / Trace / Drift Query Latency:** ~3.5s – 8.2s for deep Hindsight semantic reflection and grounded fact synthesis.

---

## 15. Strict Scope Compliance Matrix

| Requirement | Bible Constraint | Module 8 Compliance Status |
|---|---|---|
| **Autonomous Institutional Agent** | Strictly Forbidden | ✅ Zero autonomous agents, planners, or workers created. |
| **Autonomous Planning / Execution** | Strictly Forbidden | ✅ No background goal execution or automated actions. |
| **Secondary Databases (Vector / SQL)** | Strictly Forbidden | ✅ Zero SQLite, Postgres, Redis, Chroma, Pinecone introduced. Hindsight Cloud is sole memory store. |
| **LangChain / LangGraph** | Strictly Forbidden | ✅ Direct official `hindsight-client` Python SDK only. Zero external orchestration frameworks. |
| **User Accounts / Multi-Tenancy** | Strictly Forbidden | ✅ No auth, sessions, JWTs, or user tables. |
| **Deterministic Seeding** | Mandatory | ✅ Deterministic `MIT-CE-...` document IDs and idempotency checks implemented. |
| **Zero-Fabrication Contract** | Mandatory | ✅ Negative control verified; unavailable stages honestly marked. |
| **Module 9 Lockdown** | Mandatory | ✅ Strict stop after Module 8. Module 9 is marked locked. |

---

## 16. Known Constraints & Production Readiness

1. **Hindsight Cloud Credits:**
   - Semantic reflection (`areflect`) requires available API credits on Hindsight Cloud.
   - When credit balance is depleted ($0.00), the backend cleanly handles `402 Payment Required` errors and returns sanitized HTTP 502 messages without leaking keys.
   - Semantic recall (`arecall`) remains functional, and all 14 memories are persistently stored in the memory bank.
2. **Network Resilience:**
   - Client timeouts and connection resets are caught and surfaced via the standardized Module 7 retry UI.

---

## 17. Hackathon Demo Walkthrough Script Alignment

The walkthrough script in [`docs/demo-script.md`](docs/demo-script.md) is fully synchronized with Module 8:
* **Act 1:** The Core Problem — Student turnover and lab amnesia at Meridian Institute of Technology.
* **Act 2:** Decision Drift Detection — Live testing of MongoDB proposal, monocular camera trap, Modbus alignment, and medieval poetry negative test.
* **Act 3:** Decision Trace Reconstruction — 10-stage historical lineage of PostgreSQL selection.
* **Act 4:** Institutional Memory Assistant — Instant Q&A citing exact documentary evidence.
* **Act 5:** Structured Ingestion — 1-click idempotent seeding of all 14 memories with real-time feedback.
* **Act 6:** Raw Memory Inspection — Direct Hindsight Cloud retain/recall verification.

---

## 18. Conclusion & Sign-Off

**Module 8: Demo Dataset & Packaging** is complete, verified, and locked. The REASONKEEP institutional engineering memory platform is packaged with a realistic dataset, deterministic document IDs, idempotent seeding, and verified query flows across all product surfaces.

Per the Master Engineering Project Bible v1.0, development strictly terminates at the conclusion of Module 8. Module 9 (Autonomous Institutional Agent) is locked out of scope.
