/**
 * DecisionDriftPanel — Module 6: Decision Drift Detection UI
 *
 * Core Value Proposition:
 * "Does this new proposal conflict with what previous university teams learned?"
 *
 * Compares current proposals against documented historical institutional memory:
 * - drift_detected: Documented historical conflict
 * - aligned: Documented alignment / reinforcement
 * - indeterminate: Insufficient evidence to establish conflict or alignment
 * - no_memory: No relevant institutional memory records exist
 *
 * Module 7 Polish:
 * - Professional institutional aesthetic
 * - Concise institutional loading state ("Checking historical conflicts...")
 * - Differentiated empty states: idle vs. zero records found
 * - Standardized error handling with retry capability
 * - Standardized EvidenceCard components for memory citations
 * - Standardized status badges (DRIFT DETECTED, ALIGNED, INDETERMINATE, NO RELEVANT MEMORY)
 */

import { useState } from 'react'
import {
  analyzeDecisionDrift,
  type DriftAnalysisResponse,
  type DriftEvidenceItem,
  type DriftStatus,
} from '../services/driftApi'
import { EmptyState } from './EmptyState'
import { ErrorBanner } from './ErrorBanner'
import { EvidenceCard } from './EvidenceCard'
import { LoadingState } from './LoadingState'
import { StatusBadge } from './StatusBadge'

const DEMO_PROPOSALS = [
  {
    category: 'DRIFT DETECTED',
    label: 'LiDAR → Single RGB Camera',
    proposal:
      "Replace the rover's LiDAR and stereo vision system with a single RGB camera to reduce cost.",
    project: 'Campus Autonomous Delivery Rover',
    badgeColor: '#f87171',
  },
  {
    category: 'DRIFT DETECTED',
    label: 'USB Serial vs CAN Bus',
    proposal: 'Use USB serial instead of CAN for motor controller communication.',
    project: 'Campus Autonomous Delivery Rover',
    badgeColor: '#f87171',
  },
  {
    category: 'ALIGNED',
    label: 'Redundant Perception Sensing',
    proposal: 'Keep redundant perception sensing for campus obstacle detection.',
    project: 'Campus Autonomous Delivery Rover',
    badgeColor: '#4ade80',
  },
  {
    category: 'INDETERMINATE',
    label: 'Chassis Paint Color',
    proposal:
      'Paint the rover chassis international orange to increase pedestrian visibility on walkways.',
    project: 'Campus Autonomous Delivery Rover',
    badgeColor: '#fbbf24',
  },
  {
    category: 'NO MEMORY',
    label: 'Medieval Poetry (1845)',
    proposal: 'Adopt a university policy for medieval poetry recitation in 1845.',
    project: '',
    badgeColor: '#94a3b8',
  },
]

function mapDriftStatusToBadge(status: DriftStatus): {
  variant: 'DRIFT DETECTED' | 'ALIGNED' | 'INDETERMINATE' | 'NO RELEVANT MEMORY'
  sublabel: string
} {
  switch (status) {
    case 'drift_detected':
      return { variant: 'DRIFT DETECTED', sublabel: 'HISTORICAL CONFLICT' }
    case 'aligned':
      return { variant: 'ALIGNED', sublabel: 'INSTITUTIONAL COHERENCE' }
    case 'indeterminate':
      return { variant: 'INDETERMINATE', sublabel: 'INSUFFICIENT EVIDENCE' }
    case 'no_memory':
    default:
      return { variant: 'NO RELEVANT MEMORY', sublabel: 'UNGROUNDED' }
  }
}

