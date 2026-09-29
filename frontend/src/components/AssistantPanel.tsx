/**
 * AssistantPanel — Module 4: Institutional Memory Assistant UI
 *
 * Core Value Proposition:
 * "Ask what previous teams learned before making the same decision again."
 *
 * Module 7 Polish:
 * - Professional institutional aesthetic
 * - Concise institutional loading state ("Retrieving institutional memory...")
 * - Differentiated empty states: idle vs. zero records found
 * - Standardized error handling with retry capability
 * - Standardized EvidenceCard components for memory citations
 * - Zero-fabrication compliance
 */

import { useState } from 'react'
import {
  askAssistant,
  type AssistantAskResponse,
  type MemoryEvidenceItem,
} from '../services/assistantApi'
import { EmptyState } from './EmptyState'
import { ErrorBanner } from './ErrorBanner'
import { EvidenceCard } from './EvidenceCard'
import { LoadingState } from './LoadingState'
import { StatusBadge } from './StatusBadge'

const SUGGESTED_QUERIES = [
  {
    label: 'Sensor Selection',
    query: 'Why did Project Hermes choose LiDAR for obstacle detection?',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'Rejected Alternative',
    query: 'Why was monocular RGB camera rejected for obstacle detection?',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'Hardware Failure',
    query: 'What happened with motor communication failure on the rover?',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'Database Trade-off',
    query: 'What database was selected for fleet telemetry and why?',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'No-Memory Negative Test',
    query: 'What was the university policy on medieval poetry recitation in 1845?',
    project: '',
  },
]

export function AssistantPanel() {
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('Campus Autonomous Delivery Rover')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<AssistantAskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAsk(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await askAssistant({
        query: trimmed,
        project: project.trim() ? project.trim() : undefined,
      })
      setResponse(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  function handleSelectSuggestion(s: (typeof SUGGESTED_QUERIES)[0]) {
    if (loading) return
    setQuery(s.query)
    setProject(s.project)
    setError(null)
  }

  return (
    <section
      id="assistant-panel"
      aria-labelledby="assistant-panel-title"
      className="card mb-8 p-6 transition-all"
      style={{
        border: '1px solid rgba(59,130,246,0.25)',
        background: 'linear-gradient(180deg, rgba(59,130,246,0.02) 0%, transparent 100%)',
      }}
    >
      {/* ── Section Header ─────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="section-label" style={{ color: '#60a5fa' }}>
              01 // Institutional Memory Assistant
            </span>
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold"
            style={{
              background: 'rgba(59,130,246,0.12)',
              color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.3)',
            }}
          >
            MODULE 4 PRODUCT LAYER
          </span>
        </div>

        <h2
          id="assistant-panel-title"
          className="text-base font-bold mt-1.5"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Institutional Memory Assistant
        </h2>

        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          &ldquo;Ask what previous teams learned before making the same decision again.&rdquo;
        </p>
      </div>

      {/* ── Suggested Quick Queries ───────────────────────── */}
      <div className="mb-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-2 font-mono"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Suggested Institutional Inquiries
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={loading}
              onClick={() => handleSelectSuggestion(s)}
              className="text-xs px-2.5 py-1 rounded-md transition-all font-medium text-left cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500/40"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span style={{ color: '#60a5fa' }}>💡</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Query Form ────────────────────────────────────── */}
      <form onSubmit={handleAsk} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3">
            <label
              htmlFor="assistant-query"
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Institutional Question <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              id="assistant-query"
              type="text"
              required
              disabled={loading}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Why did Project Hermes select LiDAR for obstacle detection?"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none transition-all disabled:opacity-60"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="assistant-project"
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Project Scope (Optional)
            </label>
            <input
              id="assistant-project"
              type="text"
              disabled={loading}
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. Campus Autonomous Delivery Rover"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none transition-all disabled:opacity-60"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
            Grounded reasoning &bull; Hindsight Cloud bank: <code className="font-mono text-[#60a5fa]">reasonkeep-university-demo</code>
          </span>
          <button
            id="assistant-submit-btn"
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              background: loading
                ? 'var(--color-surface-2)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              boxShadow: loading ? 'none' : '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            {loading ? (
              <>
                <span className="animate-spin text-xs">⏳</span>
                <span>Retrieving institutional memory...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Ask Institutional Memory</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── Loading State ─────────────────────────────────── */}
      {loading && (
        <LoadingState
          title="Retrieving institutional memory..."
          subtitle="Scanning historical decisions, rejected alternatives, and post-mortems in Hindsight Cloud..."
          theme="blue"
        />
      )}

      {/* ── Error Banner with Retry ───────────────────────── */}
      {error && !loading && (
        <ErrorBanner
          error={error}
          onRetry={() => handleAsk()}
          contextTitle="Assistant Query Failed"
        />
      )}

      {/* ── Empty State A: Idle (No Query Run Yet) ──────────── */}
      {!response && !loading && !error && (
        <EmptyState
          variant="idle"
          icon="💬"
          title="Awaiting Institutional Inquiry"
          description="Select a suggested inquiry above or enter a question regarding historical sensor choices, motor bus migrations, or architecture tradeoffs."
          theme="blue"
        />
      )}

      {/* ── Empty State B: No Relevant Memory Found (found=false) ─ */}
      {response && !response.found && !loading && (
        <EmptyState
          variant="no_memory"
          icon="🔒"
          badgeText="NO RELEVANT INSTITUTIONAL MEMORY"
          title="No Documented Records in Memory Bank"
          description={response.answer || 'No relevant institutional records were identified for this inquiry in the memory bank. REASONKEEP strictly enforces a zero-fabrication contract and will not synthesize speculative answers.'}
          theme="amber"
        />
      )}

      {/* ── Found Response Card ───────────────────────────── */}
      {response && response.found && !loading && (
        <div
          id="assistant-result-card"
          className="mt-6 rounded-lg p-5 transition-all"
          style={{
            background: 'rgba(34,197,94,0.03)',
            border: '1px solid rgba(34,197,94,0.25)',
          }}
        >
          {/* Status Header */}
          <div
            className="flex items-center justify-between pb-3 mb-4 border-b flex-wrap gap-2"
            style={{ borderColor: 'var(--color-border-dim)' }}
          >
            <StatusBadge
              variant="INSTITUTIONAL MEMORY FOUND"
              id="assistant-status-badge"
            />
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
              Memories Cited: <strong className="text-green-400 font-bold">{response.memories_used}</strong>
            </span>
          </div>

          {/* Institutional Answer Text */}
          <div
            id="assistant-answer-text"
            className="text-xs leading-relaxed whitespace-pre-wrap font-sans mb-5"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {response.answer}
          </div>

          {/* Supporting Evidence Cards (Standardized) */}
          {response.evidence.length > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border-dim)' }}>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[11px] font-mono font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  Supporting Grounded Evidence ({response.evidence.length})
                </span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                  Hindsight Cloud Citations
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {response.evidence.map((ev: MemoryEvidenceItem, idx: number) => (
                  <EvidenceCard
                    key={ev.id ?? idx}
                    citationId={idx + 1}
                    text={ev.text}
                    context={ev.context || response.context?.project}
                    documentId={ev.document_id}
                    type={ev.type || 'Institutional Fact'}
                    theme="blue"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
