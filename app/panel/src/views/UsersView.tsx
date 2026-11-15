import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS, ROLE_PERMISSIONS, type UserRole } from '../types/permissions';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { DEMO_USERS } from '../data/mockData';
import type { UserSession } from '../types/models';

export function UsersView() {
  const { user, hasPermission } = useAuth();
  const [users, setUsers] = useState<UserSession[]>(Object.values(DEMO_USERS));
  const [activeTab, setActiveTab] = useState<'users' | 'matrix'>('users');

  // Modal para crear usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [targetRole, setTargetRole] = useState<UserRole>('personal_inmunizador');
  const [region, setRegion] = useState('Miranda');
  const [centroSalud, setCentroSalud] = useState('Ambulatorio La Victoria');

  const canCreate = hasPermission(PERMISSIONS.USERS_CREATE);
  const canSuspend = hasPermission(PERMISSIONS.USERS_SUSPEND);
  const canManageRoles = hasPermission(PERMISSIONS.ROLES_MANAGE);

  function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: UserSession = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      cedula: cedula.trim().toUpperCase() || 'V-00000000',
      role: targetRole,
      region,
      centroSalud,
      permissions: ROLE_PERMISSIONS[targetRole],
    };

    setUsers([...users, newUser]);
    setIsModalOpen(false);

    setName('');
    setEmail('');
    setCedula('');
  }

  function toggleSuspend(userId: string) {
    if (!canSuspend) return;
    setUsers(users.filter((u) => u.id !== userId));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-surface-text">Gestión de Usuarios y Matriz de Permisos (RBAC)</h2>
          <p className="text-sm text-text-muted">
            Control de cuentas del personal sanitario y matriz de autorización según docs/permissions.md.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={activeTab === 'users' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            Directorio de Usuarios
          </Button>
          <Button
            variant={activeTab === 'matrix' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('matrix')}
          >
            Matriz de Permisos RBAC
          </Button>

          {canCreate && (
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              + Alta de Usuario
            </Button>
          )}
        </div>
      </div>

      {activeTab === 'users' ? (
        <Card>
          <CardHeader
            title="Cuentas de Personal Sanitario Habilitadas"
            subtitle="Usuarios con acceso activo al sistema y sus respectivos roles asignados"
          />
          <CardBody className="p-0">
            <Table headers={['Nombre y Cédula', 'Correo Institucional', 'Rol Jerárquico', 'Jurisdicción', 'Total Permisos', 'Acciones']}>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <strong className="font-semibold">{u.name}</strong>
                    <div className="text-xs text-text-muted">{u.cedula}</div>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.role === 'admin_maestro'
                          ? 'primary'
                          : u.role === 'admin_regional'
                          ? 'secondary'
                          : u.role === 'admin_local'
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {u.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {u.centroSalud || u.region || 'Ámbito Nacional (Central)'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">{u.permissions.length} permisos</Badge>
                  </TableCell>
                  <TableCell>
                    {canSuspend ? (
                      <Button size="sm" variant="danger" onClick={() => toggleSuspend(u.id)}>
                        Suspender
                      </Button>
                    ) : (
                      <span className="text-xs text-text-muted">Solo lectura</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader
            title="Matriz Oficial de Permisos del Sistema (docs/permissions.md)"
            subtitle="Validación en tiempo de compilación y ejecución de los 23 permisos por rol"
            action={
              <Badge variant={canManageRoles ? 'primary' : 'neutral'}>
                {canManageRoles ? 'Gestor Maestro: Edición y Asignación Habilitada' : 'Consulta Informativa'}
              </Badge>
            }
          />
          <CardBody className="p-0">
            <Table headers={['Permiso (permission_name)', 'Administrador Maestro', 'Administrador Regional', 'Administrador Local', 'Personal Inmunizador']}>
              {Object.values(PERMISSIONS).map((perm) => (
                <TableRow key={perm}>
                  <TableCell>
                    <code className="font-mono text-xs">{perm}</code>
                  </TableCell>
                  <TableCell className="text-center">
                    {ROLE_PERMISSIONS.admin_maestro.includes(perm) ? (
                      <span className="font-bold text-success">Permitido</span>
                    ) : (
                      <span className="text-border-strong">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {ROLE_PERMISSIONS.admin_regional.includes(perm) ? (
                      <span className="font-bold text-success">Permitido</span>
                    ) : (
                      <span className="text-border-strong">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {ROLE_PERMISSIONS.admin_local.includes(perm) ? (
                      <span className="font-bold text-success">Permitido</span>
                    ) : (
                      <span className="text-border-strong">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {ROLE_PERMISSIONS.personal_inmunizador.includes(perm) ? (
                      <span className="font-bold text-success">Permitido</span>
                    ) : (
                      <span className="text-border-strong">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </CardBody>
        </Card>
      )}

      {/* Modal de Alta de Usuario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Alta de Cuenta Institucional"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateUser}>
              Crear Usuario
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nombre y Apellido"
              required
              placeholder="Dr. Carlos Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Cédula de Identidad"
              placeholder="V-14555999"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Correo Institucional"
              type="email"
              required
              placeholder="csilva@salud.gob"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Select
              label="Rol a Asignar (RBAC)"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as UserRole)}
            >
              {canManageRoles && (
                <>
                  <option value="admin_regional">Administrador Regional</option>
                  <option value="admin_local">Administrador Local</option>
                </>
              )}
              {user?.role === 'admin_regional' && (
                <option value="admin_local">Administrador Local</option>
              )}
              <option value="personal_inmunizador">Personal Inmunizador</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Estado / Región Asignada"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <Input
              label="Centro de Salud Asignado"
              value={centroSalud}
              onChange={(e) => setCentroSalud(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
