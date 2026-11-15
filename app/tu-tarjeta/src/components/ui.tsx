import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react'

/* ── Button ─────────────────────────────────────────────── */

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 border font-semibold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-primary-foreground hover:bg-primary-hover',
  outline:
    'border-border-strong bg-surface text-surface-text hover:border-secondary hover:bg-surface-alt',
  ghost:
    'border-transparent bg-transparent text-secondary hover:bg-secondary-soft',
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[11px]',
  md: 'h-10 px-5 text-xs',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ── Input ──────────────────────────────────────────────── */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({
  label,
  hint,
  error,
  className = '',
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? rest.name

  return (
    <div className={className}>
      {label ? (
        <label
          className='mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-muted'
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`h-10 w-full border bg-surface px-3 text-sm text-surface-text outline-none transition-colors placeholder:text-text-muted focus:outline-2 focus:outline-offset-0 focus:outline-primary disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-text-muted ${
          error ? 'border-danger focus:outline-danger' : 'border-border-strong'
        }`}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error ? (
        <p className='mt-1 text-[11px] font-medium text-danger'>{error}</p>
      ) : hint ? (
        <p className='mt-1 text-[11px] text-text-muted'>{hint}</p>
      ) : null}
    </div>
  )
}

/* ── Badge ──────────────────────────────────────────────── */

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  children?: ReactNode
  className?: string
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  success: 'border-success/40 bg-success-soft text-success',
  warning: 'border-warning/40 bg-warning-soft text-warning',
  danger: 'border-danger/40 bg-danger-soft text-danger',
  info: 'border-info/40 bg-info-soft text-info',
  neutral: 'border-border bg-secondary-soft text-text-muted',
}

export function Badge({
  variant = 'neutral',
  className = '',
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${BADGE_VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
