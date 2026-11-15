import { useId, type SelectHTMLAttributes, type ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, children, style, id, ...props }: SelectProps) {
  const generatedId = useId();
  const selectId = id || props.name || generatedId;

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            fontSize: '0.825rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            marginBottom: '0.35rem',
          }}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        style={{
          width: '100%',
          padding: '0.55rem 0.75rem',
          backgroundColor: '#ffffff',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          color: 'var(--color-text)',
          outline: 'none',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-danger)',
            marginTop: '0.25rem',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
