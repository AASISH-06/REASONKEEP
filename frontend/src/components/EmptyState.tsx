/**
 * EmptyState — Standardized empty state component.
 *
 * Strict Requirement:
 * Clearly distinguishes between:
 * A. User has not performed an action yet (variant: 'idle')
 * B. System performed the action but found no relevant memory (variant: 'no_memory')
 */

export interface EmptyStateProps {
  /** Mode: 'idle' = awaiting user action, 'no_memory' = query returned zero records */
  variant: 'idle' | 'no_memory'
  /** Header title */
  title: string
  /** Detailed description or explanation */
  description: string
  /** Optional icon or symbol (e.g. 🔍, 📜, ⚡, 🔒) */
  icon?: string
  /** Optional action or retry button */
  action?: {
    label: string
    onClick: () => void
  }
  /** Custom badge text for no_memory variant */
  badgeText?: string
  /** Theme styling */
  theme?: 'blue' | 'purple' | 'red' | 'amber' | 'neutral'
}

export function EmptyState({
  variant,
  title,
  description,
  icon,
  action,
  badgeText,
  theme = 'neutral',
}: EmptyStateProps) {
  const isIdle = variant === 'idle'

  const styles = {
    blue: {
      border: isIdle ? 'var(--color-border)' : 'rgba(59,130,246,0.3)',
      bg: isIdle ? 'var(--color-surface-2)' : 'rgba(59,130,246,0.03)',
      badgeBg: 'rgba(59,130,246,0.12)',
      badgeColor: '#60a5fa',
    },
    purple: {
      border: isIdle ? 'var(--color-border)' : 'rgba(168,85,247,0.3)',
      bg: isIdle ? 'var(--color-surface-2)' : 'rgba(168,85,247,0.03)',
      badgeBg: 'rgba(168,85,247,0.12)',
      badgeColor: '#c084fc',
    },
    red: {
      border: isIdle ? 'var(--color-border)' : 'rgba(239,68,68,0.3)',
      bg: isIdle ? 'var(--color-surface-2)' : 'rgba(239,68,68,0.03)',
      badgeBg: 'rgba(239,68,68,0.12)',
      badgeColor: '#f87171',
    },
    amber: {
      border: isIdle ? 'var(--color-border)' : 'rgba(245,158,11,0.3)',
      bg: isIdle ? 'var(--color-surface-2)' : 'rgba(245,158,11,0.04)',
      badgeBg: 'rgba(245,158,11,0.12)',
      badgeColor: '#fbbf24',
    },
    neutral: {
      border: isIdle ? 'var(--color-border-dim)' : 'var(--color-border)',
      bg: isIdle ? 'var(--color-surface-1)' : 'var(--color-surface-2)',
      badgeBg: 'var(--color-surface-2)',
      badgeColor: 'var(--color-text-secondary)',
    },
  }[theme]

  return (
    <div
      className={`rounded-lg p-5 mt-5 text-center transition-all ${
        isIdle ? 'border-dashed' : ''
      }`}
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
      }}
    >
      <div className="max-w-md mx-auto flex flex-col items-center">
        {icon && (
          <div className="text-xl mb-2 select-none opacity-80" aria-hidden="true">
            {icon}
          </div>
        )}

        {/* State Badge */}
        <div className="mb-2">
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              background: styles.badgeBg,
              color: styles.badgeColor,
            }}
          >
            {badgeText || (isIdle ? 'Awaiting Input' : 'Zero Records Found')}
          </span>
        </div>

        <h4
          className="text-xs font-bold uppercase tracking-wide mb-1.5"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h4>

        <p
          className="text-xs leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {description}
        </p>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-3.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all hover:brightness-110"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
