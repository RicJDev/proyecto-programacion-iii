import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'neutral', style }: BadgeProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary-light)',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)',
    },
    secondary: {
      backgroundColor: '#f0fdfa',
      color: 'var(--color-secondary)',
      borderColor: 'var(--color-secondary)',
    },
    success: {
      backgroundColor: 'var(--color-success-bg)',
      color: 'var(--color-success)',
      borderColor: 'var(--color-success)',
    },
    warning: {
      backgroundColor: 'var(--color-warning-bg)',
      color: 'var(--color-warning)',
      borderColor: 'var(--color-warning)',
    },
    danger: {
      backgroundColor: 'var(--color-danger-bg)',
      color: 'var(--color-danger)',
      borderColor: 'var(--color-danger)',
    },
    neutral: {
      backgroundColor: 'var(--color-surface-muted)',
      color: 'var(--color-text)',
      borderColor: 'var(--color-border)',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2rem 0.55rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        borderWidth: '1px',
        borderStyle: 'solid',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

