/**
 * useHealthCheck — polls the backend /health endpoint once on mount.
 * Returns the API status: 'checking' | 'ok' | 'error'
 */

import { useEffect, useState } from 'react'
import { checkHealth } from '../services/api'

export type ApiStatus = 'checking' | 'ok' | 'error'

export function useHealthCheck(): ApiStatus {
  const [status, setStatus] = useState<ApiStatus>('checking')

  useEffect(() => {
    let cancelled = false

    checkHealth()
      .then(() => {
        if (!cancelled) setStatus('ok')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return status
}
