import { useId, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
      {label && (
        <label
          htmlFor={inputId}
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
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '0.55rem 0.75rem',
          backgroundColor: '#ffffff',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          color: 'var(--color-text)',
          outline: 'none',
          ...style,
        }}
        {...props}
      />
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
