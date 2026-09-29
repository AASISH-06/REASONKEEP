/**
 * ErrorBanner — Sanitized institutional error reporting with retry capability.
 *
 * Protects system details:
 * - Hides internal stack traces, API keys, and local file paths
 * - Translates raw network exceptions into understandable diagnostic messages
 * - Provides immediate retry callback for user/judge convenience
 */

interface ErrorBannerProps {
  /** Raw or caught error string / Error object */
  error: string | Error | null
  /** Optional callback to retry the failed operation */
  onRetry?: () => void
  /** Context name, e.g. "Assistant Query", "Decision Trace", "Decision Drift" */
  contextTitle?: string
}

function sanitizeErrorMessage(raw: string | Error | null): string {
  if (!raw) return 'An unexpected error occurred while communicating with the server.'

  const message = typeof raw === 'string' ? raw : raw.message || String(raw)

  // Network / server connection failure
  if (
    message.includes('Failed to fetch') ||
    message.includes('NetworkError') ||
    message.includes('ECONNREFUSED') ||
    message.includes('net::ERR_CONNECTION_REFUSED')
  ) {
    return 'REASONKEEP could not reach the backend service (http://127.0.0.1:8000). Please ensure the FastAPI server is running.'
  }

  // Timeout
  if (message.includes('timeout') || message.includes('Timeout') || message.includes('504')) {
    return 'The institutional memory query timed out while awaiting Hindsight Cloud. Please try again.'
  }

  // Hindsight service unavailable
  if (message.includes('Hindsight') && (message.includes('500') || message.includes('503'))) {
    return 'The institutional memory service is temporarily unavailable or returned a server error. Please retry.'
  }

  // HTTP status codes
  if (message.includes('404')) {
    return 'The requested institutional memory endpoint was not found on the server (HTTP 404).'
  }

  if (message.includes('500')) {
    return 'The backend encountered an internal error while processing institutional memory. Please retry.'
  }

  // Sanitize any potential secret leakage or file paths
  let cleaned = message
    .replace(/[A-Za-z0-9_-]{20,}/g, (match) => (match.length > 25 ? '[REDACTED_TOKEN]' : match))
    .replace(/[A-Z]:\\[^\s]+/gi, '[INTERNAL_PATH]')
    .replace(/\/home\/[^\s]+/gi, '[INTERNAL_PATH]')

  // Catch generic JS errors and rephrase
  if (cleaned.includes('TypeError') || cleaned.includes('Cannot read properties')) {
    return 'Received an unexpected response format from the institutional memory service.'
  }

  return cleaned
}

export function ErrorBanner({ error, onRetry, contextTitle = 'Operation Failed' }: ErrorBannerProps) {
  if (!error) return null

  const userFacingMessage = sanitizeErrorMessage(error)

  return (
    <div
      role="alert"
      className="mt-4 p-4 rounded-lg text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      style={{
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.3)',
      }}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-sm select-none" aria-hidden="true" style={{ color: '#ef4444' }}>
          ⚠️
        </span>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold uppercase font-mono tracking-wider text-[10px]" style={{ color: '#f87171' }}>
              {contextTitle}
            </span>
          </div>
          <p className="leading-relaxed font-sans" style={{ color: '#fca5a5' }}>
            {userFacingMessage}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 hover:brightness-125 self-start sm:self-center"
          style={{
            background: 'rgba(239,68,68,0.18)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#fecaca',
          }}
        >
          <span>🔄</span>
          <span>Retry Request</span>
        </button>
      )}
    </div>
  )
}
