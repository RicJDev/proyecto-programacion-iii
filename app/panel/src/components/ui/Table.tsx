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
