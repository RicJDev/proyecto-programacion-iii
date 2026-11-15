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
}

export function CardHeader({
  title,
  subtitle,
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

