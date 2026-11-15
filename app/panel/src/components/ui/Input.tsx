import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'

const LABEL_CLASS =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-muted'

const CONTROL_CLASS =
  'w-full rounded-none border bg-surface px-3 text-sm text-surface-text outline-none transition-colors placeholder:text-text-muted focus:outline-2 focus:outline-offset-0 focus:outline-primary disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-text-muted'

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
  const generatedId = useId()
  const inputId = id ?? rest.name ?? generatedId

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
  const generatedId = useId()
  const inputId = id ?? rest.name ?? generatedId

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
  options?: SelectOption[]
  children?: ReactNode
}

export function Select({
  label,
  hint,
  error,
  placeholder,
  options,
  children,
  className = '',
  id,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const inputId = id ?? rest.name ?? generatedId

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
          className={`${CONTROL_CLASS} h-10 appearance-none pr-9 cursor-pointer ${controlStateClass(
            Boolean(error),
          )}`}
          aria-invalid={Boolean(error)}
          {...rest}
        >
          {placeholder ? <option value=''>{placeholder}</option> : null}
          {options
            ? options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            : children}
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
}
