/**
 * IngestionDevPanel — Development-only verification panel for Module 3.
 *
 * Allows structured ingestion of university engineering decisions into Hindsight.
 * Clearly labeled as development / verification interface.
 */

import { useState } from 'react'
import {
  ingestDecision,
  seedDemoMemories,
  type IngestResult,
  type InstitutionalMemoryPayload,
  type MemoryType,
} from '../services/ingestionApi'

const MEMORY_TYPES: MemoryType[] = [
  'decision',
  'constraint',
  'alternative',
  'failure',
  'outcome',
  'lesson',
  'project',
]

const SAMPLE_DEMO_SCENARIO: InstitutionalMemoryPayload = {
  project: 'Smart Campus Network',
  project_type: 'infrastructure_research',
  organization_context: 'Meridian Institute of Technology — Computer Engineering Research Lab',
  memory_type: 'decision',
  title: 'Obstacle Detection Sensor Suite Selection',
  decision: 'Use 3D LiDAR (Ouster OS1-32) fused with Stereo Vision cameras for primary obstacle detection.',
  reason: 'Provides reliable 360-degree point clouds and depth estimation under rapidly changing university campus lighting conditions.',
  constraints: ['Battery-powered sensors', 'Large campus deployment', 'Budget under $8,000'],
  alternatives: ['Single monocular RGB camera', 'Ultrasonic array'],
  rejected_alternatives: [
    {
      alternative: 'Single monocular RGB camera',
      reason: 'Performance degraded severely under dusk conditions and caused false negative detections on dark asphalt shadows.',
    },
  ],
  outcome: 'Dual LiDAR + stereo camera perception achieved 99.4% obstacle detection reliability up to 15m.',
  lesson: 'Sensor redundancy is essential for outdoor campus navigation. Never rely solely on monocular vision in unconstrained outdoor lighting environments.',
  team_context: 'Perception & Sensing Subsystem Cohort',
  date: '2024-10-14',
  source: 'UASL-Design-Review-Doc-004',
  tags: ['perception', 'lidar', 'stereo-vision', 'safety'],
}

