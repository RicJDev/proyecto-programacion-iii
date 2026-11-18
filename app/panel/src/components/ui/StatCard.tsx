import type { ReactNode } from 'react'
import type { KpiMetric, TrendDirection } from '../../types'

const TREND_STYLES: Record<TrendDirection, string> = {
  up: 'text-success',
  down: 'text-danger',
  stable: 'text-text-muted',
}

const TREND_LABELS: Record<TrendDirection, string> = {
  up: '[+]',
  down: '[-]',
  stable: '[=]',
}

export interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  hint?: string
  subtitle?: string
  tag?: string
  trend?: TrendDirection
  trendValue?: string
  icon?: ReactNode
}

export function StatCard({
  label,
  value,
  unit,
  hint,
  subtitle,
  tag,
  trend,
  trendValue,
  icon,
}: StatCardProps) {
  const descriptionText = hint ?? subtitle

  return (
    <div className='flex items-start justify-between gap-4 rounded-none border border-border border-l-4 border-l-primary bg-surface p-5'>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-2'>
          <p className='text-[11px] font-semibold uppercase tracking-wider text-text-muted'>
            {label}
          </p>
          {tag ? (
            <span className='border border-border bg-surface-alt px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted'>
              {tag}
            </span>
          ) : null}
        </div>
        <p className='mt-2 flex items-baseline gap-1.5'>
          <span className='text-2xl font-bold leading-none tracking-tight text-surface-text'>
            {value}
          </span>
          {unit ? (
            <span className='text-xs font-medium uppercase text-text-muted'>
              {unit}
            </span>
          ) : null}
        </p>
        {(trend || descriptionText) ? (
          <div className='mt-2 flex flex-wrap items-center gap-2 text-[11px]'>
            {trend ? (
              <span
                className={`inline-flex items-center gap-1 font-semibold ${TREND_STYLES[trend]}`}
              >
                <span aria-hidden='true'>{TREND_LABELS[trend]}</span>
                {trendValue}
              </span>
            ) : null}
            {descriptionText ? (
              <span className='text-text-muted'>{descriptionText}</span>
            ) : null}
          </div>
        ) : null}
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