export function DecisionDriftPanel() {
  const [proposal, setProposal] = useState('')
  const [project, setProject] = useState('Campus Autonomous Delivery Rover')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<DriftAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEvidence, setShowEvidence] = useState(false)

  async function handleAnalyze(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const trimmed = proposal.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)
    setResponse(null)
    setShowEvidence(false)

    try {
      const res = await analyzeDecisionDrift({
        proposal: trimmed,
        project: project.trim() ? project.trim() : undefined,
      })
      setResponse(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  function handleSelectDemo(d: (typeof DEMO_PROPOSALS)[0]) {
    if (loading) return
    setProposal(d.proposal)
    setProject(d.project)
    setError(null)
  }

  const badgeInfo = response ? mapDriftStatusToBadge(response.status) : null

  return (
    <section
      id="decision-drift-panel"
      aria-labelledby="drift-panel-title"
      className="card mb-8 p-6 transition-all"
      style={{
        border: '1px solid rgba(239,68,68,0.25)',
        background: 'linear-gradient(180deg, rgba(239,68,68,0.02) 0%, transparent 100%)',
      }}
    >
      {/* ── Section Header ─────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="section-label" style={{ color: '#f87171' }}>
              03 // Decision Drift Detection
            </span>
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold"
            style={{
              background: 'rgba(239,68,68,0.12)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            MODULE 6 CONFLICT DETECTION
          </span>
        </div>

        <h2
          id="drift-panel-title"
          className="text-base font-bold mt-1.5"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Decision Drift Detection
        </h2>

        <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          &ldquo;Does this new proposal conflict with what previous university teams learned?&rdquo;
        </p>
      </div>

      {/* ── Demo Sample Proposals ─────────────────────────── */}
      <div className="mb-4">
        <p
          className="text-[11px] font-semibold uppercase tracking-wider mb-2 font-mono"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Sample Proposals (Synthetic Demo Data)
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_PROPOSALS.map((d) => (
            <button
              id={`drift-sample-${d.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              key={d.label}
              type="button"
              disabled={loading}
              onClick={() => handleSelectDemo(d)}
              className="text-xs px-2.5 py-1 rounded-md transition-all font-medium text-left cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-500/40"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.badgeColor }} />
              <span>{d.label}</span>
              <span className="text-[10px] font-mono opacity-60">[{d.category}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Proposal Form ─────────────────────────────────── */}
      <form onSubmit={handleAnalyze} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3">
            <label
              htmlFor="drift-proposal-input"
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Proposed Design or Technical Change <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              id="drift-proposal-input"
              type="text"
              required
              disabled={loading}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="e.g. Replace the rover's LiDAR with a single RGB camera to reduce cost."
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
              htmlFor="drift-project-input"
              className="block text-xs font-medium mb-1"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Project Context (Optional)
            </label>
            <input
              id="drift-project-input"
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
            Evaluated against Hindsight Cloud memory bank &bull; <code className="font-mono text-[#f87171]">reasonkeep-university-demo</code>
          </span>
          <button
            id="drift-submit-btn"
            type="submit"
            disabled={loading || !proposal.trim()}
            className="px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              background: loading
                ? 'var(--color-surface-2)'
                : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: '#ffffff',
              boxShadow: loading ? 'none' : '0 2px 8px rgba(220,38,38,0.3)',
            }}
          >
            {loading ? (
              <>
                <span className="animate-spin text-xs">⏳</span>
                <span>Checking historical conflicts...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Check Decision Drift</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── Loading State ─────────────────────────────────── */}
      {loading && (
        <LoadingState
          title="Checking historical conflicts..."
          subtitle="Scanning historical decisions, rejected alternatives, and post-mortems in Hindsight Cloud..."
          theme="red"
        />
      )}

      {/* ── Error Banner with Retry ───────────────────────── */}
      {error && !loading && (
        <ErrorBanner
          error={error}
          onRetry={() => handleAnalyze()}
          contextTitle="Decision Drift Check Failed"
        />
      )}

      {/* ── Empty State A: Idle (No Drift Check Run Yet) ───── */}
      {!response && !loading && !error && (
        <EmptyState
          variant="idle"
          icon="⚡"
          title="Awaiting Proposal Evaluation"
          description="Select a sample proposal above or enter a planned engineering change to evaluate historical coherence against past decisions, failure post-mortems, and constraints."
          theme="red"
        />
      )}

      {/* ── Empty State B: No Relevant Memory Found (status === 'no_memory') ─ */}
      {response && response.status === 'no_memory' && !loading && (
        <EmptyState
          variant="no_memory"
          icon="🔒"
          badgeText="NO RELEVANT INSTITUTIONAL MEMORY"
          title="No Historical Records for Proposal"
          description={response.explanation || 'No documented historical decisions, rejected alternatives, or engineering lessons exist for this proposal in the memory bank. Zero-fabrication ensures no speculative conflicts or alignments are generated.'}
          theme="neutral"
        />
      )}

      {/* ── Result Card (drift_detected / aligned / indeterminate) ─ */}
      {response && response.status !== 'no_memory' && badgeInfo && !loading && (
        <div
          id="drift-result-card"
          className="mt-6 rounded-lg p-5 transition-all"
          style={{
            background:
              response.status === 'drift_detected'
                ? 'rgba(239,68,68,0.03)'
                : response.status === 'aligned'
                ? 'rgba(34,197,94,0.03)'
                : 'rgba(245,158,11,0.03)',
            border: `1px solid ${
              response.status === 'drift_detected'
                ? 'rgba(239,68,68,0.3)'
                : response.status === 'aligned'
                ? 'rgba(34,197,94,0.3)'
                : 'rgba(245,158,11,0.3)'
            }`,
          }}
        >
          {/* Status Header */}
          <div
            className="flex items-center justify-between pb-3 mb-4 border-b flex-wrap gap-2"
            style={{ borderColor: 'var(--color-border-dim)' }}
          >
            <StatusBadge
              variant={badgeInfo.variant}
              sublabel={badgeInfo.sublabel}
              id="drift-status-badge"
            />
            <div className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
              Memories Cited: <strong className="font-bold text-white">{response.memories_used}</strong>
            </div>
          </div>

          {/* Proposal Echo */}
          <div className="mb-4">
            <span
              className="text-[11px] font-mono uppercase tracking-wider block mb-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Proposed Technical Change:
            </span>
            <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>
              &ldquo;{response.proposal}&rdquo;
            </p>
          </div>

          {/* Core Explanation */}
          <div
            id="drift-explanation-text"
            className="rounded p-3 text-xs leading-relaxed mb-4 whitespace-pre-wrap font-sans"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-dim)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {response.explanation}
          </div>

          {/* Documented Conflicts Box (if drift detected) */}
          {response.status === 'drift_detected' && response.documented_conflicts.length > 0 && (
            <div
              id="drift-conflicts-container"
              className="mb-4 p-3.5 rounded-lg"
              style={{
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
            >
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: '#f87171' }}
              >
                ⚠️ Documented Historical Conflicts ({response.documented_conflicts.length})
              </h4>
              <ul className="space-y-1.5 text-xs font-mono" style={{ color: 'var(--color-text-primary)' }}>
                {response.documented_conflicts.map((conflict, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2">
                    <span style={{ color: '#f87171' }}>&bull;</span>
                    <span className="leading-relaxed">{conflict}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Historical Decision & Rationale Grounding */}
          {(response.previous_decision || response.institutional_lesson) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {response.previous_decision && (
                <div
                  className="p-3 rounded text-xs"
                  style={{
                    background: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border-dim)',
                  }}
                >
                  <span
                    className="text-[10px] font-mono font-bold uppercase block mb-1"
                    style={{ color: '#60a5fa' }}
                  >
                    Historical Decision Made
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {response.previous_decision}
                  </p>
                </div>
              )}

              {response.institutional_lesson && (
                <div
                  className="p-3 rounded text-xs"
                  style={{
                    background: 'var(--color-surface-1)',
                    border: '1px solid var(--color-border-dim)',
                  }}
                >
                  <span
                    className="text-[10px] font-mono font-bold uppercase block mb-1"
                    style={{ color: '#c084fc' }}
                  >
                    Documented Institutional Lesson
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {response.institutional_lesson}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Historical Operational Constraints */}
          {response.historical_constraints.length > 0 && (
            <div className="mb-4">
              <span
                className="text-[11px] font-mono uppercase tracking-wider block mb-1.5"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                Historical Operational Constraints:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {response.historical_constraints.map((c, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded font-mono"
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border-dim)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    🔒 {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grounded Cited Evidence (Standardized EvidenceCards) */}
          {response.evidence.length > 0 && (
            <div className="pt-3 border-t" style={{ borderColor: 'var(--color-border-dim)' }}>
              <button
                type="button"
                id="toggle-drift-evidence-btn"
                onClick={() => setShowEvidence(!showEvidence)}
                className="text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors hover:text-white"
                style={{
                  color:
                    response.status === 'drift_detected'
                      ? '#f87171'
                      : response.status === 'aligned'
                      ? '#4ade80'
                      : '#fbbf24',
                }}
              >
                <span>{showEvidence ? '▾ Hide Grounded Evidence' : '▸ View Grounded Evidence'}</span>
                <span className="font-mono text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  ({response.evidence.length} items from Hindsight)
                </span>
              </button>

              {showEvidence && (
                <div id="drift-evidence-list" className="mt-3 space-y-2.5">
                  {response.evidence.map((ev: DriftEvidenceItem, eIdx: number) => (
                    <EvidenceCard
                      key={ev.id ?? eIdx}
                      citationId={eIdx + 1}
                      text={ev.text}
                      context={ev.context || response.project}
                      documentId={ev.document_id}
                      type={ev.type || 'Drift Evidence'}
                      theme={
                        response.status === 'drift_detected'
                          ? 'red'
                          : response.status === 'aligned'
                          ? 'green'
                          : 'amber'
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
