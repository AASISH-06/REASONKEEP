# REASONKEEP — Hackathon Demo Script

> Status: Operational & Verified (Module 10 — Submission Package)  
> API Version: `0.6.0`  
> Memory Bank: `reasonkeep-university-demo` (Hindsight Cloud)  
> Domain: Meridian Institute of Technology (MIT) — Computer Engineering Research Lab  

---

## 1. Demo Setup & Environment Prerequisites

1. **Verify Backend Service**:
   ```bash
   cd backend
   .\.venv\Scripts\activate
   uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
   *Health Check*: `GET http://127.0.0.1:8000/health`  
   *Expected Response*: `{"status":"ok","service":"reasonkeep-api","version":"0.6.0"}`

2. **Verify Frontend Application**:
   ```bash
   cd frontend
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
   *Browser Target*: `http://localhost:5173`

3. **Verify Seeded Institutional Dataset**:
   - Institutional Bank: `reasonkeep-university-demo`
   - In the Ingestion Panel, click **`⚡ Seed All 14 Demo Memories`** if not already seeded.
   - Idempotent retention ensures exactly 14 records across 7 projects with zero duplicates.

---

## 2. Interactive Hackathon Demo Flow (3–5 Minutes)

### Stage 1: The Institutional Amnesia Problem (30s)
- **Visual**: Show the top persistent header with the live badge: `MODULE 10 · SUBMISSION READY` and `Hindsight Cloud Connected`.
- **Narration**:
  > *"Every academic year, university engineering labs lose their most valuable asset: experience. Students graduate, research cohorts rotate, and new teams arrive only to repeat the exact same hardware fires, communication bus lockups, and database migrations that past cohorts already spent months solving. REASONKEEP is institutional memory for university engineering teams — powered directly by Hindsight Cloud."*

---

### Stage 2: Institutional Memory Assistant — Grounded Q&A (60s)
- **Visual**: Scroll to **Institutional Memory Assistant** (Card 01).
- **Action**: Click the query preset:  
  `"Why did Project Hermes choose LiDAR instead of a single camera?"`
- **Click**: `ASK ASSISTANT`
- **Key Points to Demonstrate**:
  1. **Grounded Answer**: The assistant explains that monocular cameras failed in dusk lighting and could not reliably detect obstacles under 15 cm, mandating dual LiDAR + stereo cameras.
  2. **Institutional Citations**: Point out the citation pill (`CIT-01`).
  3. **Evidence Card**: Click to expand the grounded evidence card showing the exact memory record from project `MIT-CE-ROV` (`Campus Delivery Rover`).
  4. **Zero Fabrication**: Point out that the model does not speculate beyond what previous cohorts recorded.

---

### Stage 3: Decision Trace — 10-Stage Historical Reconstruction (60s)
- **Visual**: Scroll to **Decision Trace** (Card 02).
- **Concept**: Explain: *"While an assistant answers questions, Decision Trace answers: 'How did this decision come to exist?' It reconstructs the full 10-stage engineering lineage."*
- **Action**: Click the sample preset:  
  `"Why did Project Hermes select LiDAR for obstacle detection?"`
- **Click**: `TRACE DECISION`
- **Key Points to Demonstrate**:
  1. **10 Structured Stages**: Context → Problem → Constraints → Alternatives → Rejected Alternatives → Decision → Rationale → Roadblocks/Failures → Outcome → Institutional Lesson.
  2. **Documented Failures**: Notice Stage 08 highlights the real field failure: dusk collision with an empty skateboard on a campus walkway.
  3. **Institutional Lesson**: Stage 10 provides inherited advice: *"Never rely solely on monocular vision in unconstrained outdoor campus environments."*
  4. **Unavailable Handling**: Show that if historical evidence is missing for a stage, it explicitly marks it as `DOCUMENTATION UNAVAILABLE` rather than inventing speculative content.

---

### Stage 4: Decision Drift Detection — Flagship Conflict Engine (60s)
- **Visual**: Scroll to **Decision Drift Detection** (Card 03).
- **Concept**: Explain: *"Before an incoming student team writes a single line of code or buys hardware, Decision Drift checks their proposal against historical lessons: 'Does this contradict what past teams learned?'"*

#### Scenario A: High-Risk Conflict (`drift_detected`)
- **Action**: Click chip **`⚡ Scenario 1: LiDAR → Single RGB Camera`**  
  *Proposal*: `"Replace the rover's LiDAR and stereo vision system with a single RGB camera to reduce cost."*
- **Click**: `CHECK DECISION DRIFT`
- **Result**:
  - Banner: **`DRIFT DETECTED — HISTORICAL CONFLICT`** (Crimson badge).
  - Documented Conflict: Rejection of monocular RGB vision due to dusk failures.
  - Institutional Constraints: 15cm obstacle height, outdoor lighting variance.
  - Historical Decision: Dual Ouster OS1-32 LiDAR + stereo vision architecture.

#### Scenario B: Field-Proven Failure Conflict (`drift_detected`)
- **Action**: Click chip **`⚡ Scenario 2: USB Serial Motor Comm`**  
  *Proposal*: `"Switch motor controller communication from isolated CAN bus to standard USB serial."*
- **Click**: `CHECK DECISION DRIFT`
- **Result**:
  - Banner: **`DRIFT DETECTED — HISTORICAL CONFLICT`**
  - Identifies historical incident: Back-EMF transients froze USB FTDI chip mid-crosswalk.
  - Documents hard rule: Galvanically isolated CAN bus only.

#### Scenario C: Aligned Proposal (`aligned`)
- **Action**: Click chip **`⚡ Scenario 3: Redundant Perception Sensing`**  
  *Proposal*: `"Keep redundant perception sensing for campus obstacle detection."*
- **Click**: `CHECK DECISION DRIFT`
- **Result**:
  - Banner: **`ALIGNED — INSTITUTIONAL COHERENCE`** (Emerald badge).
  - Validates that the proposal reinforces accumulated institutional wisdom.

---

### Stage 5: Negative-Control / Zero-Fabrication Audit (30s)
- **Visual**: Stay on Decision Drift or switch to Assistant / Trace.
- **Action**: Click chip **`⚡ Scenario 5: Medieval Poetry (1845)`**  
  *Proposal*: `"Adopt a university policy for medieval poetry recitation in 1845."*
- **Click**: `CHECK DECISION DRIFT`
- **Result**:
  - Banner: **`NO RELEVANT INSTITUTIONAL MEMORY`** (Subtle slate banner).
  - Explanation: Explicitly states that no institutional memory records exist for this topic.
  - Key Takeaway for Judges: Zero hallucination, zero speculative conflict generation, zero fake citations.

---

### Stage 6: Conclusion & System Integrity (15s)
- **Summary**:
  > *"REASONKEEP turns transient student experience into permanent institutional intelligence. Powered exclusively by Hindsight Cloud, it transforms university engineering labs from places that forget into organizations that learn."*
