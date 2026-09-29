/**
 * StatusBadge — Standardized institutional status indicator across REASONKEEP.
 *
 * Supported Locked Institutional Statuses:
 * Assistant:
 *  - 'INSTITUTIONAL MEMORY FOUND' (green)
 *  - 'NO RELEVANT INSTITUTIONAL MEMORY' (amber)
 * Decision Trace:
 *  - 'RECORD VERIFIED' (green)
 *  - 'PARTIAL EVIDENCE' (amber)
 *  - 'DOCUMENTATION UNAVAILABLE' (slate)
 * Decision Drift:
 *  - 'DRIFT DETECTED' (red)
 *  - 'ALIGNED' (green)
 *  - 'INDETERMINATE' (amber)
 *  - 'NO RELEVANT MEMORY' (slate)
 * Generic:
 *  - 'ok' | 'pending' | 'inactive' | 'error'
 */

export type InstitutionalStatusType =
  | 'INSTITUTIONAL MEMORY FOUND'
  | 'NO RELEVANT INSTITUTIONAL MEMORY'
  | 'RECORD VERIFIED'
  | 'PARTIAL EVIDENCE'
  | 'DOCUMENTATION UNAVAILABLE'
  | 'DRIFT DETECTED'
  | 'ALIGNED'
  | 'INDETERMINATE'
  | 'NO RELEVANT MEMORY'
  | 'ok'
  | 'pending'
  | 'inactive'
  | 'error'

interface StatusBadgeProps {
  variant?: InstitutionalStatusType
  label?: string
  /** Optional dot indicator (shown when true, defaults to true) */
  dot?: boolean
  /** Optional custom id */
  id?: string
  /** Subtitle or secondary annotation (e.g. "HISTORICAL CONFLICT") */
  sublabel?: string
}

interface StatusConfig {
  label: string
  bg: string
  border: string
  color: string
  dot: string
}

export function getInstitutionalStatusConfig(type: InstitutionalStatusType): StatusConfig {
  switch (type) {
    case 'INSTITUTIONAL MEMORY FOUND':
    case 'ALIGNED':
      return {
        label: type,
        bg: 'rgba(34,197,94,0.12)',
        border: 'rgba(34,197,94,0.35)',
        color: '#4ade80',
        dot: '#22c55e',
      }
    case 'RECORD VERIFIED':
    case 'ok':
      return {
        label: type === 'ok' ? 'Active' : type,
        bg: 'rgba(34,197,94,0.12)',
        border: 'rgba(34,197,94,0.35)',
        color: '#4ade80',
        dot: '#22c55e',
      }
    case 'DRIFT DETECTED':
    case 'error':
      return {
        label: type === 'error' ? 'Error' : type,
        bg: 'rgba(239,68,68,0.12)',
        border: 'rgba(239,68,68,0.35)',
        color: '#f87171',
        dot: '#ef4444',
      }
    case 'PARTIAL EVIDENCE':
    case 'INDETERMINATE':
    case 'pending':
      return {
        label: type === 'pending' ? 'Pending' : type,
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.35)',
        color: '#fbbf24',
        dot: '#f59e0b',
      }
    case 'NO RELEVANT INSTITUTIONAL MEMORY':
      return {
        label: type,
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.35)',
        color: '#fbbf24',
        dot: '#f59e0b',
      }
    case 'DOCUMENTATION UNAVAILABLE':
    case 'NO RELEVANT MEMORY':
    case 'inactive':
    default:
      return {
        label: type === 'inactive' ? 'Not Started' : type,
        bg: 'rgba(148,163,184,0.08)',
        border: 'rgba(148,163,184,0.22)',
        color: '#94a3b8',
        dot: '#64748b',
      }
  }
}

export function StatusBadge({
  variant = 'ok',
  label,
  dot = true,
  id,
  sublabel,
}: StatusBadgeProps) {
  const config = getInstitutionalStatusConfig(variant)
  const displayText = label || config.label

  return (
    <span
      id={id}
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wider transition-all select-none"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
      }}
    >
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: config.dot }}
          aria-hidden="true"
        />
      )}
      <span>{displayText}</span>
      {sublabel && (
        <span className="opacity-75 text-[10px] font-normal">
          &bull; {sublabel}
        </span>
      )}
    </span>
  )
}
