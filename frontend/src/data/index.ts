/**
 * data/index.ts — Static institutional metadata and module roadmap.
 *
 * Scope Status:
 * Modules 1–10: Complete & Verified (Submission Ready)
 *
 * Strict Rule: No autonomous agent, no secondary databases.
 */

export interface ModuleInfo {
  module: string
  title: string
  status: 'active' | 'upcoming' | 'completed' | 'locked'
  description: string
}

export const MODULES: ModuleInfo[] = [
  {
    module: 'Module 1',
    title: 'Project Foundation',
    status: 'completed',
    description:
      'Repository architecture, React 19 + TypeScript frontend shell, FastAPI backend service, environment configuration, and health check.',
  },
  {
    module: 'Module 2',
    title: 'Hindsight Memory Layer',
    status: 'completed',
    description:
      'Direct integration with Hindsight Cloud memory bank (reasonkeep-university-demo). Async retain, semantic recall, and grounded reflection.',
  },
  {
    module: 'Module 3',
    title: 'Institutional Ingestion Pipeline',
    status: 'completed',
    description:
      'Structured institutional memory pipeline capturing decisions, rationale, constraints, rejected alternatives, failure post-mortems, and lessons.',
  },
  {
    module: 'Module 4',
    title: 'Institutional Memory Assistant',
    status: 'completed',
    description:
      'Grounded Q&A assistant for engineering cohorts to query historical decisions before repeating design choices. Memory citations with zero fabrication.',
  },
  {
    module: 'Module 5',
    title: 'Decision Trace',
    status: 'completed',
    description:
      'Structured 10-stage historical engineering reconstruction layer mapping context, problem, constraints, alternatives, failures, and institutional lessons.',
  },
  {
    module: 'Module 6',
    title: 'Decision Drift Detection',
    status: 'completed',
    description:
      'Conflict vs. alignment classification engine evaluating new engineering proposals against documented institutional history, failures, and constraints.',
  },
  {
    module: 'Module 7',
    title: 'Frontend Polish',
    status: 'completed',
    description:
      'Institutional UI design system, layout-stable loading states, differentiated empty states, standardized error handling with retry, and unified evidence cards.',
  },
  {
    module: 'Module 8',
    title: 'Demo Dataset & Verification',
    status: 'completed',
    description:
      'Coherent 14-memory synthetic institutional dataset across 7 projects at Meridian Institute of Technology Computer Engineering Research Lab, deterministic idempotent seeding, and historical test suite.',
  },
  {
    module: 'Module 9',
    title: 'Testing & Validation',
    status: 'completed',
    description:
      'Comprehensive automated end-to-end test suite: Hindsight connection, retain, recall, reflect, decision trace, decision drift, error states, persistence, and regression.',
  },
  {
    module: 'Module 10',
    title: 'Submission Package',
    status: 'completed',
    description:
      'Final submission packaging, presentation materials, demo video script, architecture specifications, and end-to-end verification.',
  },
]

export const TECH_STACK = [
  { label: 'Frontend',   value: 'React 19 · Vite · TypeScript · Tailwind CSS' },
  { label: 'Backend',    value: 'Python 3.11 · FastAPI · Pydantic Settings' },
  { label: 'Memory Layer', value: 'Hindsight Cloud (reasonkeep-university-demo)' },
  { label: 'Ingestion Engine', value: 'Structured Institutional Memory Pipeline (Module 3)' },
  { label: 'Assistant',  value: 'Grounded Institutional Q&A (Module 4)' },
  { label: 'Trace Engine', value: '10-Stage Historical Decision Reconstruction (Module 5)' },
  { label: 'Drift Engine', value: 'Conflict & Alignment Detection (Module 6)' },
  { label: 'Design System', value: 'Institutional UI & Standardized Evidence Cards (Module 7)' },
  { label: 'Demo Dataset', value: 'Meridian Institute of Technology — 14 Memories / 7 Projects (Module 8)' },
]

