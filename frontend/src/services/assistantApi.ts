/**
 * assistantApi.ts — API client for Module 4 Institutional Memory Assistant.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export interface AssistantAskRequest {
  query: string
  project?: string
  team?: string
  tags?: string[]
  memory_type?: string
}

export interface MemoryEvidenceItem {
  id?: string | null
  text: string
  context?: string | null
  document_id?: string | null
  type?: string | null
}

export interface AssistantContext {
  project?: string | null
  team?: string | null
  tags?: string[] | null
  augmented_query: string
}

export interface AssistantAskResponse {
  query: string
  found: boolean
  answer: string
  memories_used: number
  evidence: MemoryEvidenceItem[]
  context: AssistantContext
  bank_id: string
}

export async function askAssistant(request: AssistantAskRequest): Promise<AssistantAskResponse> {
  const res = await fetch(`${BASE_URL}/api/assistant/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? `Assistant query failed: ${res.status}`)
  }
  return res.json()
}
