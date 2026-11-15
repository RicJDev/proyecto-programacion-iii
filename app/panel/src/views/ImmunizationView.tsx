import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../types/permissions';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { INITIAL_BATCHES, INITIAL_IMMUNIZATIONS, INITIAL_RECIPIENTS, INITIAL_VACCINES } from '../data/mockData';
import type { ImmunizationRecord } from '../types/models';

export function ImmunizationView() {
  const { user, hasPermission } = useAuth();
  const [immunizations, setImmunizations] = useState<ImmunizationRecord[]>(INITIAL_IMMUNIZATIONS);

  // Formulario de aplicación de dosis
  const [selectedRecipientId, setSelectedRecipientId] = useState<number>(INITIAL_RECIPIENTS[0]?.id || 1);
  const [selectedVaccineId, setSelectedVaccineId] = useState<number>(INITIAL_VACCINES[0]?.id || 1);
  const [selectedBatchNumber, setSelectedBatchNumber] = useState<string>(INITIAL_BATCHES[0]?.batchNumber || '');
  const [doseType, setDoseType] = useState('Primera Dosis (1ra)');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canApply = hasPermission(PERMISSIONS.IMMUNIZATIONS_CREATE);

  // Lotes filtrados para la vacuna seleccionada
  const availableBatches = INITIAL_BATCHES.filter((b) => b.vaccineId === selectedVaccineId);

  function handleRegisterDose(e: FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);

    const rec = INITIAL_RECIPIENTS.find((r) => r.id === selectedRecipientId);
    const vac = INITIAL_VACCINES.find((v) => v.id === selectedVaccineId);

    if (!rec || !vac) return;

    const newRecord: ImmunizationRecord = {
      id: Date.now(),
      recipientId: rec.id,
      recipientName: `${rec.name} ${rec.last_name}`,
      recipientCedula: rec.identification_number,
      vaccineId: vac.id,
      vaccineName: vac.name,
      doseNumber: 1,
      doseType,
      batchNumber: selectedBatchNumber || 'LOT-EMERGENCIA-2026',
      centerId: 1,
      centerName: user?.centroSalud || 'Ambulatorio La Victoria',
      administeredBy: user?.name || 'Personal Inmunizador',
      dateTime: 'Recién aplicada',
    };

    setImmunizations([newRecord, ...immunizations]);
    setSuccessMsg(
      `✓ Dosis de ${vac.name} (${selectedBatchNumber}) administrada exitosamente a ${rec.name} ${rec.last_name}. Trazabilidad vinculada a ${newRecord.centerName}.`
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem' }}>Registro de Aplicación de Vacunas</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Módulo de vacunación en campo con trazabilidad territorial obligatoria e inoculación de biológicos.
        </p>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success)',
            color: 'var(--color-success)',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: canApply ? '1.2fr 1.8fr' : '1fr', gap: '1.5rem' }}>
        {/* Formulario de Aplicación (Solo visible con permiso IMMUNIZATIONS_CREATE) */}
        {canApply && (
          <Card>
            <CardHeader
              title="3. Inocular y Registrar Dosis"
              subtitle="Validación de paciente, biológico y lote del frasco"
            />
            <CardBody>
              <form onSubmit={handleRegisterDose}>
                <Select
                  label="Paciente Receptor (Padrón Nacional)"
                  value={selectedRecipientId}
                  onChange={(e) => setSelectedRecipientId(Number(e.target.value))}
                >
                  {INITIAL_RECIPIENTS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.identification_number} — {r.name} {r.last_name}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Vacuna Correspondiente a Inocular"
                  value={selectedVaccineId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedVaccineId(id);
                    const b = INITIAL_BATCHES.find((item) => item.vaccineId === id);
                    if (b) setSelectedBatchNumber(b.batchNumber);
                  }}
                >
                  {INITIAL_VACCINES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.type})
                    </option>
                  ))}
                </Select>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <Select
                    label="Esquema / Dosis"
                    value={doseType}
                    onChange={(e) => setDoseType(e.target.value)}
                  >
                    <option value="Primera Dosis (1ra)">1ra Dosis</option>
                    <option value="Segunda Dosis (2da)">2da Dosis</option>
                    <option value="Tercera Dosis (3ra)">3ra Dosis</option>
                    <option value="Dosis Única">Dosis Única</option>
                    <option value="Refuerzo Anual">Refuerzo Anual</option>
                    <option value="Refuerzo Decenal (10 años)">Refuerzo Decenal (10 años)</option>
                  </Select>

                  <Select
                    label="Lote de Frasco Disponible"
                    value={selectedBatchNumber}
                    onChange={(e) => setSelectedBatchNumber(e.target.value)}
                  >
                    {availableBatches.length > 0 ? (
                      availableBatches.map((b) => (
                        <option key={b.id} value={b.batchNumber}>
                          {b.batchNumber} ({b.availableDoses} dosis)
                        </option>
                      ))
                    ) : (
                      <option value="LOT-DEFAULT-01">LOT-DISPONIBLE-01</option>
                    )}
                  </Select>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface-muted)',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.825rem',
                  }}
                >
                  <div>
                    <strong>Centro Emisor:</strong> {user?.centroSalud || 'Ambulatorio La Victoria'}
                  </div>
                  <div>
                    <strong>Inmunizador en Turno:</strong> {user?.name} ({user?.cedula})
                  </div>
                </div>

                <Button variant="secondary" type="submit" style={{ width: '100%' }}>
                  ✓ Guardar Aplicación e Imprimir Comprobante
                </Button>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Tabla de Historial General de Inmunizaciones */}
        <Card>
          <CardHeader
            title="Historial de Aplicaciones Realizadas"
            subtitle="Trazabilidad territorial obligatoria (id_center, lote, biológico)"
          />
          <CardBody style={{ padding: 0 }}>
            <Table
              headers={['Paciente', 'Vacuna Administrada', 'Dosis', 'Lote', 'Centro', 'Hora / Fecha', 'Inmunizador']}
            >
              {immunizations.map((imm) => (
                <TableRow key={imm.id}>
                  <TableCell>
                    <strong>{imm.recipientName}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {imm.recipientCedula}
                    </div>
                  </TableCell>
                  <TableCell>{imm.vaccineName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{imm.doseType}</Badge>
                  </TableCell>
                  <TableCell>
                    <code>{imm.batchNumber}</code>
                  </TableCell>
                  <TableCell>{imm.centerName}</TableCell>
                  <TableCell>{imm.dateTime}</TableCell>
                  <TableCell>{imm.administeredBy}</TableCell>
                </TableRow>
              ))}
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

