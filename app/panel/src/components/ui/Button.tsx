import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const BASE =
  'inline-flex items-center justify-center gap-2 border font-semibold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'border-secondary bg-secondary text-secondary-foreground hover:bg-secondary-hover',
  outline:
    'border-border-strong bg-surface text-surface-text hover:border-secondary hover:bg-surface-alt',
  danger: 'border-danger bg-danger text-white hover:bg-danger/85',
  ghost:
    'border-transparent bg-transparent text-secondary hover:bg-secondary-soft',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[11px]',
  md: 'h-10 px-4 text-xs',
  lg: 'h-12 px-6 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
