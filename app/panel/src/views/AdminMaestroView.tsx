import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
  KPICard,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
} from '../components/ui'
import { globalUsers, nationalKpis, regions } from '../mockData'
import { userStatusVariant } from '../lib/status'
import type { SystemUser, SystemRole, UserStatus } from '../types'

const TABS = [
  { id: 'resumen', label: 'Resumen nacional' },
  { id: 'usuarios', label: 'Usuarios globales', count: globalUsers.length },
  { id: 'regiones', label: 'Regiones', count: regions.length },
]

const ROLE_OPTIONS = [
  { value: '', label: 'Todos los roles' },
  { value: 'Administrador Maestro', label: 'Administrador Maestro' },
  { value: 'Administrador Regional', label: 'Administrador Regional' },
  { value: 'Administrador Local', label: 'Administrador Local' },
  { value: 'Personal Inmunizador', label: 'Personal Inmunizador' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'pendiente', label: 'Pendiente' },
]

function IconFlag() {
  return (
    <svg
      className='h-5 w-5'
      viewBox='0 0 20 20'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M4 3V17M4 4H14L12 7L14 10H4'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  )
}

function IconChart() {
  return (
    <svg
      className='h-5 w-5'
      viewBox='0 0 20 20'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M3 17H17M6 14V9M10 14V5M14 14V11'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  )
}

function IconCenters() {
  return (
    <svg
      className='h-5 w-5'
      viewBox='0 0 20 20'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M3 17V7L10 3L17 7V17H3ZM8 17V12H12V17'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  )
}

function IconAlert() {
  return (
    <svg
      className='h-5 w-5'
      viewBox='0 0 20 20'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M10 3L18 17H2L10 3ZM10 8V12M10 14.5V15'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  )
}

const KPI_ICONS = [IconFlag, IconChart, IconCenters, IconAlert]

function coverageTone(coverage: number) {
  if (coverage >= 85) return 'success'
  if (coverage >= 80) return 'warning'
  return 'danger'
}

export function AdminMaestroView() {
  const [activeTab, setActiveTab] = useState('resumen')
  const [users, setUsers] = useState<SystemUser[]>(globalUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editing, setEditing] = useState<SystemUser | null>(null)

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesTerm =
        !term ||
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.document.includes(term)
      const matchesRole = !roleFilter || user.role === roleFilter
      const matchesStatus = !statusFilter || user.status === statusFilter

      return matchesTerm && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  function saveUser() {
    if (!editing) return
    setUsers((previous) =>
      previous.map((user) => (user.id === editing.id ? editing : user)),
    )
    setEditing(null)
  }

  return (
    <div className='mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight text-surface-text'>
            Panel Nacional — MPPS · Programa Ampliado de Inmunizaciones
          </h1>
          <p className='mt-1 text-sm text-text-muted'>
            Supervisión global del programa de inmunización, usuarios y
            administración territorial.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='info'>Datos simulados</Badge>
          <Badge variant='neutral'>
            Última sincronización: 20/10/2026 08:40
          </Badge>
        </div>
      </div>

      <Tabs
        tabs={TABS}
        value={activeTab}
        onChange={setActiveTab}
      >
        {activeTab === 'resumen' && (
          <div className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              {nationalKpis.map((metric, index) => {
                const Icon = KPI_ICONS[index] ?? IconChart

                return (
                  <KPICard
                    key={metric.id}
                    metric={metric}
                    icon={<Icon />}
                  />
                )
              })}
            </div>

            <Card>
              <CardHeader
                title='Cobertura de esquema completo por región'
                subtitle='Avance frente a la meta institucional del 90%'
              />
              <CardContent className='space-y-4 px-0 py-0'>
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className='border-b border-border px-5 py-3 last:border-b-0'
                  >
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <p className='text-sm font-semibold text-surface-text'>
                        {region.name}{' '}
                        <span className='font-normal text-text-muted'>
                          · {region.code}
                        </span>
                      </p>
                      <Badge variant={coverageTone(region.coverage)}>
                        {region.coverage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className='mt-2 h-2 w-full bg-secondary-soft'>
                      <div
                        className='h-2 bg-primary'
                        style={{ width: `${region.coverage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <span className='text-[11px] text-text-muted'>
                  5 gerencias regionales monitoreadas · 100 centros reportando
                </span>
                <Button
                  variant='outline'
                  size='sm'
                >
                  Exportar reporte
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <Card>
            <CardHeader
              title='Administración de usuarios globales'
              subtitle='Alta, baja y modificación de accesos en todo el territorio'
            />
            <CardContent className='grid gap-3 border-b border-border sm:grid-cols-3'>
              <Input
                label='Buscar'
                name='busqueda-usuarios'
                placeholder='Nombre, correo o documento…'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Select
                label='Rol'
                name='rol-usuario'
                options={ROLE_OPTIONS}
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              />
              <Select
                label='Estado'
                name='estado-usuario'
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              />
            </CardContent>

            <div className='px-5 py-4'>
              <Table className='border-0'>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Usuario</TableHeaderCell>
                    <TableHeaderCell>Rol</TableHeaderCell>
                    <TableHeaderCell>Región</TableHeaderCell>
                    <TableHeaderCell>Estado</TableHeaderCell>
                    <TableHeaderCell>Último acceso</TableHeaderCell>
                    <TableHeaderCell className='text-right'>
                      Acciones
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <p className='font-semibold'>{user.fullName}</p>
                        <p className='text-[11px] text-text-muted'>
                          {user.email} · C.I. {user.document}
                        </p>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.region}</TableCell>
                      <TableCell>
                        <Badge variant={userStatusVariant[user.status]}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='font-mono text-xs'>
                        {user.lastAccess}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='inline-flex gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => setEditing(user)}
                          >
                            Editar
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() =>
                              setUsers((previous) =>
                                previous.map((item) =>
                                  item.id === user.id
                                    ? {
                                        ...item,
                                        status: 'inactivo' as UserStatus,
                                      }
                                    : item,
                                ),
                              )
                            }
                          >
                            Suspender
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='py-8 text-center text-text-muted'
                      >
                        No se encontraron usuarios con los filtros aplicados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <CardFooter>
              <span className='text-[11px] text-text-muted'>
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </span>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  disabled
                >
                  Anterior
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  disabled
                >
                  Siguiente
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {activeTab === 'regiones' && (
          <Card>
            <CardHeader
              title='Regiones bajo cobertura del sistema'
              subtitle='Información territorial consolidada por red asistencial'
            />
            <Table className='border-0'>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Región</TableHeaderCell>
                  <TableHeaderCell>Código</TableHeaderCell>
                  <TableHeaderCell>Centros</TableHeaderCell>
                  <TableHeaderCell>Población objetivo</TableHeaderCell>
                  <TableHeaderCell>Cobertura</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {regions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell className='font-semibold'>
                      {region.name}
                    </TableCell>
                    <TableCell className='font-mono text-xs'>
                      {region.code}
                    </TableCell>
                    <TableCell>{region.centers}</TableCell>
                    <TableCell>
                      {region.population.toLocaleString('es-VE')}
                    </TableCell>
                    <TableCell className='font-semibold'>
                      {region.coverage.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant={coverageTone(region.coverage)}>
                        {coverageTone(region.coverage) === 'success'
                          ? 'En meta'
                          : coverageTone(region.coverage) === 'warning'
                            ? 'En seguimiento'
                            : 'Crítica'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </Tabs>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title='Editar usuario del sistema'
        description={editing ? `Identificador ${editing.id}` : undefined}
        footer={
          <>
            <Button
              variant='outline'
              onClick={() => setEditing(null)}
            >
              Cancelar
            </Button>
            <Button
              variant='primary'
              onClick={saveUser}
            >
              Guardar cambios
            </Button>
          </>
        }
      >
        {editing ? (
          <div className='grid gap-4 sm:grid-cols-2'>
            <Input
              label='Nombre completo'
              name='editar-nombre'
              value={editing.fullName}
              onChange={(event) =>
                setEditing({ ...editing, fullName: event.target.value })
              }
            />
            <Input
              label='Correo institucional'
              name='editar-correo'
              type='email'
              value={editing.email}
              onChange={(event) =>
                setEditing({ ...editing, email: event.target.value })
              }
            />
            <Select
              label='Rol'
              name='editar-rol'
              options={ROLE_OPTIONS.filter((option) => option.value)}
              value={editing.role}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  role: event.target.value as SystemRole,
                })
              }
            />
            <Select
              label='Estado'
              name='editar-estado'
              options={STATUS_OPTIONS.filter((option) => option.value)}
              value={editing.status}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  status: event.target.value as UserStatus,
                })
              }
            />
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
