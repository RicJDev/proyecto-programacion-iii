import type { ReactNode } from 'react'
import type { KpiMetric, TrendDirection } from '../../types'

const TREND_STYLES: Record<TrendDirection, string> = {
  up: 'text-success',
  down: 'text-danger',
  stable: 'text-text-muted',
}

const TREND_ARROWS: Record<TrendDirection, string> = {
  up: '▲',
  down: '▼',
  stable: '■',
}

export interface StatCardProps {
  label: string
  value: string
  unit?: string
  hint?: string
  trend?: TrendDirection
  trendValue?: string
  icon?: ReactNode
}

export function StatCard({
  label,
  value,
  unit,
  hint,
  trend,
  trendValue,
  icon,
}: StatCardProps) {
  return (
    <div className='flex items-start justify-between gap-4 border border-border bg-surface p-5'>
      <div className='min-w-0'>
        <p className='text-[11px] font-semibold uppercase tracking-wider text-text-muted'>
          {label}
        </p>
        <p className='mt-2 flex items-baseline gap-1.5'>
          <span className='text-3xl font-semibold leading-none tracking-tight text-surface-text'>
            {value}
          </span>
          {unit ? (
            <span className='text-xs font-medium uppercase text-text-muted'>
              {unit}
            </span>
          ) : null}
        </p>
        <div className='mt-2 flex flex-wrap items-center gap-2 text-[11px]'>
          {trend ? (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${TREND_STYLES[trend]}`}
            >
              <span aria-hidden='true'>{TREND_ARROWS[trend]}</span>
              {trendValue}
            </span>
          ) : null}
          {hint ? <span className='text-text-muted'>{hint}</span> : null}
        </div>
      </div>
      {icon ? (
        <div className='flex h-10 w-10 shrink-0 items-center justify-center border border-primary/30 bg-primary-soft text-primary'>
          {icon}
        </div>
      ) : null}
    </div>
  )
}

export interface KPICardProps {
  metric: KpiMetric
  icon?: ReactNode
}

export function KPICard({ metric, icon }: KPICardProps) {
  return (
    <StatCard
      label={metric.label}
      value={metric.value}
      unit={metric.unit}
      hint={metric.hint}
      trend={metric.trend}
      trendValue={metric.trendValue}
      icon={icon}
    />
  )
}
