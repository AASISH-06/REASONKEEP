/**
 * TopBar — Persistent institutional header with system branding and live status.
 *
 * Module 7 Polish:
 * - Clear institutional engineering branding
 * - Live backend connection indicator with accessible label
 * - Module 7 status display
 */

interface TopBarProps {
  apiStatus: 'checking' | 'ok' | 'error'
}

export function TopBar({ apiStatus }: TopBarProps) {
  const statusLabel =
    apiStatus === 'ok'
      ? 'Hindsight Cloud Connected'
      : apiStatus === 'error'
      ? 'Backend Unreachable'
      : 'Checking Service…'

  const dotColor =
    apiStatus === 'ok'
      ? '#4ade80'
      : apiStatus === 'error'
      ? '#ef4444'
      : '#fbbf24'

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b backdrop-blur-md"
      style={{
        background: 'rgba(17, 19, 24, 0.92)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg text-white font-mono font-bold text-xs select-none shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          }}
          aria-hidden="true"
        >
          RK
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: 'var(--color-text-primary)' }}
            >
              REASONKEEP
            </span>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded tracking-wide font-semibold"
              style={{
                background: 'rgba(99,102,241,0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.3)',
              }}
            >
              MODULE 10 · SUBMISSION READY
            </span>
          </div>
          <p
            className="text-[11px] leading-tight font-mono"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Meridian Institute of Technology &bull; Computer Engineering Research Lab
          </p>
        </div>
      </div>

      {/* Backend & Memory Status Indicator */}
      <div
        id="api-status-indicator"
        className="flex items-center gap-2.5 text-xs font-mono px-3 py-1.5 rounded-full border transition-all"
        style={{
          background: 'var(--color-surface-2)',
          borderColor: apiStatus === 'ok' ? 'rgba(34,197,94,0.3)' : 'var(--color-border)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <span
          className={`inline-block w-2 h-2 rounded-full ${apiStatus === 'ok' ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
        <span
          className="font-medium text-[11px]"
          style={{ color: apiStatus === 'ok' ? '#4ade80' : apiStatus === 'error' ? '#f87171' : '#fbbf24' }}
        >
          {statusLabel}
        </span>
      </div>
    </header>
  )
}
