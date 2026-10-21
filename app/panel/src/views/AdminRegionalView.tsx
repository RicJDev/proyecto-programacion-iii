import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
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
import { globalUsers, healthCenters, regions, regionalKpis } from '../mockData'
import { centerStatusVariant, userStatusVariant } from '../lib/status'
import type { HealthCenter, SystemRole, SystemUser } from '../types'

const REGION_ID = 'r-01'

const TABS = [
  { id: 'centros', label: 'Centros de salud' },
  { id: 'admins', label: 'Administradores' },
]

const INVITE_ROLES: SystemRole[] = [
  'Administrador Regional',
  'Administrador Local',
  'Personal Inmunizador',
]

export function AdminRegionalView() {
  const region = regions.find((item) => item.id === REGION_ID)

  const [activeTab, setActiveTab] = useState('centros')
  const [centers, setCenters] = useState<HealthCenter[]>(
    healthCenters.filter((center) => center.regionId === REGION_ID),
  )
  const [admins, setAdmins] = useState<SystemUser[]>(
    globalUsers.filter((user) => user.region === region?.name),
  )
  const [assignTarget, setAssignTarget] = useState<HealthCenter | null>(null)
  const [candidateId, setCandidateId] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invite, setInvite] = useState({
    fullName: '',
    email: '',
    role: 'Administrador Local' as SystemRole,
  })

  const candidates = useMemo(
    () =>
      admins.filter(
        (user) =>
          user.status === 'activo' &&
          (user.role === 'Administrador Local' ||
            user.role === 'Personal Inmunizador'),
      ),
    [admins],
  )

  function adminName(adminId: string | null) {
    if (!adminId) return null
    return admins.find((user) => user.id === adminId)?.fullName ?? null
  }

  function confirmAssignment() {
    if (!assignTarget) return
    setCenters((previous) =>
      previous.map((center) =>
        center.id === assignTarget.id
          ? { ...center, adminId: candidateId || null }
          : center,
      ),
    )
    setAssignTarget(null)
    setCandidateId('')
  }

  function inviteAdmin() {
    const trimmedName = invite.fullName.trim()
    const trimmedEmail = invite.email.trim()
    if (!trimmedName || !trimmedEmail) return

    setAdmins((previous) => [
      ...previous,
      {
        id: `u-${String(previous.length + 1).padStart(3, '0')}`,
        fullName: trimmedName,
        email: trimmedEmail,
        document: '—',
        role: invite.role,
        region: region?.name ?? '—',
        status: 'pendiente',
        createdAt: '2026-10-20',
        lastAccess: '—',
      },
    ])
    setInvite({ fullName: '', email: '', role: 'Administrador Local' })
    setInviteOpen(false)
  }

  return (
    <div className='mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-widest text-primary'>
            GRS Miranda · Administración regional
          </p>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-surface-text'>
            Gerencia Regional de Salud — {region?.name}
          </h1>
          <p className='mt-1 text-sm text-text-muted'>
            {region?.code} · {region?.population.toLocaleString('es-VE')}{' '}
            habitantes · {region?.centers} centros en la red
          </p>
        </div>
        <Badge variant='info'>Cobertura {region?.coverage.toFixed(1)}%</Badge>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {regionalKpis.map((metric) => (
          <KPICard
            key={metric.id}
            metric={metric}
          />
        ))}
      </div>

      <Tabs
        tabs={TABS}
        value={activeTab}
        onChange={setActiveTab}
      >
        {activeTab === 'centros' && (
          <Card>
            <CardHeader
              title='Centros de salud de la región'
              subtitle='Gestión operativa y asignación de personal administrativo'
              actions={
                <Badge variant='neutral'>
                  {centers.filter((center) => center.adminId === null).length}{' '}
                  sin administrador
                </Badge>
              }
            />
            <Table className='border-0'>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Código</TableHeaderCell>
                  <TableHeaderCell>Centro de salud</TableHeaderCell>
                  <TableHeaderCell>Distrito</TableHeaderCell>
                  <TableHeaderCell>Administrador asignado</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                  <TableHeaderCell className='text-right'>
                    Acciones
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {centers.map((center) => {
                  const assigned = adminName(center.adminId)

                  return (
                    <TableRow key={center.id}>
                      <TableCell className='font-mono text-xs'>
                        {center.code}
                      </TableCell>
                      <TableCell>
                        <p className='font-semibold'>{center.name}</p>
                        <p className='text-[11px] text-text-muted'>
                          {center.address}
                        </p>
                      </TableCell>
                      <TableCell>{center.municipality}</TableCell>
                      <TableCell>
                        {assigned ? (
                          <span className='text-sm'>{assigned}</span>
                        ) : (
                          <Badge variant='warning'>Vacante</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={centerStatusVariant[center.status]}>
                          {center.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          size='sm'
                          variant={assigned ? 'outline' : 'primary'}
                          onClick={() => {
                            setAssignTarget(center)
                            setCandidateId(center.adminId ?? '')
                          }}
                        >
                          {assigned ? 'Reasignar' : 'Asignar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <CardFooter>
              <span className='text-[11px] text-text-muted'>
                {centers.length} centros listados en {region?.name}
              </span>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setActiveTab('admins')}
              >
                Ver administradores
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === 'admins' && (
          <Card>
            <CardHeader
              title='Administradores de la región'
              subtitle='Usuarios con acceso operativo bajo tu jurisdicción'
              actions={
                <Button
                  size='sm'
                  onClick={() => setInviteOpen(true)}
                >
                  + Invitar administrador
                </Button>
              }
            />
            <Table className='border-0'>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Usuario</TableHeaderCell>
                  <TableHeaderCell>Rol asignado</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                  <TableHeaderCell>Alta</TableHeaderCell>
                  <TableHeaderCell>Último acceso</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <p className='font-semibold'>{admin.fullName}</p>
                      <p className='text-[11px] text-text-muted'>
                        {admin.email}
                      </p>
                    </TableCell>
                    <TableCell>{admin.role}</TableCell>
                    <TableCell>
                      <Badge variant={userStatusVariant[admin.status]}>
                        {admin.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='font-mono text-xs'>
                      {admin.createdAt}
                    </TableCell>
                    <TableCell className='font-mono text-xs'>
                      {admin.lastAccess}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CardFooter>
              <span className='text-[11px] text-text-muted'>
                {admins.length} usuarios en la región
              </span>
            </CardFooter>
          </Card>
        )}
      </Tabs>

      <Modal
        open={assignTarget !== null}
        onClose={() => setAssignTarget(null)}
        title='Asignar administrador del centro'
        description={
          assignTarget
            ? `${assignTarget.code} · ${assignTarget.name}`
            : undefined
        }
        size='sm'
        footer={
          <>
            <Button
              variant='outline'
              onClick={() => setAssignTarget(null)}
            >
              Cancelar
            </Button>
            <Button
              variant='primary'
              onClick={confirmAssignment}
            >
              Confirmar asignación
            </Button>
          </>
        }
      >
        <Select
          label='Administrador local'
          name='candidato-admin'
          placeholder='Sin administrador asignado'
          options={candidates.map((user) => ({
            value: user.id,
            label: `${user.fullName} — ${user.role}`,
          }))}
          value={candidateId}
          onChange={(event) => setCandidateId(event.target.value)}
          hint='Solo personal activo de la región es elegible.'
        />
      </Modal>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title='Invitar nuevo administrador'
        description='Se enviará un correo de activación al usuario.'
        size='sm'
        footer={
          <>
            <Button
              variant='outline'
              onClick={() => setInviteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant='primary'
              onClick={inviteAdmin}
            >
              Enviar invitación
            </Button>
          </>
        }
      >
        <div className='space-y-4'>
          <Input
            label='Nombre completo'
            name='invitar-nombre'
            placeholder='Ej. Ana Torres Díaz'
            value={invite.fullName}
            onChange={(event) =>
              setInvite({ ...invite, fullName: event.target.value })
            }
            hint='Requerido para generar la invitación.'
          />
          <Input
            label='Correo institucional'
            name='invitar-correo'
            type='email'
            placeholder='usuario@gob.ve'
            value={invite.email}
            onChange={(event) =>
              setInvite({ ...invite, email: event.target.value })
            }
            hint='Dominio institucional requerido.'
          />
          <Select
            label='Rol a otorgar'
            name='invitar-rol'
            options={INVITE_ROLES.map((role) => ({ value: role, label: role }))}
            value={invite.role}
            onChange={(event) =>
              setInvite({ ...invite, role: event.target.value as SystemRole })
            }
          />
        </div>
      </Modal>
    </div>
  )
}
