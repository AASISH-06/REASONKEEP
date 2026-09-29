/**
 * EvidenceCard — Standardized evidence presentation across REASONKEEP.
 *
 * Used in:
 * - Institutional Memory Assistant (Module 4)
 * - Decision Trace (Module 5)
 * - Decision Drift Detection (Module 6)
 *
 * Core Principle: "Memory must be the product, not a hidden feature."
 * Zero Fabrication: If source/context is missing, display only what exists.
 */

export interface EvidenceCardProps {
  /** 1-based index or citation identifier like "CIT-01" */
  citationId?: string | number
  /** The grounded factual quote or excerpt */
  text: string
  /** Project, document context, or topic name if available */
  context?: string | null
  /** Document or record ID if available */
  documentId?: string | null
  /** Memory or fact classification type if available */
  type?: string | null
  /** Historical record date or source if available */
  source?: string | null
  /** Visual accent theme: blue (Assistant), purple (Trace), red (Drift), green, amber, or neutral */
  theme?: 'blue' | 'purple' | 'red' | 'green' | 'amber' | 'neutral'
}

export function EvidenceCard({
  citationId,
  text,
  context,
  documentId,
  type,
  source,
  theme = 'neutral',
}: EvidenceCardProps) {
  const themeStyles = {
    blue: {
      border: 'rgba(59,130,246,0.22)',
      bg: 'rgba(59,130,246,0.03)',
      badgeBg: 'rgba(59,130,246,0.12)',
      badgeColor: '#60a5fa',
      quoteColor: '#93c5fd',
    },
    purple: {
      border: 'rgba(168,85,247,0.22)',
      bg: 'rgba(168,85,247,0.03)',
      badgeBg: 'rgba(168,85,247,0.12)',
      badgeColor: '#c084fc',
      quoteColor: '#d8b4fe',
    },
    red: {
      border: 'rgba(239,68,68,0.22)',
      bg: 'rgba(239,68,68,0.03)',
      badgeBg: 'rgba(239,68,68,0.12)',
      badgeColor: '#f87171',
      quoteColor: '#fca5a5',
    },
    green: {
      border: 'rgba(34,197,94,0.22)',
      bg: 'rgba(34,197,94,0.03)',
      badgeBg: 'rgba(34,197,94,0.12)',
      badgeColor: '#4ade80',
      quoteColor: '#86efac',
    },
    amber: {
      border: 'rgba(245,158,11,0.22)',
      bg: 'rgba(245,158,11,0.03)',
      badgeBg: 'rgba(245,158,11,0.12)',
      badgeColor: '#fbbf24',
      quoteColor: '#fde68a',
    },
    neutral: {
      border: 'var(--color-border)',
      bg: 'var(--color-surface-2)',
      badgeBg: 'var(--color-surface-1)',
      badgeColor: 'var(--color-text-secondary)',
      quoteColor: 'var(--color-text-tertiary)',
    },
  }[theme]

  const formattedId =
    typeof citationId === 'number'
      ? `CIT-${String(citationId).padStart(2, '0')}`
      : citationId

  return (
    <div
      className="evidence-card rounded-lg p-3 text-xs transition-colors"
      style={{
        background: themeStyles.bg,
        border: `1px solid ${themeStyles.border}`,
      }}
    >
      {/* Evidence Card Metadata Header */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          {formattedId && (
            <span
              className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide"
              style={{
                background: themeStyles.badgeBg,
                color: themeStyles.badgeColor,
              }}
            >
              {formattedId}
            </span>
          )}
          {context && (
            <span
              className="text-[11px] font-medium truncate max-w-xs"
              style={{ color: 'var(--color-text-primary)' }}
              title={context}
            >
              📂 {context}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {type && (
            <span
              className="px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{
                background: 'var(--color-surface-1)',
                color: 'var(--color-text-tertiary)',
                border: '1px solid var(--color-border-dim)',
              }}
            >
              {type}
            </span>
          )}
          {source && (
            <span
              className="px-1.5 py-0.5 rounded"
              style={{
                background: 'var(--color-surface-1)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              📅 {source}
            </span>
          )}
          {documentId && (
            <span
              className="px-1.5 py-0.5 rounded truncate max-w-35"
              style={{
                background: 'var(--color-surface-1)',
                color: 'var(--color-text-tertiary)',
              }}
              title={documentId}
            >
              #{documentId}
            </span>
          )}
        </div>
      </div>

      {/* Grounded Excerpt */}
      <div
        className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap pl-2.5 border-l-2"
        style={{
          borderColor: themeStyles.badgeColor,
          color: 'var(--color-text-secondary)',
        }}
      >
        <span style={{ color: themeStyles.quoteColor }} className="font-serif text-sm mr-1">
          &ldquo;
        </span>
        {text}
        <span style={{ color: themeStyles.quoteColor }} className="font-serif text-sm ml-1">
          &rdquo;
        </span>
      </div>
    </div>
  )
}
