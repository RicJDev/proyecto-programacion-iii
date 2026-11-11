import { Badge, Select } from '../ui'
import type { RoleId, RoleProfile } from '../../types'
import { roleProfiles } from '../../mockData'

export interface AppHeaderProps {
  profile: RoleProfile
  activeRole: RoleId
  onRoleChange: (role: RoleId) => void
}

function BrandMark() {
  return (
    <svg
      className='h-9 w-9 text-primary'
      viewBox='0 0 36 36'
      fill='none'
      aria-hidden='true'
    >
      <rect
        x='1'
        y='1'
        width='34'
        height='34'
        stroke='currentColor'
        strokeWidth='2'
      />
      <path
        d='M18 8V28M8 18H28'
        stroke='currentColor'
        strokeWidth='4'
      />
    </svg>
  )
}

export function AppHeader({
  profile,
  activeRole,
  onRoleChange,
}: AppHeaderProps) {
  return (
    <header className='sticky top-0 z-40 border-b border-border bg-surface'>
      <div className='bg-primary text-primary-foreground'>
        <div className='mx-auto flex min-h-8 max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1 text-[10px] font-semibold uppercase tracking-widest sm:px-6'>
          <span>
            República Bolivariana de Venezuela · Ministerio del Poder Popular
            para la Salud
          </span>
          <span className='hidden sm:inline'>
            Sistema Nacional de Gestión y Seguimiento de Vacunas
          </span>
        </div>
      </div>

      <div className='mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6'>
        <div className='flex items-center gap-3'>
          <BrandMark />
          <div className='border-l border-border pl-3'>
            <p className='text-sm font-bold uppercase tracking-widest text-surface-text'>
              SIGEV
            </p>
            <p className='text-[11px] text-text-muted'>
              {profile.scope} · {profile.organization}
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <Badge
            variant='info'
            size='sm'
          >
            Modo desarrollo
          </Badge>
          <div className='flex flex-wrap items-center gap-2 border border-dashed border-info/60 bg-info-soft px-3 py-2'>
            <label
              className='text-[10px] font-bold uppercase tracking-widest text-info'
              htmlFor='dev-role-switcher'
            >
              Rol activo
            </label>
            <Select
              id='dev-role-switcher'
              aria-label='Cambiar rol activo sin autenticación'
              className='w-52 [&_select]:h-7 [&_select]:border-info/40 [&_select]:text-xs [&_select]:font-semibold'
              value={activeRole}
              options={roleProfiles.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
              onChange={(event) => onRoleChange(event.target.value as RoleId)}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export interface AppFooterProps {
  profile: RoleProfile
}

export function AppFooter({ profile }: AppFooterProps) {
  return (
    <footer className='border-t border-border bg-surface'>
      <div className='mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11px] text-text-muted sm:px-6'>
        <span>
          © 2026 SIGEV — Datos simulados con fines académicos. Módulo público
          «Tu Tarjeta»: app independiente{' '}
          <code className='font-mono font-semibold'>app/tu-tarjeta</code>.
        </span>
        <span>
          Sesión activa:{' '}
          <strong className='font-semibold'>{profile.label}</strong>
        </span>
      </div>
    </footer>
  )
}
