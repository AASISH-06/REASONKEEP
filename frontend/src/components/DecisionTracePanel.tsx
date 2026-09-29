/**
 * DecisionTracePanel — Module 5: Decision Trace UI
 *
 * Core Value Proposition:
 * "Reconstruct the historical reasoning behind past institutional decisions."
 *
 * Provides a structured 10-stage historical trace with zero fabrication:
 * missing stages are explicitly marked 'DOCUMENTATION UNAVAILABLE'.
 *
 * Module 7 Polish:
 * - Professional institutional aesthetic
 * - Concise institutional loading state ("Reconstructing decision history...")
 * - Differentiated empty states: idle vs. no trace records found
 * - Standardized error handling with retry capability
 * - Standardized EvidenceCard components for stage and global citations
 * - Standardized status badges (RECORD VERIFIED, PARTIAL EVIDENCE, DOCUMENTATION UNAVAILABLE)
 */

import { useState } from 'react'
import {
  traceDecision,
  type DecisionTraceResponse,
  type DecisionTraceStage,
  type StageStatus,
  type StageType,
  type TraceEvidenceItem,
} from '../services/traceApi'
import { EmptyState } from './EmptyState'
import { ErrorBanner } from './ErrorBanner'
import { EvidenceCard } from './EvidenceCard'
import { LoadingState } from './LoadingState'
import { StatusBadge } from './StatusBadge'

const QUICK_QUERIES = [
  {
    label: 'LiDAR Decision',
    query: 'Why did Project Hermes select LiDAR for obstacle detection?',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'Motor Communication Decision',
    query: 'Trace the motor controller communication failure and migration to CAN bus',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'Fleet Telemetry Decision',
    query: 'Trace the fleet telemetry database selection',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'Onboard Compute Decision',
    query: 'Trace the onboard compute platform selection between Jetson AGX Orin and x86',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'Localization Decision',
    query: 'Trace the outdoor localization and RTK-GNSS selection',
    project: 'Campus Autonomous Delivery Rover',
  },
  {
    label: 'Unknown Query (Negative Test)',
    query: 'What was the university policy on medieval poetry recitation in 1845?',
    project: '',
  },
]

const STAGE_ORDER: StageType[] = [
  'context',
  'problem',
  'constraints',
  'alternatives',
  'rejected_alternatives',
  'decision',
  'rationale',
  'failure',
  'outcome',
  'lesson',
]

function getStageIndex(stage: StageType): string {
  const idx = STAGE_ORDER.indexOf(stage)
  return String(idx + 1).padStart(2, '0')
}

function mapStageStatusToBadge(status: StageStatus): 'RECORD VERIFIED' | 'PARTIAL EVIDENCE' | 'DOCUMENTATION UNAVAILABLE' {
  switch (status) {
    case 'found':
      return 'RECORD VERIFIED'
    case 'partial':
      return 'PARTIAL EVIDENCE'
    case 'unavailable':
    default:
      return 'DOCUMENTATION UNAVAILABLE'
  }
}

