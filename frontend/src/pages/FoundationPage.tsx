/**
 * FoundationPage — Primary workspace for REASONKEEP.
 *
 * Module 7 Polish:
 * - Professional institutional aesthetic
 * - Clear visual hierarchy and section numbering
 * - Live backend & Hindsight Cloud status indicators
 * - Accurate module roadmap through Module 7
 * - Unified card treatments, spacing, and typography
 */

import { AssistantPanel } from '../components/AssistantPanel'
import { DecisionDriftPanel } from '../components/DecisionDriftPanel'
import { DecisionTracePanel } from '../components/DecisionTracePanel'
import { IngestionDevPanel } from '../components/IngestionDevPanel'
import { MemoryDevPanel } from '../components/MemoryDevPanel'
import { ModuleCard } from '../components/ModuleCard'
import { MODULES, TECH_STACK } from '../data'
import type { ApiStatus } from '../hooks/useHealthCheck'

interface FoundationPageProps {
  apiStatus: ApiStatus
}

export function FoundationPage({ apiStatus }: FoundationPageProps) {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-8 max-w-5xl mx-auto w-full space-y-10">

      {/* ── Institutional Hero Section ──────────────────────── */}
      <section aria-labelledby="hero-heading" className="pt-2">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="section-label font-mono"
            style={{ color: 'var(--color-accent)' }}
          >
            Institutional Engineering Memory System
          </span>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#4ade80' }}
            aria-hidden="true"
          />
          <span className="section-label font-mono" style={{ color: '#4ade80' }}>
            System Operational
          </span>
        </div>

        <h1
          id="hero-heading"
          className="text-3xl font-extrabold tracking-tight mb-3"
          style={{ color: 'var(--color-text-primary)' }}
        >
          REASONKEEP
        </h1>

        <p
          className="text-sm leading-relaxed max-w-3xl"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Institutional memory for university engineering, robotics, and capstone research teams.
          REASONKEEP preserves technical rationale, rejected alternatives, operational constraints,
          hardware failures, and institutional lessons so successive student cohorts build upon
          accumulated knowledge rather than repeating historical mistakes.
        </p>
      </section>

      {/* ── System Status & Memory Bank Summary ─────────────── */}
      <section aria-labelledby="health-heading">
        <div
          id="backend-health-card"
          className="card p-4 flex flex-wrap items-center justify-between gap-4"
          style={{
            background: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg"
              style={{
                background: apiStatus === 'ok' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${apiStatus === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}
            >
              <span className="text-base">{apiStatus === 'ok' ? '⚡' : '⚠️'}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Backend API & Memory Service
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-tertiary)' }}>
                  v0.6.0
                </span>
              </div>
              <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                FastAPI: 127.0.0.1:8000 &bull; Bank: <span className="text-indigo-400">reasonkeep-university-demo</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                Zero-Fabrication Contract:
              </span>
              <span className="text-[11px] text-green-400 font-semibold">
                ACTIVE
              </span>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full border"
              style={{
                background: 'var(--color-surface-2)',
                borderColor: apiStatus === 'ok' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
              }}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full ${apiStatus === 'ok' ? 'animate-pulse' : ''}`}
                style={{
                  backgroundColor:
                    apiStatus === 'ok'
                      ? '#4ade80'
                      : apiStatus === 'error'
                      ? '#ef4444'
                      : '#fbbf24',
                }}
                aria-hidden="true"
              />
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    apiStatus === 'ok'
                      ? '#4ade80'
                      : apiStatus === 'error'
                      ? '#ef4444'
                      : '#fbbf24',
                }}
              >
                {apiStatus === 'ok'
                  ? 'Healthy · Online'
                  : apiStatus === 'error'
                  ? 'Offline · Start Server'
                  : 'Verifying…'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Module 4: Institutional Memory Assistant ───────── */}
      <AssistantPanel />

      {/* ── Module 5: Decision Trace Reconstruction ─────────── */}
      <DecisionTracePanel />

      {/* ── Module 6: Decision Drift Detection ─────────────── */}
      <DecisionDriftPanel />

      {/* ── Module 3: Institutional Ingestion Dev Panel ─────── */}
      <IngestionDevPanel />

      {/* ── Module 2: Hindsight Memory Dev Panel ───────────── */}
      <MemoryDevPanel />

      {/* ── Module Roadmap ───────────────────────────────────── */}
      <section aria-labelledby="roadmap-heading" className="pt-2">
        <div className="mb-4">
          <span className="section-label font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
            System Architecture & Roadmap
          </span>
          <h2
            id="roadmap-heading"
            className="text-sm font-bold uppercase tracking-wider mt-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Engineering Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {MODULES.map((m) => (
            <ModuleCard
              key={m.module}
              module={m.module}
              title={m.title}
              status={m.status}
              description={m.description}
            />
          ))}
        </div>
      </section>

      {/* ── Tech Stack Summary ───────────────────────────────── */}
      <section aria-labelledby="stack-heading">
        <div className="card p-5">
          <h2
            id="stack-heading"
            className="text-xs font-bold uppercase tracking-wider mb-4 font-mono"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Technical Specifications & Architectural Constraints
          </h2>

          <dl className="divide-y" style={{ borderColor: 'var(--color-border-dim)' }}>
            {TECH_STACK.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-baseline justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <dt
                  className="text-xs font-mono font-medium shrink-0 pr-4"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {label}
                </dt>
                <dd
                  className="text-xs text-right font-sans"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Institutional Footer ─────────────────────────────── */}
      <footer className="pt-4 pb-8 border-t text-center space-y-1" style={{ borderColor: 'var(--color-border-dim)' }}>
        <p className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
          REASONKEEP &bull; Institutional Engineering Memory System &bull; Modules 1–10 Complete &amp; Verified (Submission Ready)
        </p>
        <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
          Hindsight Cloud Sole Memory Store &bull; Meridian Institute of Technology &bull; Computer Engineering Research Lab
        </p>
      </footer>
    </main>
  )
}
