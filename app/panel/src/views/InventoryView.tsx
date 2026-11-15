import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../types/permissions';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { INITIAL_BATCHES, INITIAL_VACCINES } from '../data/mockData';
import type { Vaccine, VaccineBatch } from '../types/models';

export function InventoryView() {
  const { user, hasPermission } = useAuth();
  const [vaccines, setVaccines] = useState<Vaccine[]>(INITIAL_VACCINES);
  const [batches, setBatches] = useState<VaccineBatch[]>(INITIAL_BATCHES);

  // Modales de lotes y vacunas
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);

  // Formulario Lote
  const [selectedVaccineId, setSelectedVaccineId] = useState<number>(INITIAL_VACCINES[0]?.id || 1);
  const [batchNumber, setBatchNumber] = useState('');
  const [doses, setDoses] = useState<number>(100);
  const [expDate, setExpDate] = useState('2027-12-31');

  // Formulario Nueva Vacuna
  const [vacName, setVacName] = useState('');
  const [vacType, setVacType] = useState('');
  const [vacDoses, setVacDoses] = useState<number>(2);
  const [vacTarget, setVacTarget] = useState('Población general');
  const [vacDesc, setVacDesc] = useState('');

  const canManageVaccines = hasPermission(PERMISSIONS.VACCINES_MANAGE);
  const canManageInventory = hasPermission(PERMISSIONS.INVENTORY_MANAGE);

  function handleCreateBatch(e: FormEvent) {
    e.preventDefault();
    if (!batchNumber.trim()) return;

    const vac = vaccines.find((v) => v.id === selectedVaccineId);
    if (!vac) return;

    const newBatch: VaccineBatch = {
      id: Date.now(),
      vaccineId: vac.id,
      vaccineName: vac.name,
      batchNumber: batchNumber.trim().toUpperCase(),
      centerId: 1,
      centerName: user?.centroSalud || 'Ambulatorio La Victoria',
      availableDoses: doses,
      expirationDate: expDate,
    };

    setBatches([newBatch, ...batches]);
    setIsBatchModalOpen(false);
    setBatchNumber('');
  }

  function handleCreateVaccine(e: FormEvent) {
    e.preventDefault();
    if (!vacName.trim()) return;

    const newVac: Vaccine = {
      id: Date.now(),
      name: vacName.trim(),
      type: vacType.trim() || 'Vírica / Bacteriana',
      totalRequiredDoses: vacDoses,
      targetGroup: vacTarget.trim() || 'Población general',
      description: vacDesc.trim() || 'Vacuna aprobada para el esquema nacional.',
    };

    setVaccines([...vaccines, newVac]);
    setIsVaccineModalOpen(false);
    setVacName('');
    setVacType('');
    setVacDesc('');
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
          <h2 style={{ fontSize: '1.4rem' }}>Inventario de Biológicos y Catálogo de Vacunas</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Control de lotes, fechas de vencimiento, cadena de frío y catálogo nacional de vacunas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canManageVaccines && (
            <Button variant="outline" onClick={() => setIsVaccineModalOpen(true)}>
              + Nueva Vacuna en Catálogo
            </Button>
          )}

          {canManageInventory && (
            <Button variant="primary" onClick={() => setIsBatchModalOpen(true)}>
              + Ingresar Nuevo Lote
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Lotes Disponibles en el Centro */}
        <Card>
          <CardHeader
            title="Lotes y Frascos Asignados al Centro de Salud"
            subtitle="Existencias físicas disponibles para el turno de vacunación"
          />
          <CardBody style={{ padding: 0 }}>
            <Table headers={['Número de Lote', 'Vacuna', 'Dosis Disponibles', 'Fecha Vencimiento', 'Centro']}>
              {batches.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <code>{b.batchNumber}</code>
                  </TableCell>
                  <TableCell>
                    <strong>{b.vaccineName}</strong>
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.availableDoses < 80 ? 'warning' : 'success'}>
                      {b.availableDoses} dosis
                    </Badge>
                  </TableCell>
                  <TableCell>{b.expirationDate}</TableCell>
                  <TableCell>{b.centerName}</TableCell>
                </TableRow>
              ))}
            </Table>
          </CardBody>
        </Card>

        {/* Catálogo Nacional de Vacunas */}
        <Card>
          <CardHeader
            title="Catálogo Oficial del Esquema Nacional (`VACCINE`)"
            subtitle="Definición de biológicos regulados por el Ministerio"
            action={
              canManageVaccines ? (
                <Badge variant="primary">👑 Rol Maestro: Catálogo Editable</Badge>
              ) : undefined
            }
          />
          <CardBody style={{ padding: 0 }}>
            <Table headers={['Biológico', 'Tipo', 'Dosis Requeridas', 'Grupo Objetivo']}>
              {vaccines.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <strong>{v.name}</strong>
                  </TableCell>
                  <TableCell>{v.type}</TableCell>
                  <TableCell>
                    <Badge variant="neutral">{v.totalRequiredDoses} dosis</Badge>
                  </TableCell>
                  <TableCell style={{ fontSize: '0.8rem' }}>{v.targetGroup}</TableCell>
                </TableRow>
              ))}
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Modal para Ingresar Lote */}
      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Ingreso y Recepción de Lote de Vacunas"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsBatchModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateBatch}>
              Registrar Stock
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateBatch}>
          <Select
            label="Seleccione Vacuna"
            value={selectedVaccineId}
            onChange={(e) => setSelectedVaccineId(Number(e.target.value))}
          >
            {vaccines.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>

          <Input
            label="Número de Lote (Impreso en el frasco)"
            required
            placeholder="LOT-2026-VAL-09"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Input
              label="Cantidad de Dosis Recibidas"
              type="number"
              min={1}
              required
              value={doses}
              onChange={(e) => setDoses(Number(e.target.value))}
            />
            <Input
              label="Fecha de Vencimiento"
              type="date"
              required
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
            />
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              padding: '0.75rem',
              border: '1px solid var(--color-border)',
              fontSize: '0.825rem',
            }}
          >
            <strong>Recepción en:</strong> {user?.centroSalud || 'Ambulatorio La Victoria'} | <strong>Responsable:</strong>{' '}
            {user?.name}
          </div>
        </form>
      </Modal>

      {/* Modal para Registrar Nueva Vacuna (VACCINES_MANAGE) */}
      <Modal
        isOpen={isVaccineModalOpen}
        onClose={() => setIsVaccineModalOpen(false)}
        title="Alta de Biológico en el Catálogo Oficial"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsVaccineModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateVaccine}>
              Añadir al Catálogo
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateVaccine}>
          <Input
            label="Denominación de la Vacuna"
            required
            placeholder="Hepatitis A Pediátrica"
            value={vacName}
            onChange={(e) => setVacName(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <Input
              label="Tipo de Biológico"
              placeholder="Inactivada vírica"
              value={vacType}
              onChange={(e) => setVacType(e.target.value)}
            />
            <Input
              label="Dosis Requeridas en Esquema"
              type="number"
              min={1}
              max={10}
              value={vacDoses}
              onChange={(e) => setVacDoses(Number(e.target.value))}
            />
          </div>

          <Input
            label="Grupo Poblacional Objetivo"
            placeholder="Niños a partir de 12 meses"
            value={vacTarget}
            onChange={(e) => setVacTarget(e.target.value)}
          />

          <Input
            label="Descripción Farmacológica / Indicaciones"
            placeholder="Inmunización activa contra el virus de hepatitis A..."
            value={vacDesc}
            onChange={(e) => setVacDesc(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
