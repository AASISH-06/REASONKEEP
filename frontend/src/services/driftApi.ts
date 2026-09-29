/**
 * driftApi.ts — API client for Module 6 Decision Drift Detection.
 * Compares current proposals against documented historical institutional memory.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export type DriftStatus = 'drift_detected' | 'aligned' | 'indeterminate' | 'no_memory'

export interface DriftEvidenceItem {
  id?: string | null
  text: string
  context?: string | null
  document_id?: string | null
  type?: string | null
}

export interface DriftAnalysisRequest {
  proposal: string
  project?: string
  team?: string
  tags?: string[]
  max_evidence?: number
}

export interface DriftAnalysisResponse {
  proposal: string
  status: DriftStatus
  explanation: string
  confidence_basis: string
  previous_decision?: string | null
  historical_rationale?: string | null
  historical_constraints: string[]
  documented_conflicts: string[]
  historical_outcomes: string[]
  institutional_lesson?: string | null
  evidence: DriftEvidenceItem[]
  memories_used: number
  project?: string | null
  team?: string | null
  bank_id: string
}

export interface DriftStatusResponse {
  configured: boolean
  bank_id: string
  provider: string
}

export async function fetchDriftStatus(): Promise<DriftStatusResponse> {
  const res = await fetch(`${BASE_URL}/api/drift/status`)
  if (!res.ok) {
    throw new Error(`Failed to fetch drift status: ${res.status}`)
  }
  return res.json()
}

export async function analyzeDecisionDrift(
  request: DriftAnalysisRequest,
): Promise<DriftAnalysisResponse> {
  const res = await fetch(`${BASE_URL}/api/drift/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      (err as { detail?: string }).detail ?? `Decision drift analysis failed: ${res.status}`,
    )
  }
  return res.json()
}
