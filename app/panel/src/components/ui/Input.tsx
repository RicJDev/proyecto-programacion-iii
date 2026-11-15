<<<<<<< HEAD
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
=======
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const LABEL_CLASS =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-muted'

const CONTROL_CLASS =
  'w-full border bg-surface px-3 text-sm text-surface-text outline-none transition-colors placeholder:text-text-muted focus:outline-2 focus:outline-offset-0 focus:outline-primary disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-text-muted'

function controlStateClass(error?: boolean) {
  return error ? 'border-danger focus:outline-danger' : 'border-border-strong'
}

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
          className={LABEL_CLASS}
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`${CONTROL_CLASS} h-10 ${controlStateClass(Boolean(error))}`}
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

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({
  label,
  hint,
  error,
  className = '',
  id,
  ...rest
}: TextareaProps) {
  const inputId = id ?? rest.name

  return (
    <div className={className}>
      {label ? (
        <label
          className={LABEL_CLASS}
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={`${CONTROL_CLASS} min-h-24 resize-y py-2 ${controlStateClass(Boolean(error))}`}
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

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
}

export function Select({
  label,
  hint,
  error,
  placeholder,
  options,
  className = '',
  id,
  ...rest
}: SelectProps) {
  const inputId = id ?? rest.name

  return (
    <div className={className}>
      {label ? (
        <label
          className={LABEL_CLASS}
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}
      <div className='relative'>
        <select
          id={inputId}
          className={`${CONTROL_CLASS} h-10 appearance-none pr-9 ${controlStateClass(
            Boolean(error),
          )}`}
          aria-invalid={Boolean(error)}
          {...rest}
        >
          {placeholder ? <option value=''>{placeholder}</option> : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted'
          viewBox='0 0 20 20'
          fill='none'
          aria-hidden='true'
        >
          <path
            d='M5 7.5L10 12.5L15 7.5'
            stroke='currentColor'
            strokeWidth='1.5'
          />
        </svg>
      </div>
      {error ? (
        <p className='mt-1 text-[11px] font-medium text-danger'>{error}</p>
      ) : hint ? (
        <p className='mt-1 text-[11px] text-text-muted'>{hint}</p>
      ) : null}
    </div>
  )
>>>>>>> d447c1bd51ddea511737f8d1aba3e95f9f5695e2
}
