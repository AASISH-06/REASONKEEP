# REASONKEEP — Official Demo Video Storyboard & Script

> Video Duration: 3 minutes 45 seconds  
> Target Audience: Hackathon Judges, University Engineering Directors, Research Lab Leads  
> System: REASONKEEP v0.6.0 (Meridian Institute of Technology — Computer Engineering Research Lab)  
> Memory Layer: Hindsight Cloud (`reasonkeep-university-demo`)  

---

## Storyboard Overview

| Timecode | Scene / Action | Screen Focus | Narration Focus |
|---|---|---|---|
| **0:00 – 0:30** | Hook & Problem Definition | TopBar & Lab Header | The "Catastrophic Amnesia" problem in university labs |
| **0:30 – 1:15** | Feature 1: Decision Drift | Decision Drift Panel | Catching recurring design traps before they happen |
| **1:15 – 2:00** | Feature 2: Decision Trace | Decision Trace Panel | 10-Stage engineering reconstruction & lineage |
| **2:00 – 2:45** | Feature 3: Memory Assistant | Assistant Panel | Grounded Q&A with real-time memory citations |
| **2:45 – 3:15** | Feature 4: Zero Fabrication | Medieval Poetry Query | Negative control audit showing zero hallucinations |
| **3:15 – 3:45** | Architecture & Closing | Architecture Overview | Hindsight Cloud integration & project conclusion |

---

## Detailed Script & Screen Actions

### Scene 1: The University Amnesia Problem (0:00 – 0:30)
- **Screen Action**:
  - Browser opens on `http://localhost:5173`.
  - Camera pans over the header: `REASONKEEP`, badge `MODULE 10 · SUBMISSION READY`, institution line `Meridian Institute of Technology • Computer Engineering Research Lab`, and the live green indicator `Hindsight Cloud Connected`.
- **Narration**:
  > *"Every May, university engineering labs lose their most valuable asset: experience. Seniors graduate, graduate researchers defend their theses, and years of hard-won engineering lessons vanish from memory.*
  > 
  > *Come September, a new student cohort arrives. And what happens? They make the exact same mistakes: picking the same brittle motor communication protocols, choosing the same unsuitable database, and falling into the exact same hardware traps.*
  > 
  > *This is REASONKEEP — institutional memory for university engineering teams, powered directly by Hindsight Cloud."*

---

### Scene 2: Decision Drift Detection (0:30 – 1:15)
- **Screen Action**:
  - Scroll smoothly to **`01 // Decision Drift Detection`**.
  - Click preset chip: **`⚡ Scenario 1: LiDAR → Single RGB Camera`**.
  - Text box fills with: *"Replace the rover's LiDAR and stereo vision system with a single RGB camera to reduce cost."*
  - Click **`🔍 CHECK DECISION DRIFT`**.
  - Show the loading state: `"Checking historical conflicts with Hindsight Cloud..."`.
  - Result appears: Crimson badge **`DRIFT DETECTED — HISTORICAL CONFLICT`**.
  - Cursor highlights the **Documented Conflicts** card and **Historical Decision**.
- **Narration**:
  > *"Here is REASONKEEP's flagship innovation: Decision Drift Detection. Before an incoming student writes a line of code or buys hardware, they submit their proposed design.*
  > 
  > *Imagine a new robotics student proposes replacing the autonomous delivery rover's expensive dual LiDAR system with a single cheap RGB camera.*
  > 
  > *Instantly, REASONKEEP queries Hindsight Cloud and raises a red flag: DRIFT DETECTED. It reveals that two semesters ago, a previous cohort already tested single RGB cameras and suffered collision failures during dusk lighting on campus walkways. The institutional rule is codified: Never rely solely on monocular vision in unconstrained outdoor lighting. Months of wasted effort and budget are saved in 2 seconds."*

---

### Scene 3: Decision Trace — 10-Stage Reconstruction (1:15 – 2:00)
- **Screen Action**:
  - Scroll to **`02 // Decision Trace`**.
  - Click sample chip: **`📜 LiDAR Decision`** (*"Why did Project Hermes select LiDAR for obstacle detection?"*).
  - Click **`🔬 TRACE DECISION`**.
  - Loading skeleton appears: `"Reconstructing decision history..."`.
  - 10-stage timeline animates into view:
    1. Context
    2. Problem
    3. Constraints
    4. Alternatives
    5. Rejected Alternatives
    6. Decision
    7. Rationale
    8. Roadblock / Failures
    9. Outcome
    10. Institutional Lesson
  - Click to expand **`▸ View Cited Evidence (1 Memory)`** revealing the exact Hindsight Cloud record.
- **Narration**:
  > *"Standard AI assistants summarize text; REASONKEEP's Decision Trace reconstructs the complete engineering lineage.*
  > 
  > *When a researcher asks why LiDAR was chosen, Decision Trace rebuilds the 10-stage historical path: the campus constraints, the discarded alternatives, the actual field collisions encountered during testing, and the quantitative outcome.*
  > 
  > *Notice stage 8: it highlights the exact failure incident — an undetected skateboard at dusk. And if historical documentation is missing for any stage, REASONKEEP explicitly marks it 'Documentation Unavailable' rather than fabricating a fictional history."*

---

### Scene 4: Institutional Memory Assistant (2:00 – 2:45)
- **Screen Action**:
  - Scroll to **`03 // Institutional Memory Assistant`**.
  - Click preset query: *"Why did the Distributed Research Data Pipeline reject MongoDB in favor of PostgreSQL?"*
  - Click **`💬 ASK ASSISTANT`**.
  - Response renders with grounded institutional summary and a citation badge `CIT-01`.
  - Hover over the citation badge to show the linked evidence card.
- **Narration**:
  > *"When students need quick answers during sprint planning, the Institutional Memory Assistant provides grounded Q&A backed by real-time citations.*
  > 
  > *Here, querying our database selection history explains that MongoDB was rejected because unstructured schemas led to foreign key drift across distributed sensor pipelines. Every single fact is tied directly to a permanent Hindsight Cloud document identifier."*

---

### Scene 5: Zero-Fabrication Negative Control (2:45 – 3:15)
- **Screen Action**:
  - In Decision Drift, click preset chip: **`⚡ Scenario 5: Medieval Poetry (1845)`**.
  - Proposal: *"Adopt a university policy for medieval poetry recitation in 1845."*
  - Click **`🔍 CHECK DECISION DRIFT`**.
  - Result renders: Slate banner **`NO RELEVANT INSTITUTIONAL MEMORY`**.
  - Clear message: *"No institutional memory records were found matching this topic."*
- **Narration**:
  > *"In an engineering lab, hallucination is dangerous. That's why REASONKEEP enforces a strict Zero-Fabrication Contract.*
  > 
  > *Watch what happens when we ask about university policy on medieval poetry recitation in 1845. The system doesn't guess, doesn't generate fake conflicts, and doesn't fabricate institutional history. It cleanly returns No Relevant Institutional Memory."*

---

### Scene 6: Architecture & Closing (3:15 – 3:45)
- **Screen Action**:
  - Pan to footer / architecture overview card showing: React 19 + TypeScript frontend, FastAPI backend, and direct HTTPS connection to Hindsight Cloud.
  - Show the terminal/tests passing: `10/10 test suites passed`.
- **Narration**:
  > *"Under the hood, REASONKEEP is clean and robust. Built with FastAPI and React 19, with zero local databases or complex vector pipelines. Hindsight Cloud serves as our sole, authoritative institutional memory bank.*
  > 
  > *REASONKEEP transforms university engineering departments from places that forget every graduation into institutions that continuously learn. Thank you."*
