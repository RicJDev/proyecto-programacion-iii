import { useAuth } from '../../context/AuthContext';
import { PERMISSIONS, type UserRole } from '../../types/permissions';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export type NavTab =
  | 'dashboard'
  | 'recipients'
  | 'immunization'
  | 'certificates'
  | 'centers'
  | 'inventory'
  | 'users';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { user, switchRole, logout, hasPermission } = useAuth();

  const roleLabels: Record<UserRole, string> = {
    admin_maestro: 'Administrador Maestro (Ministerio)',
    admin_regional: 'Administrador Regional (SACS)',
    admin_local: 'Administrador Local (Centro de Salud)',
    personal_inmunizador: 'Personal Inmunizador (Campo)',
  };

  return (
    <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: '2px solid var(--color-primary)' }}>
      {/* Barra superior de identidad y selector rápido de rol */}
      <div
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-muted)',
          padding: '0.5rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
            REPÚBLICA BOLIVARIANA DE VENEZUELA
          </span>
          <span style={{ color: 'var(--color-border-dark)' }}>|</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Ministerio del Poder Popular para la Salud
          </span>
        </div>

        {/* Selector interactivo de rol para pruebas y demostración */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Probar como rol:
          </span>
          <select
            value={user?.role || 'admin_maestro'}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          >
            <option value="admin_maestro">👑 Administrador Maestro (Nacional)</option>
            <option value="admin_regional">🌐 Administrador Regional (Miranda)</option>
            <option value="admin_local">🏥 Administrador Local (Ambulatorio)</option>
            <option value="personal_inmunizador">💉 Personal Inmunizador (Campo)</option>
          </select>

          {user && (
            <Button variant="ghost" size="sm" onClick={logout} style={{ fontSize: '0.75rem' }}>
              Cerrar Sesión
            </Button>
          )}
        </div>
      </div>

      {/* Franja Principal */}
      <div
        style={{
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0 }}>
            Sistema Nacional de Gestión y Seguimiento de Vacunas
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Panel de Administración, Trazabilidad y Control Sanitario (RBAC)
          </p>
        </div>

        {/* Datos del usuario autenticado */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {user.centroSalud ? `${user.centroSalud} (${user.region})` : user.region ? `Región ${user.region}` : 'Nivel Central Nacional'}
              </div>
            </div>
            <Badge variant="primary">{roleLabels[user.role].split(' ')[0]}</Badge>
          </div>
        )}
      </div>

      {/* Pestañas de Navegación controladas por Permisos */}
      <nav
        style={{
          display: 'flex',
          overflowX: 'auto',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--color-border)',
          paddingLeft: '1.5rem',
        }}
      >
        <button
          onClick={() => onTabChange('dashboard')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'dashboard' ? '3px solid var(--color-primary)' : '3px solid transparent',
            fontWeight: activeTab === 'dashboard' ? 700 : 500,
            color: activeTab === 'dashboard' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
          }}
        >
          📊 Dashboard & Métricas
        </button>

        {hasPermission(PERMISSIONS.RECIPIENTS_READ) && (
          <button
            onClick={() => onTabChange('recipients')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'recipients' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: activeTab === 'recipients' ? 700 : 500,
              color: activeTab === 'recipients' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            👥 Padrón de Pacientes
          </button>
        )}

        {hasPermission(PERMISSIONS.IMMUNIZATIONS_READ) && (
          <button
            onClick={() => onTabChange('immunization')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'immunization' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: activeTab === 'immunization' ? 700 : 500,
              color: activeTab === 'immunization' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            💉 Aplicación de Dosis
          </button>
        )}

        {(hasPermission(PERMISSIONS.CERTIFICATES_ISSUE) || hasPermission(PERMISSIONS.CERTIFICATES_VERIFY)) && (
          <button
            onClick={() => onTabChange('certificates')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'certificates' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: activeTab === 'certificates' ? 700 : 500,
              color: activeTab === 'certificates' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            📜 Certificados Sanitarios (QR)
          </button>
        )}

        {hasPermission(PERMISSIONS.CENTERS_READ) && (
          <button
            onClick={() => onTabChange('centers')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'centers' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: activeTab === 'centers' ? 700 : 500,
              color: activeTab === 'centers' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            🏥 Centros de Salud
          </button>
        )}

        {hasPermission(PERMISSIONS.INVENTORY_READ) && (
          <button
            onClick={() => onTabChange('inventory')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'inventory' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: activeTab === 'inventory' ? 700 : 500,
              color: activeTab === 'inventory' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            📦 Lotes & Vacunas
          </button>
        )}

        {hasPermission(PERMISSIONS.USERS_READ) && (
          <button
            onClick={() => onTabChange('users')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid var(--color-primary)' : '3px solid transparent',
              fontWeight: activeTab === 'users' ? 700 : 500,
              color: activeTab === 'users' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            🔐 Usuarios & Matriz RBAC
          </button>
        )}
      </nav>
    </header>
  );
}

