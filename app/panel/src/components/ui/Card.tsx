import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`border border-border bg-surface ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps {
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}

export function CardHeader({
  title,
  subtitle,
  actions,
  children,
}: CardHeaderProps) {
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4'>
      <div className='min-w-0'>
        {title ? (
          <h3 className='text-sm font-semibold uppercase tracking-wider text-surface-text'>
            {title}
          </h3>
        ) : null}
        {subtitle ? (
          <p className='mt-1 text-xs text-text-muted'>{subtitle}</p>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className='flex items-center gap-2'>{actions}</div>
      ) : null}
    </div>
  )
}

export function CardContent({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`px-5 py-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardFooter({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-alt px-5 py-3 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
