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

