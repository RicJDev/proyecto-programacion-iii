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

  function tabClass(tab: NavTab) {
    const isActive = activeTab === tab;
    return `cursor-pointer whitespace-nowrap border-b-[3px] px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
      isActive
        ? 'border-primary text-primary'
        : 'border-transparent text-text-muted hover:text-surface-text'
    }`;
  }

  return (
    <header className="border-b-2 border-primary bg-surface">
      {/* Barra superior de identidad y selector rápido de rol */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-alt px-6 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-wider text-primary">
            REPÚBLICA BOLIVARIANA DE VENEZUELA
          </span>
          <span className="text-border-strong">|</span>
          <span className="text-xs text-text-muted">
            Ministerio del Poder Popular para la Salud
          </span>
        </div>

        {/* Selector interactivo de rol para pruebas y demostración */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-text-muted">
            Probar como rol:
          </span>
          <select
            value={user?.role || 'admin_maestro'}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            className="cursor-pointer rounded-none border border-primary bg-surface px-2.5 py-1 text-xs font-bold text-primary outline-none"
          >
            <option value="admin_maestro">Administrador Maestro (Nacional)</option>
            <option value="admin_regional">Administrador Regional (Miranda)</option>
            <option value="admin_local">Administrador Local (Ambulatorio)</option>
            <option value="personal_inmunizador">Personal Inmunizador (Campo)</option>
          </select>

          {user && (
            <Button variant="ghost" size="sm" onClick={logout}>
              Cerrar Sesión
            </Button>
          )}
        </div>
      </div>

      {/* Franja Principal */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-primary">
            Sistema Nacional de Gestión y Seguimiento de Vacunas
          </h1>
          <p className="text-xs text-text-muted">
            Panel de Administración, Trazabilidad y Control Sanitario (RBAC)
          </p>
        </div>

        {/* Datos del usuario autenticado */}
        {user && (
          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="text-sm font-bold text-surface-text">{user.name}</div>
              <div className="text-xs text-text-muted">
                {user.centroSalud
                  ? `${user.centroSalud} (${user.region})`
                  : user.region
                  ? `Región ${user.region}`
                  : 'Nivel Central Nacional'}
              </div>
            </div>
            <Badge variant="primary">{roleLabels[user.role].split(' ')[0]}</Badge>
          </div>
        )}
      </div>

      {/* Pestañas de Navegación controladas por Permisos */}
      <nav className="flex overflow-x-auto border-t border-border bg-surface pl-6">
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          className={tabClass('dashboard')}
        >
          Dashboard y Métricas
        </button>

        {hasPermission(PERMISSIONS.RECIPIENTS_READ) && (
          <button
            type="button"
            onClick={() => onTabChange('recipients')}
            className={tabClass('recipients')}
          >
            Padrón de Pacientes
          </button>
        )}

        {hasPermission(PERMISSIONS.IMMUNIZATIONS_READ) && (
          <button
            type="button"
            onClick={() => onTabChange('immunization')}
            className={tabClass('immunization')}
          >
            Aplicación de Dosis
          </button>
        )}

        {(hasPermission(PERMISSIONS.CERTIFICATES_ISSUE) ||
          hasPermission(PERMISSIONS.CERTIFICATES_VERIFY)) && (
          <button
            type="button"
            onClick={() => onTabChange('certificates')}
            className={tabClass('certificates')}
          >
            Certificados Sanitarios (QR)
          </button>
        )}

        {hasPermission(PERMISSIONS.CENTERS_READ) && (
          <button
            type="button"
            onClick={() => onTabChange('centers')}
            className={tabClass('centers')}
          >
            Centros de Salud
          </button>
        )}

        {hasPermission(PERMISSIONS.INVENTORY_READ) && (
          <button
            type="button"
            onClick={() => onTabChange('inventory')}
            className={tabClass('inventory')}
          >
            Lotes y Vacunas
          </button>
        )}

        {hasPermission(PERMISSIONS.USERS_READ) && (
          <button
            type="button"
            onClick={() => onTabChange('users')}
            className={tabClass('users')}
          >
            Usuarios y Matriz RBAC
          </button>
        )}
      </nav>
    </header>
  );
}
