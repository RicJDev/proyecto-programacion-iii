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
import { INITIAL_CERTIFICATES, INITIAL_RECIPIENTS } from '../data/mockData';
import type { MedicalCertificate } from '../types/models';

export function CertificatesView() {
  const { user, hasPermission } = useAuth();
  const [certificates, setCertificates] = useState<MedicalCertificate[]>(INITIAL_CERTIFICATES);
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<MedicalCertificate | null | 'NOT_FOUND'>(null);

  // Modal de emisión
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState<number>(INITIAL_RECIPIENTS[0]?.id || 1);
  const [doseCount, setDoseCount] = useState<number>(3);

  const canIssue = hasPermission(PERMISSIONS.CERTIFICATES_ISSUE);
  const canVerify = hasPermission(PERMISSIONS.CERTIFICATES_VERIFY);

  function handleVerify(e: FormEvent) {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const found = certificates.find(
      (c) => c.code.toLowerCase() === verifyCode.trim().toLowerCase()
    );

    setVerificationResult(found || 'NOT_FOUND');
  }

  function handleIssueCertificate(e: FormEvent) {
    e.preventDefault();
    const rec = INITIAL_RECIPIENTS.find((r) => r.id === selectedRecipientId);
    if (!rec) return;

    const generatedCode = `CERT-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newCert: MedicalCertificate = {
      id: Date.now(),
      code: generatedCode,
      recipientId: rec.id,
      recipientName: `${rec.name} ${rec.last_name}`,
      recipientCedula: rec.identification_number,
      doseCount,
      centerName: user?.centroSalud || 'Ambulatorio La Victoria',
      issuedAt: new Date().toISOString().split('T')[0],
      status: 'valido',
    };

    setCertificates([newCert, ...certificates]);
    setIsModalOpen(false);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-surface-text">Certificación Médica Oficial y Validación QR</h2>
          <p className="text-sm text-text-muted">
            Emisión de certificados con hash único inalterable y validación pública de autenticidad sanitaria.
          </p>
        </div>

        {canIssue && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Emitir Nuevo Certificado Sanitario
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Módulo de Verificación Pública / Operativa (certificates:verify) */}
        {canVerify && (
          <Card>
            <CardHeader
              title="Validador Oficial de Certificados Sanitarios"
              subtitle="Ingrese el código alfanumérico único impreso en el documento o carnet digital"
            />
            <CardBody>
              <form onSubmit={handleVerify} className="space-y-4">
                <Input
                  label="Código Único de Certificado (code)"
                  placeholder="Ej: CERT-2026-MIR-9941A"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  className="uppercase"
                />
                <Button variant="secondary" type="submit" className="w-full">
                  Verificar Autenticidad en Base de Datos Nacional
                </Button>
              </form>

              {verificationResult === 'NOT_FOUND' && (
                <div className="mt-4 border border-danger bg-danger-soft p-4 text-sm text-danger">
                  <strong className="font-bold">Certificado Inválido o No Encontrado:</strong> El código ingresado no corresponde a ningún
                  registro legítimo emitido por el Ministerio de Salud.
                </div>
              )}

              {verificationResult && verificationResult !== 'NOT_FOUND' && (
                <div className="mt-4 border-2 border-success bg-success-soft p-5 text-surface-text">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-success">
                      CERTIFICADO OFICIAL VÁLIDO
                    </h4>
                    <Badge variant="success">ESTATUS: ACTIVO</Badge>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <div>
                      <strong className="font-semibold">Titular:</strong> {verificationResult.recipientName} ({verificationResult.recipientCedula})
                    </div>
                    <div>
                      <strong className="font-semibold">Código de Autenticidad:</strong>{' '}
                      <code className="font-mono text-xs">{verificationResult.code}</code>
                    </div>
                    <div>
                      <strong className="font-semibold">Centro Emisor:</strong> {verificationResult.centerName}
                    </div>
                    <div>
                      <strong className="font-semibold">Dosis Certificadas:</strong> {verificationResult.doseCount} dosis verificadas
                    </div>
                    <div>
                      <strong className="font-semibold">Fecha de Emisión:</strong> {verificationResult.issuedAt}
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Simulación visual de Carnet / Certificado Digital QR */}
        <Card>
          <CardHeader
            title="Vista Previa de Tarjeta Digital"
            subtitle="Diseño institucional de carnet para impresión y consulta ciudadana"
          />
          <CardBody>
            <div className="border-2 border-primary bg-surface p-5">
              <div className="mb-4 flex items-start justify-between border-b-2 border-primary pb-3">
                <div>
                  <h4 className="text-sm font-bold text-primary">
                    REPÚBLICA BOLIVARIANA DE VENEZUELA
                  </h4>
                  <p className="text-xs text-text-muted">
                    Ministerio del Poder Popular para la Salud — Certificado Digital
                  </p>
                </div>
                <Badge variant="primary">OFICIAL</Badge>
              </div>

              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_100px]">
                <div className="space-y-1 text-sm">
                  <div>
                    <strong className="font-semibold">Ciudadano(a):</strong> Valeria Martínez Soto
                  </div>
                  <div>
                    <strong className="font-semibold">Cédula:</strong> V-24555888
                  </div>
                  <div>
                    <strong className="font-semibold">Esquema:</strong> Completo (Fiebre Amarilla, Pentavalente, COVID-19)
                  </div>
                  <div>
                    <strong className="font-semibold">Hash de Validación:</strong>{' '}
                    <code className="font-mono text-xs">CERT-2026-MIR-9941A</code>
                  </div>
                </div>

                {/* Código QR Ilustrativo Plano */}
                <div className="flex h-[90px] w-[90px] flex-col items-center justify-center border-2 border-surface-text bg-surface text-center text-[10px] font-bold">
                  <div className="mb-1 border border-surface-text px-1.5 py-0.5 font-mono text-xs">
                    QR
                  </div>
                  <span>CÓDIGO</span>
                  <span className="text-[9px] text-text-muted">VERIFICADO</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabla de Certificados Emitidos */}
      <Card>
        <CardHeader
          title="Directorio de Certificados Registrados en el Sistema"
          subtitle="Lista de certificados emitidos para auditoría y reenvío ciudadano"
        />
        <CardBody className="p-0">
          <Table headers={['Código Oficial', 'Ciudadano Titular', 'Cédula', 'Dosis', 'Centro Emisor', 'Fecha', 'Estatus']}>
            {certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell>
                  <code className="font-mono text-xs">{cert.code}</code>
                </TableCell>
                <TableCell>
                  <strong className="font-semibold">{cert.recipientName}</strong>
                </TableCell>
                <TableCell>{cert.recipientCedula}</TableCell>
                <TableCell>{cert.doseCount} dosis</TableCell>
                <TableCell>{cert.centerName}</TableCell>
                <TableCell>{cert.issuedAt}</TableCell>
                <TableCell>
                  <Badge variant={cert.status === 'valido' ? 'success' : 'danger'}>
                    {cert.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardBody>
      </Card>

      {/* Modal para Emitir Nuevo Certificado */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Emisión de Certificado Oficial de Salud"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleIssueCertificate}>
              Generar Código y Emitir
            </Button>
          </>
        }
      >
        <form onSubmit={handleIssueCertificate} className="space-y-4">
          <Select
            label="Seleccione Ciudadano Solicitante"
            value={selectedRecipientId}
            onChange={(e) => setSelectedRecipientId(Number(e.target.value))}
          >
            {INITIAL_RECIPIENTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.identification_number} — {r.name} {r.last_name}
              </option>
            ))}
          </Select>

          <Input
            label="Total de Dosis Verificadas en Esquema"
            type="number"
            min={1}
            max={20}
            value={doseCount}
            onChange={(e) => setDoseCount(Number(e.target.value))}
          />

          <div className="border border-border bg-surface-alt p-3.5 text-xs">
            <strong className="font-semibold">Aviso Legal y Sanitario:</strong> Al emitir este documento, se estampa la firma digital institucional y
            se genera un código hash único irrepetible que permitirá la verificación pública ciudadana en &quot;Tu Tarjeta&quot;.
          </div>
        </form>
      </Modal>
    </div>
  );
}