export function DecisionTracePanel() {
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('Campus Autonomous Delivery Rover')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<DecisionTraceResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({})

  async function handleTrace(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)
    setResponse(null)
    setExpandedEvidence({})

    try {
      const res = await traceDecision({
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

  function handleSelectQuickQuery(q: (typeof QUICK_QUERIES)[0]) {
    if (loading) return
    setQuery(q.query)
    setProject(q.project)
    setError(null)
  }

  function toggleEvidence(stageKey: string) {
    setExpandedEvidence((prev) => ({
      ...prev,
      [stageKey]: !prev[stageKey],
    }))
  }

  return (
    <section
      id="decision-trace-panel"
      aria-labelledby="trace-panel-title"
      className="card mb-8 p-6 transition-all"
      style={{
        border: '1px solid rgba(168,85,247,0.25)',
        background: 'linear-gradient(180deg, rgba(168,85,247,0.02) 0%, transparent 100%)',
      }}
    >
      {/* ── Section Header ─────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="section-label" style={{ color: '#c084fc' }}>
              02 // Historical Decision Trace
            </span>
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold"
            style={{
              background: 'rgba(168,85,247,0.12)',
              color: '#c084fc',
              border: '1px solid rgba(168,85,247,0.3)',
            }}
          >
            MODULE 5 RECONSTRUCTION LAYER
          </span>
        </div>

        <h2
          id="trace-panel-title"
          className="text-base font-bold mt-1.5"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Historical Decision Trace
        </h2>

        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          &ldquo;Reconstruct the historical reasoning behind past decisions &mdash; how did this decision come to exist?&rdquo;
        </p>
      </div>

      {/* ── Quick Inquiries ───────────────────────────────── */}
      <div className="mb-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-2 font-mono"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Quick Historical Traces
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUERIES.map((q) => (
            <button
              id={`quick-trace-${q.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              key={q.label}
              type="button"
              disabled={loading}
              onClick={() => handleSelectQuickQuery(q)}
              className="text-xs px-2.5 py-1 rounded-md transition-all font-medium text-left cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500/40"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span style={{ color: '#c084fc' }}>📜</span>
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Query Form ────────────────────────────────────── */}
      <form onSubmit={handleTrace} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3">
            <label
              htmlFor="trace-query-input"
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Engineering Decision to Trace <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              id="trace-query-input"
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
              htmlFor="trace-project-input"
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Project Scope (Optional)
            </label>
            <input
              id="trace-project-input"
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
            Zero-fabrication reconstruction &bull; Sole memory store: <code className="font-mono text-[#c084fc]">reasonkeep-university-demo</code>
          </span>
          <button
            id="trace-submit-btn"
            type="submit"
            disabled={loading || !query.trim()}
            className="px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              background: loading
                ? 'var(--color-surface-2)'
                : 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
              color: '#ffffff',
              boxShadow: loading ? 'none' : '0 2px 8px rgba(147,51,234,0.3)',
            }}
          >
            {loading ? (
              <>
                <span className="animate-spin text-xs">⏳</span>
                <span>Reconstructing decision history...</span>
              </>
            ) : (
              <>
                <span>🔬</span>
                <span>Trace Decision Lineage</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── Loading State ─────────────────────────────────── */}
      {loading && (
        <LoadingState
          title="Reconstructing decision history..."
          subtitle="Synthesizing 10-stage historical engineering progression from Hindsight Cloud..."
          theme="purple"
        />
      )}

      {/* ── Error Banner with Retry ───────────────────────── */}
      {error && !loading && (
        <ErrorBanner
          error={error}
          onRetry={() => handleTrace()}
          contextTitle="Decision Trace Failed"
        />
      )}

      {/* ── Empty State A: Idle (No Trace Run Yet) ─────────── */}
      {!response && !loading && !error && (
        <EmptyState
          variant="idle"
          icon="📜"
          title="Awaiting Decision Trace Request"
          description="Select a quick historical trace above or enter an engineering decision to reconstruct its 10-stage historical lineage across problem, constraints, alternatives, failures, and lessons."
          theme="purple"
        />
      )}

      {/* ── Empty State B: Negative / Not Found State ──────── */}
      {response && !response.found && !loading && (
        <EmptyState
          variant="no_memory"
          icon="🔒"
          badgeText="NO DOCUMENTED DECISION TRACE FOUND"
          title="No Historical Decision Trail Located"
          description={response.message || 'No documented decision trace was found in the memory records for this query. The zero-fabrication protocol prevents generating speculative traces.'}
          theme="amber"
        />
      )}

      {/* ── Found Decision Trace Timeline ─────────────────── */}
      {response && response.found && !loading && (
        <div id="trace-timeline-container" className="mt-6 space-y-4">
          {/* Header Summary Card */}
          <div
            className="rounded-lg p-4 flex flex-wrap items-center justify-between gap-3"
            style={{
              background: 'rgba(168,85,247,0.05)',
              border: '1px solid rgba(168,85,247,0.25)',
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Institutional Trace: {response.project || 'Engineering Decision'}
                </h3>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Target inquiry: <span className="font-mono text-xs text-purple-300">&ldquo;{response.query}&rdquo;</span>
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-mono">
              <span className="px-2.5 py-1 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' }}>
                Memories Cited: <strong className="text-purple-400 font-bold">{response.memories_used}</strong>
              </span>
              <span className="px-2.5 py-1 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' }}>
                Stages Verified: <strong className="text-green-400 font-bold">{response.trace.filter((s) => s.status === 'found').length}</strong> / {response.trace.length}
              </span>
            </div>
          </div>

          {/* 10-Stage Decision Timeline */}
          <div className="space-y-3 relative pl-4 border-l-2" style={{ borderColor: 'rgba(168,85,247,0.25)' }}>
            {response.trace.map((st: DecisionTraceStage, idx: number) => {
              const stageBadge = mapStageStatusToBadge(st.status)
              const stageKey = `stage-${st.stage}`
              const isExpanded = !!expandedEvidence[stageKey]
              const hasEvidence = st.evidence && st.evidence.length > 0

              return (
                <div
                  key={st.stage}
                  id={`trace-stage-${st.stage}`}
                  className="rounded-lg p-4 transition-all"
                  style={{
                    background: st.status === 'found'
                      ? 'var(--color-surface-2)'
                      : st.status === 'partial'
                      ? 'rgba(245,158,11,0.03)'
                      : 'rgba(148,163,184,0.02)',
                    border: `1px solid ${
                      st.status === 'found'
                        ? 'rgba(168,85,247,0.25)'
                        : st.status === 'partial'
                        ? 'rgba(245,158,11,0.2)'
                        : 'var(--color-border-dim)'
                    }`,
                    opacity: st.status === 'unavailable' ? 0.8 : 1,
                  }}
                >
                  {/* Top Bar of Stage */}
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(168,85,247,0.15)',
                          color: '#c084fc',
                        }}
                      >
                        {getStageIndex(st.stage)}
                      </span>
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
                        {st.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {st.source && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: 'var(--color-surface-1)', color: 'var(--color-text-tertiary)' }}>
                          📅 {st.source}
                        </span>
                      )}
                      <StatusBadge variant={stageBadge} />
                    </div>
                  </div>

                  {/* Stage Content */}
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: st.status === 'unavailable'
                        ? 'var(--color-text-tertiary)'
                        : 'var(--color-text-secondary)',
                      fontStyle: st.status === 'unavailable' ? 'italic' : 'normal',
                    }}
                  >
                    {st.description}
                  </p>

                  {/* Supporting Evidence for this stage */}
                  {hasEvidence && (
                    <div className="mt-3 pt-2.5 border-t" style={{ borderColor: 'var(--color-border-dim)' }}>
                      <button
                        type="button"
                        onClick={() => toggleEvidence(stageKey)}
                        className="text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors hover:text-purple-300"
                        style={{ color: '#c084fc' }}
                      >
                        <span>{isExpanded ? '▾ Hide Stage Evidence' : '▸ View Stage Evidence'}</span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                          ({st.evidence.length} {st.evidence.length === 1 ? 'record' : 'records'})
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 space-y-2">
                          {st.evidence.map((evTxt: string, eIdx: number) => (
                            <EvidenceCard
                              key={eIdx}
                              citationId={`${getStageIndex(st.stage)}.${eIdx + 1}`}
                              text={evTxt}
                              context={`${st.title} Stage`}
                              type="Stage Evidence"
                              theme="purple"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Downward indicator between stages */}
                  {idx < response.trace.length - 1 && (
                    <div className="text-center my-1 text-xs select-none" style={{ color: 'rgba(168,85,247,0.35)' }}>
                      ↓
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Global Supporting Evidence (if present) */}
          {response.evidence && response.evidence.length > 0 && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border-dim)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                  All Cited Historical Evidence Records ({response.evidence.length})
                </span>
                <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                  Hindsight Cloud Evidence Bank
                </span>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {response.evidence.map((ev: TraceEvidenceItem, evIdx: number) => (
                  <EvidenceCard
                    key={ev.id ?? evIdx}
                    citationId={evIdx + 1}
                    text={ev.text}
                    context={ev.context || response.project}
                    documentId={ev.document_id}
                    type={ev.type || 'Trace Record'}
                    theme="purple"
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
