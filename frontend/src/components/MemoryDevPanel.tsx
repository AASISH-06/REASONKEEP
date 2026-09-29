/**
 * MemoryDevPanel — Development-only verification panel for Module 2.
 *
 * Allows manual testing of Retain / Recall / Reflect directly in the browser.
 * This is NOT the final REASONKEEP interface.
 * It will be replaced by the real UI in later modules.
 */

import { useState, useEffect } from 'react'
import {
  fetchMemoryStatus,
  retainMemory,
  recallMemory,
  reflectMemory,
  type MemoryStatus,
} from '../services/memoryApi'

type OpResult = {
  ok: boolean
  message: string
  data?: unknown
}

function ResultBox({ result }: { result: OpResult | null }) {
  if (!result) return null
  return (
    <div
      className="mt-3 p-3 rounded-lg text-xs font-mono leading-relaxed overflow-auto max-h-48"
      style={{
        background: result.ok ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
        border: `1px solid ${result.ok ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
        color: result.ok ? '#4ade80' : '#f87171',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {result.message}
      {result.data !== undefined && (
        <>
          {'\n\n'}
          {JSON.stringify(result.data, null, 2)}
        </>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
      {children}
    </p>
  )
}

function InputField({
  id,
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  const shared = {
    id,
    value,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className: 'w-full rounded-lg px-3 py-2 text-xs outline-none',
    style: {
      background: 'var(--color-surface-2)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text-primary)',
    } as React.CSSProperties,
  }
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} style={{ ...shared.style, resize: 'vertical', fontFamily: 'inherit' }} />
      ) : (
        <input type="text" {...shared} />
      )}
    </div>
  )
}

function ActionButton({
  id,
  label,
  onClick,
  loading,
}: {
  id: string
  label: string
  onClick: () => void
  loading: boolean
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 rounded-lg text-xs font-medium"
      style={{
        background: loading ? 'var(--color-surface-3)' : 'var(--color-accent)',
        color: '#fff',
        opacity: loading ? 0.6 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
        border: 'none',
      }}
    >
      {loading ? 'Working…' : label}
    </button>
  )
}

export function MemoryDevPanel() {
  const [memStatus, setMemStatus] = useState<MemoryStatus | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)

  // Retain state
  const [retainContent, setRetainContent] = useState('')
  const [retainContext, setRetainContext] = useState('')
  const [retainLoading, setRetainLoading] = useState(false)
  const [retainResult, setRetainResult] = useState<OpResult | null>(null)

  // Recall state
  const [recallQuery, setRecallQuery] = useState('')
  const [recallLoading, setRecallLoading] = useState(false)
  const [recallResult, setRecallResult] = useState<OpResult | null>(null)

  // Reflect state
  const [reflectQuery, setReflectQuery] = useState('')
  const [reflectLoading, setReflectLoading] = useState(false)
  const [reflectResult, setReflectResult] = useState<OpResult | null>(null)

  useEffect(() => {
    fetchMemoryStatus()
      .then(setMemStatus)
      .catch((e: Error) => setStatusError(e.message))
  }, [])

  const handleRetain = async () => {
    if (!retainContent.trim()) return
    setRetainLoading(true)
    setRetainResult(null)
    try {
      const r = await retainMemory(retainContent.trim(), retainContext.trim() || undefined)
      setRetainResult({ ok: true, message: `Retained ${r.items_count} item(s) in bank: ${r.bank_id}`, data: r })
    } catch (e: unknown) {
      setRetainResult({ ok: false, message: (e as Error).message })
    } finally {
      setRetainLoading(false)
    }
  }

  const handleRecall = async () => {
    if (!recallQuery.trim()) return
    setRecallLoading(true)
    setRecallResult(null)
    try {
      const r = await recallMemory(recallQuery.trim())
      if (r.found) {
        setRecallResult({
          ok: true,
          message: `Found ${r.count} memory item(s)`,
          data: r.memories.map((m) => ({ id: m.id, text: m.text, type: m.type })),
        })
      } else {
        setRecallResult({ ok: true, message: 'No relevant memories found for this query.' })
      }
    } catch (e: unknown) {
      setRecallResult({ ok: false, message: (e as Error).message })
    } finally {
      setRecallLoading(false)
    }
  }

  const handleReflect = async () => {
    if (!reflectQuery.trim()) return
    setReflectLoading(true)
    setReflectResult(null)
    try {
      const r = await reflectMemory(reflectQuery.trim())
      setReflectResult({
        ok: true,
        message: r.response + (r.memories_used > 0 ? `\n\n[grounded on ${r.memories_used} memory item(s)]` : '\n\n[no memories used]'),
      })
    } catch (e: unknown) {
      setReflectResult({ ok: false, message: (e as Error).message })
    } finally {
      setReflectLoading(false)
    }
  }

  return (
    <section aria-labelledby="dev-panel-heading" className="mb-10">
      <h2
        id="dev-panel-heading"
        className="text-xs font-semibold uppercase tracking-widest mb-1"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Hindsight Integration — Development Verification
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
        Module 2 test panel. Not the final interface.
      </p>

      {/* Status */}
      <div className="card mb-4">
        <SectionLabel>Memory Status</SectionLabel>
        {statusError ? (
          <p className="text-xs" style={{ color: 'var(--color-error)' }}>Error: {statusError}</p>
        ) : !memStatus ? (
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Loading…</p>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="text-xs" style={{ color: memStatus.configured ? '#4ade80' : '#f87171' }}>
              {memStatus.configured ? '✓ Configured' : '✗ Not configured'}
            </p>
            {memStatus.bank_id && (
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Bank: <code>{memStatus.bank_id}</code>
              </p>
            )}
            {memStatus.api_url && (
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Endpoint: <code>{memStatus.api_url}</code>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Retain */}
        <div className="card">
          <SectionLabel>Retain Memory</SectionLabel>
          <InputField
            id="retain-content"
            label="Content"
            value={retainContent}
            onChange={setRetainContent}
            multiline
            placeholder="Enter institutional memory to store…"
          />
          <InputField
            id="retain-context"
            label="Context (optional)"
            value={retainContext}
            onChange={setRetainContext}
            placeholder="e.g. database-decision"
          />
          <ActionButton id="retain-submit-btn" label="Retain" onClick={handleRetain} loading={retainLoading} />
          <ResultBox result={retainResult} />
        </div>

        {/* Recall */}
        <div className="card">
          <SectionLabel>Recall Memories</SectionLabel>
          <InputField
            id="recall-query"
            label="Query"
            value={recallQuery}
            onChange={setRecallQuery}
            multiline
            placeholder="What database was chosen and why?"
          />
          <ActionButton id="recall-submit-btn" label="Recall" onClick={handleRecall} loading={recallLoading} />
          <ResultBox result={recallResult} />
        </div>

        {/* Reflect */}
        <div className="card">
          <SectionLabel>Reflect on Memories</SectionLabel>
          <InputField
            id="reflect-query"
            label="Query"
            value={reflectQuery}
            onChange={setReflectQuery}
            multiline
            placeholder="Explain the reasoning behind the database selection."
          />
          <ActionButton id="reflect-submit-btn" label="Reflect" onClick={handleReflect} loading={reflectLoading} />
          <ResultBox result={reflectResult} />
        </div>
      </div>
    </section>
  )
}
