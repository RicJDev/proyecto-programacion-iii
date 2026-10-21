import type { HTMLAttributes } from 'react'

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

const VARIANTS: Record<BadgeVariant, string> = {
  success: 'border-success/40 bg-success-soft text-success',
  warning: 'border-warning/40 bg-warning-soft text-warning',
  danger: 'border-danger/40 bg-danger-soft text-danger',
  info: 'border-info/40 bg-info-soft text-info',
  neutral: 'border-border bg-secondary-soft text-text-muted',
}

const SIZES: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-px text-[10px]',
  md: 'px-2 py-0.5 text-[11px]',
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 border font-semibold uppercase tracking-wider ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  )
}
