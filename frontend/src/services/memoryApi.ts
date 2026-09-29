/**
 * memoryApi.ts — thin wrappers for Module 2 memory endpoints.
 * These are development verification helpers only.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export interface MemoryStatus {
  configured: boolean
  bank_id: string | null
  provider: string
  api_url: string | null
}

export interface RetainResult {
  found: boolean
  bank_id: string
  items_count: number
  is_async: boolean
  operation_id: string | null
}

export interface MemoryItem {
  id: string
  text: string
  type: string | null
  context: string | null
  document_id: string | null
  metadata: Record<string, string> | null
}

export interface RecallResult {
  found: boolean
  count: number
  memories: MemoryItem[]
}

export interface ReflectResult {
  found: boolean
  response: string
  memories_used: number
}

export async function fetchMemoryStatus(): Promise<MemoryStatus> {
  const res = await fetch(`${BASE_URL}/api/memory/status`)
  if (!res.ok) throw new Error(`Memory status failed: ${res.status}`)
  return res.json()
}

export async function retainMemory(content: string, context?: string): Promise<RetainResult> {
  const res = await fetch(`${BASE_URL}/api/memory/retain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, context }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? `Retain failed: ${res.status}`)
  }
  return res.json()
}

export async function recallMemory(query: string): Promise<RecallResult> {
  const res = await fetch(`${BASE_URL}/api/memory/recall`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? `Recall failed: ${res.status}`)
  }
  return res.json()
}

export async function reflectMemory(query: string, context?: string): Promise<ReflectResult> {
  const res = await fetch(`${BASE_URL}/api/memory/reflect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, context }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail ?? `Reflect failed: ${res.status}`)
  }
  return res.json()
}
