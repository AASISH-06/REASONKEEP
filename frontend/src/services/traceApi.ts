/**
 * traceApi.ts — API client for Module 5 Decision Trace.
 * Reconstructs the historical reasoning behind past engineering decisions.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export type StageType =
  | 'context'
  | 'problem'
  | 'constraints'
  | 'alternatives'
  | 'rejected_alternatives'
  | 'decision'
  | 'rationale'
  | 'failure'
  | 'outcome'
  | 'lesson'

export type StageStatus = 'found' | 'partial' | 'unavailable'

export interface DecisionTraceStage {
  stage: StageType
  title: string
  description: string
  status: StageStatus
  evidence: string[]
  source?: string | null
  confidence_basis?: string | null
}

export interface TraceEvidenceItem {
  id?: string | null
  text: string
  context?: string | null
  document_id?: string | null
  type?: string | null
}

export interface DecisionTraceRequest {
  query: string
  project?: string
  team?: string
  tags?: string[]
  max_evidence?: number
}

export interface DecisionTraceResponse {
  query: string
  found: boolean
  project?: string | null
  team?: string | null
  trace: DecisionTraceStage[]
  memories_used: number
  evidence: TraceEvidenceItem[]
  bank_id: string
  message?: string | null
}

export interface TraceStatusResponse {
  configured: boolean
  bank_id: string
  provider: string
}

export async function fetchTraceStatus(): Promise<TraceStatusResponse> {
  const res = await fetch(`${BASE_URL}/api/trace/status`)
  if (!res.ok) {
    throw new Error(`Failed to fetch trace status: ${res.status}`)
  }
  return res.json()
}

export async function traceDecision(request: DecisionTraceRequest): Promise<DecisionTraceResponse> {
  const res = await fetch(`${BASE_URL}/api/trace/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? `Decision trace query failed: ${res.status}`)
  }
  return res.json()
}
