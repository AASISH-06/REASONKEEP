/**
 * ingestionApi.ts — API client for Module 3 Institutional Memory Ingestion.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export type MemoryType =
  | 'decision'
  | 'constraint'
  | 'alternative'
  | 'failure'
  | 'outcome'
  | 'lesson'
  | 'project'

export interface RejectedAlternative {
  alternative: string
  reason: string
}

export interface InstitutionalMemoryPayload {
  project: string
  project_type?: string
  organization_context?: string
  memory_type: MemoryType
  title?: string
  decision?: string
  reason?: string
  constraints?: string[]
  alternatives?: string[]
  rejected_alternatives?: RejectedAlternative[]
  failure?: string
  outcome?: string
  lesson?: string
  team_context?: string
  date?: string
  source?: string
  tags?: string[]
}

export interface IngestResult {
  success: boolean
  project: string
  memory_type: string
  title?: string | null
  formatted_content: string
  bank_id: string
  items_count: number
  operation_id?: string | null
}

export interface DemoSeedResult {
  total: number
  successful: number
  failed: number
  already_present?: number
  newly_seeded?: number
  results: IngestResult[]
  note: string
}

export async function ingestDecision(payload: InstitutionalMemoryPayload): Promise<IngestResult> {
  const res = await fetch(`${BASE_URL}/api/ingest/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? `Ingestion failed: ${res.status}`)
  }
  return res.json()
}

export async function fetchDemoData(): Promise<InstitutionalMemoryPayload[]> {
  const res = await fetch(`${BASE_URL}/api/ingest/demo-data`)
  if (!res.ok) throw new Error(`Failed to load demo data: ${res.status}`)
  return res.json()
}

export async function seedDemoMemories(): Promise<DemoSeedResult> {
  const res = await fetch(`${BASE_URL}/api/ingest/demo-seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? `Seeding failed: ${res.status}`)
  }
  return res.json()
}
