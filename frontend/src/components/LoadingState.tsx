/**
 * LoadingState — Institutional loading indicator and skeleton view.
 *
 * Keeps layout stable during asynchronous retrieval from Hindsight Cloud.
 * Uses concise, technical institutional phrasing:
 * - "Retrieving institutional memory..."
 * - "Reconstructing decision history..."
 * - "Checking historical conflicts..."
 */

interface LoadingStateProps {
  /** Primary institutional action status */
  title: string
  /** Secondary detail or memory bank reference */
  subtitle?: string
  /** Visual accent theme */
  theme?: 'blue' | 'purple' | 'red' | 'default'
  /** Optional container minimum height to prevent layout shift */
  minHeight?: string
}

export function LoadingState({
  title,
  subtitle = 'Querying Hindsight Cloud memory bank: reasonkeep-university-demo',
  theme = 'default',
  minHeight = '140px',
}: LoadingStateProps) {
  const themeColors = {
    blue: {
      accent: '#3b82f6',
      border: 'rgba(59,130,246,0.3)',
      bg: 'rgba(59,130,246,0.03)',
      bar: 'rgba(59,130,246,0.2)',
    },
    purple: {
      accent: '#a855f7',
      border: 'rgba(168,85,247,0.3)',
      bg: 'rgba(168,85,247,0.03)',
      bar: 'rgba(168,85,247,0.2)',
    },
    red: {
      accent: '#ef4444',
      border: 'rgba(239,68,68,0.3)',
      bg: 'rgba(239,68,68,0.03)',
      bar: 'rgba(239,68,68,0.2)',
    },
    default: {
      accent: '#6366f1',
      border: 'var(--color-border)',
      bg: 'var(--color-surface-2)',
      bar: 'var(--color-border)',
    },
  }[theme]

  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-6 rounded-lg p-5 flex flex-col justify-center transition-all animate-pulse"
      style={{
        minHeight,
        background: themeColors.bg,
        border: `1px solid ${themeColors.border}`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex items-center justify-center w-5 h-5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: themeColors.accent }}
          />
          <span
            className="relative inline-flex rounded-full h-3 w-3"
            style={{ backgroundColor: themeColors.accent }}
          />
        </div>
        <div>
          <h4
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {title}
          </h4>
          <p
            className="text-[11px] font-mono mt-0.5"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Skeleton Rows for Visual Stability */}
      <div className="space-y-2 mt-2">
        <div
          className="h-2 rounded w-4/5"
          style={{ background: themeColors.bar }}
        />
        <div
          className="h-2 rounded w-3/5"
          style={{ background: themeColors.bar }}
        />
        <div
          className="h-2 rounded w-2/3"
          style={{ background: themeColors.bar }}
        />
      </div>
      <span className="sr-only">Loading institutional memory data...</span>
    </div>
  )
}
