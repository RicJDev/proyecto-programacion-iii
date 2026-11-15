import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
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

