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
import { INITIAL_RECIPIENTS, INITIAL_IMMUNIZATIONS } from '../data/mockData';
import { VENEZUELA_STATES } from '../data/venezuela';
import type { Recipient } from '../types/models';

export function RecipientsView() {
  const { hasPermission } = useAuth();
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(INITIAL_RECIPIENTS[0]);

  // Modal de nuevo registro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNac, setFechaNac] = useState('');
  const [genero, setGenero] = useState<'M' | 'F'>('M');
  const [telefono, setTelefono] = useState('');
  const [sector, setSector] = useState('');

  // Cascada territorial de Venezuela
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

  const canCreate = hasPermission(PERMISSIONS.RECIPIENTS_CREATE);

  // Filtrado de pacientes
  const filteredRecipients = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return recipients;
    return recipients.filter(
      (r) =>
        r.identification_number.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.last_name.toLowerCase().includes(q)
    );
  }, [recipients, searchQuery]);

  // Historial de dosis del paciente seleccionado
  const patientDoses = useMemo(() => {
    if (!selectedRecipient) return [];
    return INITIAL_IMMUNIZATIONS.filter((imm) => imm.recipientId === selectedRecipient.id);
  }, [selectedRecipient]);

  function handleStateChange(stateId: string) {
    setSelectedStateId(stateId);
    const st = VENEZUELA_STATES.find((s) => s.id === stateId);
    if (st && st.municipalities.length > 0) {
      setSelectedMunId(st.municipalities[0].id);
      setSelectedParishName(st.municipalities[0].parishes[0]?.name || '');
    }
  }

  function handleMunChange(munId: string) {
    setSelectedMunId(munId);
    const mun = selectedState.municipalities.find((m) => m.id === munId);
    if (mun && mun.parishes.length > 0) {
      setSelectedParishName(mun.parishes[0]?.name || '');
    }
  }

  function handleRegisterPatient(e: FormEvent) {
    e.preventDefault();
    if (!cedula.trim() || !nombre.trim() || !apellido.trim()) return;

    const newRec: Recipient = {
      id: Date.now(),
      identification_number: cedula.trim().toUpperCase(),
      name: nombre.trim(),
      last_name: apellido.trim(),
      birthDate: fechaNac || '2000-01-01',
      gender: genero,
      state: selectedState.name,
      municipality: selectedMunicipality.name,
      parish: selectedParishName,
      sector: sector.trim() || 'Casco Central',
      phone: telefono.trim(),
    };

    setRecipients([newRec, ...recipients]);
    setSelectedRecipient(newRec);
    setIsModalOpen(false);

    // Reset form
    setCedula('');
    setNombre('');
    setApellido('');
    setTelefono('');
    setSector('');
  }

  return (
    <div>
      {/* Barra superior de acciones */}
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
          <h2 style={{ fontSize: '1.4rem' }}>Padrón y Consulta de Ciudadanos</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Búsqueda centralizada y registro de pacientes conforme al Módulo Operativo de Centro de Salud.
          </p>
        </div>

        {canCreate && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Registrar Nuevo Ciudadano
          </Button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
        {/* Panel Izquierdo: Buscador y Lista de Pacientes */}
        <Card>
          <CardHeader
            title="1. Búsqueda de Paciente en el Padrón"
            subtitle="Filtro rápido por Cédula de Identidad o Nombre"
          />
          <CardBody>
            <Input
              placeholder="Ej: V-20000003 o Carlos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />

            <Table headers={['Cédula', 'Nombre y Apellido', 'Ubicación']} isEmpty={filteredRecipients.length === 0}>
              {filteredRecipients.map((r) => {
                const isSelected = selectedRecipient?.id === r.id;
                return (
                  <TableRow
                    key={r.id}
                    onClick={() => setSelectedRecipient(r)}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <TableCell>
                      <code>{r.identification_number}</code>
                    </TableCell>
                    <TableCell>
                      <strong>
                        {r.name} {r.last_name}
                      </strong>
                    </TableCell>
                    <TableCell>
                      {r.state} ({r.parish})
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </CardBody>
        </Card>

        {/* Panel Derecho: Expediente Clínico de Inmunización */}
        <div>
          {selectedRecipient ? (
            <Card>
              <CardHeader
                title={`Expediente: ${selectedRecipient.name} ${selectedRecipient.last_name}`}
                subtitle={`Cédula: ${selectedRecipient.identification_number} | Fecha Nac: ${selectedRecipient.birthDate}`}
                action={
                  <Badge variant="primary">
                    {selectedRecipient.gender === 'M' ? 'MASCULINO' : 'FEMENINO'}
                  </Badge>
                }
              />
              <CardBody>
                {/* Metadatos territoriales del paciente */}
                <div
                  style={{
                    backgroundColor: 'var(--color-surface-muted)',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <strong>Estado / Municipio:</strong> {selectedRecipient.state} — {selectedRecipient.municipality}
                  </div>
                  <div>
                    <strong>Parroquia / Sector:</strong> {selectedRecipient.parish} — {selectedRecipient.sector}
                  </div>
                  <div>
                    <strong>Teléfono:</strong> {selectedRecipient.phone || 'No registrado'}
                  </div>
                  {selectedRecipient.parentName && (
                    <div>
                      <strong>Tutor Legal:</strong> {selectedRecipient.parentName} ({selectedRecipient.parentRelationship})
                    </div>
                  )}
                </div>

                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>
                  Historial de Dosis Administradas (`IMMUNIZATION`)
                </h4>

                <Table
                  headers={['Vacuna', 'Lote', 'Dosis / Refuerzo', 'Fecha', 'Centro Emisor']}
                  isEmpty={patientDoses.length === 0}
                  emptyMessage="No registra dosis previas en este centro o en el historial unificado."
                >
                  {patientDoses.map((dose) => (
                    <TableRow key={dose.id}>
                      <TableCell>
                        <strong>{dose.vaccineName}</strong>
                      </TableCell>
                      <TableCell>
                        <code>{dose.batchNumber}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{dose.doseType}</Badge>
                      </TableCell>
                      <TableCell>{dose.dateTime}</TableCell>
                      <TableCell>{dose.centerName}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  Seleccione un paciente de la lista para inspeccionar su carnet de vacunación y expediente territorial.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Modal para Registro Rápido con Cascada Geográfica venezolana (linux.html) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="2. Registro de Nuevo Ciudadano en el Sistema"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleRegisterPatient}>
              Guardar y Dar de Alta
            </Button>
          </>
        }
      >
        <form onSubmit={handleRegisterPatient}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Input
              label="Cédula de Identidad (V-XXXXXXXX)"
              required
              placeholder="V-25123456"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
            <Select
              label="Sexo"
              value={genero}
              onChange={(e) => setGenero(e.target.value as 'M' | 'F')}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </Select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Input
              label="Nombres"
              required
              placeholder="Juan Alberto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Input
              label="Apellidos"
              required
              placeholder="Pérez Gómez"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Input
              label="Fecha de Nacimiento"
              type="date"
              required
              value={fechaNac}
              onChange={(e) => setFechaNac(e.target.value)}
            />
            <Input
              label="Teléfono de Contacto"
              placeholder="0412-1234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          {/* Desplegables de Cascada Geográfica */}
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
              Ubicación Territorial y Domicilio
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <Select
                label="1. Estado"
                value={selectedStateId}
                onChange={(e) => handleStateChange(e.target.value)}
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
                onChange={(e) => handleMunChange(e.target.value)}
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

            <Input
              label="4. Sector / Caserío / Barrio / Dirección Exacta"
              placeholder="Calle Principal, Casa N° 12"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

