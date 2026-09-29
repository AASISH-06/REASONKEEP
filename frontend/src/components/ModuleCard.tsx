/**
 * ModuleCard — displays a module's name, status, and description.
 *
 * Used on the foundation page to communicate system capabilities.
 */

import { StatusBadge } from './StatusBadge'

type ModuleStatus = 'completed' | 'active' | 'upcoming' | 'locked'

interface ModuleCardProps {
  title: string
  status: ModuleStatus
  description: string
  module: string
}

const STATUS_MAP: Record<ModuleStatus, { variant: 'ok' | 'pending' | 'inactive'; label: string }> = {
  completed: { variant: 'ok', label: 'Complete' },
  active: { variant: 'ok', label: 'Active · Polished' },
  upcoming: { variant: 'pending', label: 'Upcoming' },
  locked: { variant: 'inactive', label: 'Locked' },
}

export function ModuleCard({ title, status, description, module }: ModuleCardProps) {
  const { variant, label } = STATUS_MAP[status] || STATUS_MAP.upcoming

  const isActive = status === 'active'
  const isCompleted = status === 'completed'

  return (
    <div
      className="card flex flex-col gap-3 transition-all"
      style={{
        borderColor: isActive
          ? 'rgba(99,102,241,0.5)'
          : isCompleted
          ? 'rgba(34,197,94,0.25)'
          : 'var(--color-border)',
        boxShadow: isActive
          ? '0 0 0 1px rgba(99,102,241,0.2) inset'
          : undefined,
        background: isActive
          ? 'rgba(99,102,241,0.03)'
          : 'var(--color-surface-1)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="section-label mb-1" style={{ color: isActive ? '#a5b4fc' : isCompleted ? '#86efac' : 'var(--color-text-tertiary)' }}>
            {module}
          </p>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
        </div>
        <StatusBadge variant={variant} label={label} />
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        {description}
      </p>
    </div>
  )
}
