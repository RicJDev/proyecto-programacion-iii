<<<<<<< HEAD
import type { ReactNode } from 'react';

export function Table({
  headers,
  children,
  emptyMessage = 'No hay registros disponibles.',
  isEmpty = false,
}: {
  headers: string[];
  children?: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', border: '1px solid var(--color-border)' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              borderBottom: '2px solid var(--color-border)',
            }}
          >
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '0.75rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.05em',
                  borderRight: i < headers.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({
  children,
  style,
  onClick,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      style={{
        borderBottom: '1px solid var(--color-border)',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: '#ffffff',
        ...style,
      }}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  style,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        padding: '0.75rem 1rem',
        borderRight: '1px solid var(--color-border)',
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {children}
    </td>
  );
}

=======
import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react'

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Table({ className = '', children, ...rest }: TableProps) {
  return (
    <div
      className={`overflow-x-auto border border-border bg-surface ${className}`}
      {...rest}
    >
      <table className='w-full min-w-[640px] text-left text-sm'>
        {children}
      </table>
    </div>
  )
}

export function TableHead({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`border-b border-border-strong bg-secondary-soft ${className}`}
      {...rest}
    >
      {children}
    </thead>
  )
}

export function TableBody({
  className = '',
  children,
  ...rest
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={`divide-y divide-border ${className}`}
      {...rest}
    >
      {children}
    </tbody>
  )
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  highlight?: boolean
}

export function TableRow({
  highlight = false,
  className = '',
  children,
  ...rest
}: TableRowProps) {
  return (
    <tr
      className={`transition-colors ${
        highlight ? 'bg-primary-soft' : 'hover:bg-surface-alt'
      } ${className}`}
      {...rest}
    >
      {children}
    </tr>
  )
}

export function TableHeaderCell({
  className = '',
  children,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope='col'
      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted ${className}`}
      {...rest}
    >
      {children}
    </th>
  )
}

export function TableCell({
  className = '',
  children,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`px-4 py-3 align-middle text-surface-text ${className}`}
      {...rest}
    >
      {children}
    </td>
  )
}
>>>>>>> d447c1bd51ddea511737f8d1aba3e95f9f5695e2
