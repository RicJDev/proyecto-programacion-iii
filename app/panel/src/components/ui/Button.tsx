<<<<<<< HEAD
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
=======
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
>>>>>>> d447c1bd51ddea511737f8d1aba3e95f9f5695e2
}

export function Button({
  variant = 'primary',
  size = 'md',
<<<<<<< HEAD
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.6 : 1,
    borderWidth: '1px',
    borderStyle: 'solid',
    outline: 'none',
    gap: '0.5rem',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.35rem 0.75rem', fontSize: '0.825rem' },
    md: { padding: '0.55rem 1.15rem', fontSize: '0.9rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#ffffff',
      borderColor: 'var(--color-primary)',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: '#ffffff',
      borderColor: 'var(--color-secondary)',
    },
    danger: {
      backgroundColor: 'var(--color-danger)',
      color: '#ffffff',
      borderColor: 'var(--color-danger)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-border-dark)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text)',
      borderColor: 'transparent',
    },
  };

  return (
    <button
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant] }}
      className={`gov-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

=======
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
>>>>>>> d447c1bd51ddea511737f8d1aba3e95f9f5695e2
