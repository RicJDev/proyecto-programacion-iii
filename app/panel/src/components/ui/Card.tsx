<<<<<<< HEAD
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        marginBottom: '1.25rem',
        ...style,
      }}
      className={`gov-card ${className}`}
    >
      {children}
    </div>
  );
=======
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
>>>>>>> d447c1bd51ddea511737f8d1aba3e95f9f5695e2
}

export function CardHeader({
  title,
  subtitle,
<<<<<<< HEAD
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface-muted)',
      }}
    >
      <div>
        <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{title}</h3>
        {subtitle && (
          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.2rem',
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({
  children,
  style,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={{ padding: '1.25rem', ...style }}>{children}</div>;
}

=======
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
>>>>>>> d447c1bd51ddea511737f8d1aba3e95f9f5695e2
