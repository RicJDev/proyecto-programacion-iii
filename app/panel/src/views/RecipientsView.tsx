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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-surface-text">Padrón y Consulta de Ciudadanos</h2>
          <p className="text-sm text-text-muted">
            Búsqueda centralizada y registro de pacientes conforme al Módulo Operativo de Centro de Salud.
          </p>
        </div>

        {canCreate && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Registrar Nuevo Ciudadano
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Panel Izquierdo: Buscador y Lista de Pacientes */}
        <div className="lg:col-span-5">
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
                className="mb-4"
              />

              <Table headers={['Cédula', 'Nombre y Apellido', 'Ubicación']} isEmpty={filteredRecipients.length === 0}>
                {filteredRecipients.map((r) => {
                  const isSelected = selectedRecipient?.id === r.id;
                  return (
                    <TableRow
                      key={r.id}
                      highlight={isSelected}
                      onClick={() => setSelectedRecipient(r)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <code className="font-mono text-xs">{r.identification_number}</code>
                      </TableCell>
                      <TableCell>
                        <strong className="font-semibold">
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
        </div>

        {/* Panel Derecho: Expediente Clínico de Inmunización */}
        <div className="lg:col-span-7">
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
                <div className="mb-5 grid grid-cols-1 gap-2 border border-border bg-surface-alt p-4 text-sm sm:grid-cols-2">
                  <div>
                    <strong className="font-semibold">Estado / Municipio:</strong> {selectedRecipient.state} — {selectedRecipient.municipality}
                  </div>
                  <div>
                    <strong className="font-semibold">Parroquia / Sector:</strong> {selectedRecipient.parish} — {selectedRecipient.sector}
                  </div>
                  <div>
                    <strong className="font-semibold">Teléfono:</strong> {selectedRecipient.phone || 'No registrado'}
                  </div>
                  {selectedRecipient.parentName && (
                    <div>
                      <strong className="font-semibold">Tutor Legal:</strong> {selectedRecipient.parentName} ({selectedRecipient.parentRelationship})
                    </div>
                  )}
                </div>

                <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-surface-text">
                  Historial de Dosis Administradas (IMMUNIZATION)
                </h4>

                <Table
                  headers={['Vacuna', 'Lote', 'Dosis / Refuerzo', 'Fecha', 'Centro Emisor']}
                  isEmpty={patientDoses.length === 0}
                  emptyMessage="No registra dosis previas en este centro o en el historial unificado."
                >
                  {patientDoses.map((dose) => (
                    <TableRow key={dose.id}>
                      <TableCell>
                        <strong className="font-semibold">{dose.vaccineName}</strong>
                      </TableCell>
                      <TableCell>
                        <code className="font-mono text-xs">{dose.batchNumber}</code>
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
              <CardBody className="py-12 text-center">
                <p className="text-sm text-text-muted">
                  Seleccione un paciente de la lista para inspeccionar su carnet de vacunación y expediente territorial.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Modal para Registro Rápido con Cascada Geográfica venezolana */}
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
        <form onSubmit={handleRegisterPatient} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <div className="mt-2 border-t border-border pt-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
              Ubicación Territorial y Domicilio
            </h4>

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
