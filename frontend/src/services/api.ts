/**
 * api.ts — thin service layer for REASONKEEP backend communication.
 *
 * All fetch calls are centralized here so the rest of the app
 * never hard-codes URLs or deals with raw fetch directly.
 *
 * Module 1: only the health check endpoint is implemented.
 * Additional endpoints will be added in later modules.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export interface HealthResponse {
  status: string
  service: string
  version: string
}

/**
 * Call GET /health on the backend.
 * Throws if the request fails or the server responds with a non-ok status.
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${BASE_URL}/health`)
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`)
  }
  return response.json() as Promise<HealthResponse>
}
