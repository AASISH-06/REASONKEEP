/**
 * Shared TypeScript types for REASONKEEP.
 * Module 1: only structural / status types.
 * Domain types (Memory, Decision, Project) will be added in later modules.
 */

/** Generic API response envelope */
export interface ApiResponse<T> {
  data: T
  error?: string
}

/** Backend health check response shape */
export interface HealthStatus {
  status: string
  service: string
  version: string
}
