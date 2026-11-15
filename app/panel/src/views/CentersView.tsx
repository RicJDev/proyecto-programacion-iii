import { useState, useMemo, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../types/permissions';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { INITIAL_CENTERS } from '../data/mockData';
import { VENEZUELA_STATES } from '../data/venezuela';
import type { HealthCenter } from '../types/models';

export function CentersView() {
  const { user, hasPermission } = useAuth();
  const [centers, setCenters] = useState<HealthCenter[]>(INITIAL_CENTERS);
  const [filterType, setFilterType] = useState<string>('todos');

  // Modal para registrar centro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<HealthCenter['type']>('ambulatorio');
  const [address, setAddress] = useState('');
  const [sector, setSector] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Cascada territorial
  const [selectedStateId, setSelectedStateId] = useState(VENEZUELA_STATES[0].id);
  const selectedState = useMemo(
    () => VENEZUELA_STATES.find((s) => s.id === selectedStateId) || VENEZUELA_STATES[0],
    [selectedStateId]
  );
  const [selectedMunId, setSelectedMunId] = useState(selectedState.municipalities[0].id);
  const selectedMunicipality = useMemo(
    () =>
      selectedState.municipalities.find((m) => m.id === selectedMunId) ||
      selectedState.municipalities[0],
    [selectedState, selectedMunId]
  );
  const [selectedParishName, setSelectedParishName] = useState(
    selectedMunicipality.parishes[0]?.name || ''
  );

  const canCreate = hasPermission(PERMISSIONS.CENTERS_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.CENTERS_UPDATE);

  const filteredCenters = useMemo(() => {
    let list = centers;
    // Si es Administrador Regional, solo ve los centros de su estado asignado
    if (user?.role === 'admin_regional' && user.region) {
      list = list.filter((c) => c.state.toLowerCase() === user.region?.toLowerCase());
    }
    if (filterType !== 'todos') {
      list = list.filter((c) => c.type === filterType);
    }
    return list;
  }, [centers, filterType, user]);

  function handleCreateCenter(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !address.trim()) return;

    const newCenter: HealthCenter = {
      id: Date.now(),
      code: code.trim().toUpperCase(),
      name: name.trim(),
      type,
      address: address.trim(),
      sector: sector.trim() || 'Central',
      state: selectedState.name,
      municipality: selectedMunicipality.name,
      parish: selectedParishName,
      status: 'activo',
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
    };

    setCenters([newCenter, ...centers]);
    setIsModalOpen(false);

    setCode('');
    setName('');
    setAddress('');
    setSector('');
    setPhone('');
    setEmail('');
  }

  function toggleStatus(centerId: number) {
    if (!canUpdate) return;
    setCenters(
      centers.map((c) => {
        if (c.id === centerId) {
          return {
            ...c,
            status: c.status === 'activo' ? 'inactivo' : 'activo',
          };
        }
        return c;
      })
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>Infraestructura de Centros de Salud</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Registro, habilitación y administración de ambulatorios, hospitales y CDI a nivel territorial.
          </p>
        </div>

        {canCreate && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Dar de Alta Centro de Salud
          </Button>
        )}
      </div>

      <Card>
        <CardHeader
          title="Directorio de Establecimientos de Salud Habilitados"
          subtitle={`Total de centros disponibles: ${filteredCenters.length}`}
          action={
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Filtrar tipo:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--color-border)', outline: 'none' }}
              >
                <option value="todos">Todos los tipos</option>
                <option value="ambulatorio">Ambulatorio</option>
                <option value="hospital">Hospital</option>
                <option value="cdi">CDI</option>
                <option value="clinica_popular">Clínica Popular</option>
              </select>
            </div>
          }
        />
        <CardBody style={{ padding: 0 }}>
          <Table headers={['Código Sanitario', 'Denominación', 'Tipo', 'Jurisdicción Territorial', 'Dirección', 'Estatus', 'Acciones']}>
            {filteredCenters.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <code>{c.code}</code>
                </TableCell>
                <TableCell>
                  <strong>{c.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Sector: {c.sector}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="primary">{c.type.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  {c.state} — {c.municipality} ({c.parish})
                </TableCell>
                <TableCell>{c.address}</TableCell>
                <TableCell>
                  <Badge variant={c.status === 'activo' ? 'success' : 'danger'}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {canUpdate ? (
                    <Button
                      size="sm"
                      variant={c.status === 'activo' ? 'danger' : 'secondary'}
                      onClick={() => toggleStatus(c.id)}
                    >
                      {c.status === 'activo' ? 'Suspender' : 'Reactivar'}
                    </Button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Solo lectura</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardBody>
      </Card>

      {/* Modal de Registro de Centro */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Alta de Infraestructura de Salud"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateCenter}>
              Registrar Centro
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateCenter}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Input
              label="Código Sanitario Único (ej. CS-MIR-002)"
              required
              placeholder="CS-MIR-002"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Select
              label="Tipo de Establecimiento"
              value={type}
              onChange={(e) => setType(e.target.value as HealthCenter['type'])}
            >
              <option value="ambulatorio">Ambulatorio</option>
              <option value="hospital">Hospital</option>
              <option value="cdi">CDI</option>
              <option value="clinica_popular">Clínica Popular</option>
              <option value="punto_vacunacion_movil">Punto de Vacunación Móvil</option>
            </Select>
          </div>

          <Input
            label="Nombre Completo del Centro"
            required
            placeholder="Centro de Diagnóstico Integral Dr. Rafael Rangel"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <Select
              label="1. Estado"
              value={selectedStateId}
              onChange={(e) => {
                setSelectedStateId(e.target.value);
                const st = VENEZUELA_STATES.find((s) => s.id === e.target.value);
                if (st && st.municipalities.length > 0) {
                  setSelectedMunId(st.municipalities[0].id);
                  setSelectedParishName(st.municipalities[0].parishes[0]?.name || '');
                }
              }}
            >
              {VENEZUELA_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>

            <Select
              label="2. Municipio"
              value={selectedMunId}
              onChange={(e) => {
                setSelectedMunId(e.target.value);
                const mun = selectedState.municipalities.find((m) => m.id === e.target.value);
                if (mun && mun.parishes.length > 0) {
                  setSelectedParishName(mun.parishes[0]?.name || '');
                }
              }}
            >
              {selectedState.municipalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>

            <Select
              label="3. Parroquia"
              value={selectedParishName}
              onChange={(e) => setSelectedParishName(e.target.value)}
            >
              {selectedMunicipality.parishes.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Input
              label="Dirección Física"
              required
              placeholder="Av. Francisco de Miranda"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              label="Sector / Caserío"
              placeholder="Casco Urbano"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Input
              label="Teléfono de Contacto"
              placeholder="0212-000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Correo Institucional"
              type="email"
              placeholder="centro@salud.gob"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

