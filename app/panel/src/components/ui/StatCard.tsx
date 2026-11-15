interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  tag?: string;
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  tag,
  accentColor = 'var(--color-primary)',
}: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderLeft: `5px solid ${accentColor}`,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontSize: '0.775rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        {tag && (
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-surface-muted)',
              padding: '0.15rem 0.4rem',
              border: '1px solid var(--color-border)',
            }}
          >
            {tag}
          </span>
        )}
      </div>

      <div style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text)' }}>
          {value}
        </span>
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