export function IngestionDevPanel() {
  const [formData, setFormData] = useState<InstitutionalMemoryPayload>(SAMPLE_DEMO_SCENARIO)
  const [constraintsText, setConstraintsText] = useState(
    SAMPLE_DEMO_SCENARIO.constraints?.join(', ') ?? ''
  )
  const [alternativesText, setAlternativesText] = useState(
    SAMPLE_DEMO_SCENARIO.alternatives?.join(', ') ?? ''
  )
  const [tagsText, setTagsText] = useState(SAMPLE_DEMO_SCENARIO.tags?.join(', ') ?? '')

  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [result, setResult] = useState<{
    ok: boolean
    message: string
    data?: IngestResult | unknown
  } | null>(null)

  function updateField<K extends keyof InstitutionalMemoryPayload>(
    key: K,
    value: InstitutionalMemoryPayload[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function handleQuickFill() {
    setFormData(SAMPLE_DEMO_SCENARIO)
    setConstraintsText(SAMPLE_DEMO_SCENARIO.constraints?.join(', ') ?? '')
    setAlternativesText(SAMPLE_DEMO_SCENARIO.alternatives?.join(', ') ?? '')
    setTagsText(SAMPLE_DEMO_SCENARIO.tags?.join(', ') ?? '')
    setResult(null)
  }

  function handleClear() {
    setFormData({
      project: '',
      memory_type: 'decision',
      title: '',
      decision: '',
      reason: '',
      constraints: [],
      alternatives: [],
      rejected_alternatives: [],
      outcome: '',
      lesson: '',
      source: '',
      tags: [],
    })
    setConstraintsText('')
    setAlternativesText('')
    setTagsText('')
    setResult(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const payload: InstitutionalMemoryPayload = {
      ...formData,
      constraints: constraintsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      alternatives: alternativesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: tagsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }

    try {
      const res = await ingestDecision(payload)
      setResult({
        ok: res.success,
        message: `Successfully ingested institutional memory into Hindsight Cloud! Bank: ${res.bank_id}`,
        data: res,
      })
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSeedAll() {
    setSeeding(true)
    setResult(null)
    try {
      const res = await seedDemoMemories()
      const cachedPart = res.already_present ? ` (${res.newly_seeded ?? 0} new, ${res.already_present} already present - idempotent)` : ''
      setResult({
        ok: res.successful > 0,
        message: `Verified / Seeded ${res.successful}/${res.total} institutional memories in Hindsight Cloud${cachedPart}.`,
        data: res,
      })
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setSeeding(false)
    }
  }

  return (
    <section
      className="card mb-8 p-6"
      style={{
        border: '1px solid rgba(139,92,246,0.3)',
        background: 'linear-gradient(180deg, rgba(139,92,246,0.04) 0%, transparent 100%)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Institutional Memory Ingestion
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded font-mono font-medium"
              style={{
                background: 'rgba(139,92,246,0.15)',
                color: '#c084fc',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            >
              MODULE 3 DEV PANEL
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Structured knowledge transformation into cohesive institutional memories retained directly in Hindsight Cloud.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs px-2.5 py-1.5 rounded font-medium transition-all"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            📋 Quick Fill Demo
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs px-2.5 py-1.5 rounded font-medium transition-all"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSeedAll}
            disabled={seeding}
            className="text-xs px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5"
            style={{
              background: 'rgba(139,92,246,0.2)',
              border: '1px solid rgba(139,92,246,0.4)',
              color: '#d8b4fe',
            }}
          >
            {seeding ? 'Verifying & Seeding...' : '⚡ Seed All 14 Demo Memories (Idempotent)'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Project <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={formData.project}
              onChange={(e) => updateField('project', e.target.value)}
              placeholder="e.g. Campus Autonomous Delivery Rover"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Memory Type <span style={{ color: '#f87171' }}>*</span>
            </label>
            <select
              value={formData.memory_type}
              onChange={(e) => updateField('memory_type', e.target.value as MemoryType)}
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              {MEMORY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Title / Topic
            </label>
            <input
              type="text"
              value={formData.title ?? ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Obstacle Detection Sensor Selection"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Decision Made
            </label>
            <textarea
              rows={2}
              value={formData.decision ?? ''}
              onChange={(e) => updateField('decision', e.target.value)}
              placeholder="What technical or architectural decision was made?"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Reason / Core Rationale
            </label>
            <textarea
              rows={2}
              value={formData.reason ?? ''}
              onChange={(e) => updateField('reason', e.target.value)}
              placeholder="Why was this choice made? (Preserves reasoning for future teams)"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Constraints (comma-separated)
            </label>
            <input
              type="text"
              value={constraintsText}
              onChange={(e) => setConstraintsText(e.target.value)}
              placeholder="e.g. Battery budget, Pedestrian clearance, Under $8000"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Alternatives Evaluated (comma-separated)
            </label>
            <input
              type="text"
              value={alternativesText}
              onChange={(e) => setAlternativesText(e.target.value)}
              placeholder="e.g. Single monocular RGB camera, Ultrasonic array"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Observed Outcome
            </label>
            <textarea
              rows={2}
              value={formData.outcome ?? ''}
              onChange={(e) => updateField('outcome', e.target.value)}
              placeholder="What happened when this was deployed?"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Institutional Lesson for Future Teams
            </label>
            <textarea
              rows={2}
              value={formData.lesson ?? ''}
              onChange={(e) => updateField('lesson', e.target.value)}
              placeholder="What should the next student cohort remember?"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Source Reference
            </label>
            <input
              type="text"
              value={formData.source ?? ''}
              onChange={(e) => updateField('source', e.target.value)}
              placeholder="e.g. UASL-Design-Review-Doc-004"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="e.g. perception, lidar, stereo-vision, safety"
              className="w-full rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
            }}
          >
            {loading ? 'Ingesting into Hindsight...' : '🚀 Ingest Institutional Decision'}
          </button>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div
          className="mt-4 p-4 rounded-lg text-xs font-mono leading-relaxed overflow-auto max-h-56"
          style={{
            background: result.ok ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
            border: `1px solid ${result.ok ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: result.ok ? '#4ade80' : '#f87171',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          <div className="font-bold mb-1">
            {result.ok ? '✅ INGESTION SUCCESS' : '❌ INGESTION FAILED'}
          </div>
          <div>{result.message}</div>
          {result.data !== undefined && (
            <pre className="mt-2 text-xs" style={{ opacity: 0.9 }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </section>
  )
}
