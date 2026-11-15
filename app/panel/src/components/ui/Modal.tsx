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

