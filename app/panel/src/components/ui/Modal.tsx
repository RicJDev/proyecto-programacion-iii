<<<<<<< HEAD
import type { ReactNode } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '2px solid var(--color-border-dark)',
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
          <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} style={{ padding: '0.2rem 0.5rem' }}>
            ✕
          </Button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-muted)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

=======
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  size?: ModalSize
  footer?: ReactNode
  children?: ReactNode
}

const SIZES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-surface-text/60 p-4 sm:p-8'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-label={typeof title === 'string' ? title : undefined}
        className={`w-full border border-border-strong bg-surface ${SIZES[size]}`}
      >
        <div className='flex items-start justify-between gap-4 border-b border-border px-5 py-4'>
          <div>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-surface-text'>
              {title}
            </h2>
            {description ? (
              <p className='mt-1 text-xs text-text-muted'>{description}</p>
            ) : null}
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            aria-label='Cerrar ventana'
            className='-mr-2 -mt-1 h-8 w-8 shrink-0 px-0'
          >
            <svg
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='none'
              aria-hidden='true'
            >
              <path
                d='M5 5L15 15M15 5L5 15'
                stroke='currentColor'
                strokeWidth='1.5'
              />
            </svg>
          </Button>
        </div>

        <div className='max-h-[70vh] overflow-y-auto px-5 py-4'>{children}</div>

        {footer ? (
          <div className='flex flex-wrap items-center justify-end gap-2 border-t border-border bg-surface-alt px-5 py-3'>
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

export type DialogProps = ModalProps

export function Dialog(props: DialogProps) {
  return <Modal {...props} />
}
>>>>>>> d447c1bd51ddea511737f8d1aba3e95f9f5695e2
