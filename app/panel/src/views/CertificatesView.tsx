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
          <h2 style={{ fontSize: '1.4rem' }}>Certificación Médica Oficial y Validación QR</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Emisión de certificados con hash único inalterable y validación pública de autenticidad sanitaria.
          </p>
        </div>

        {canIssue && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Emitir Nuevo Certificado Sanitario
          </Button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Módulo de Verificación Pública / Operativa (certificates:verify) */}
        {canVerify && (
          <Card>
            <CardHeader
              title="Validador Oficial de Certificados Sanitarios"
              subtitle="Ingrese el código alfanumérico único impreso en el documento o carnet digital"
            />
            <CardBody>
              <form onSubmit={handleVerify}>
                <Input
                  label="Código Único de Certificado (`code`)"
                  placeholder="Ej: CERT-2026-MIR-9941A"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                />
                <Button variant="secondary" type="submit" style={{ width: '100%' }}>
                  🔍 Verificar Autenticidad en Base de Datos Nacional
                </Button>
              </form>

              {verificationResult === 'NOT_FOUND' && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--color-danger-bg)',
                    border: '1px solid var(--color-danger)',
                    color: 'var(--color-danger)',
                    fontSize: '0.9rem',
                  }}
                >
                  ❌ <strong>Certificado Inválido o No Encontrado:</strong> El código ingresado no corresponde a ningún
                  registro legítimo emitido por el Ministerio de Salud.
                </div>
              )}

              {verificationResult && verificationResult !== 'NOT_FOUND' && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-success-bg)',
                    border: '2px solid var(--color-success)',
                    color: 'var(--color-text)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ color: 'var(--color-success)', margin: 0 }}>✓ CERTIFICADO OFICIAL VÁLIDO</h4>
                    <Badge variant="success">ESTATUS: ACTIVO</Badge>
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    <div>
                      <strong>Titular:</strong> {verificationResult.recipientName} ({verificationResult.recipientCedula})
                    </div>
                    <div>
                      <strong>Código de Autenticidad:</strong> <code>{verificationResult.code}</code>
                    </div>
                    <div>
                      <strong>Centro Emisor:</strong> {verificationResult.centerName}
                    </div>
                    <div>
                      <strong>Dosis Certificadas:</strong> {verificationResult.doseCount} dosis verificadas
                    </div>
                    <div>
                      <strong>Fecha de Emisión:</strong> {verificationResult.issuedAt}
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
            <div
              style={{
                border: '2px solid var(--color-primary)',
                padding: '1.25rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid var(--color-primary)',
                  paddingBottom: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                    REPÚBLICA BOLIVARIANA DE VENEZUELA
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Ministerio del Poder Popular para la Salud — Certificado Digital
                  </p>
                </div>
                <Badge variant="primary">OFICIAL</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '0.85rem' }}>
                  <div>
                    <strong>Ciudadano(a):</strong> Valeria Martínez Soto
                  </div>
                  <div>
                    <strong>Cédula:</strong> V-24555888
                  </div>
                  <div>
                    <strong>Esquema:</strong> Completo (Fiebre Amarilla, Pentavalente, COVID-19)
                  </div>
                  <div>
                    <strong>Hash de Validación:</strong> <code>CERT-2026-MIR-9941A</code>
                  </div>
                </div>

                {/* Código QR Ilustrativo Plano */}
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    border: '2px solid #000000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    fontSize: '0.65rem',
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.1rem' }}>☵</div>
                  <span>QR CÓDIGO</span>
                  <span style={{ fontSize: '0.55rem' }}>VERIFICADO</span>
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
        <CardBody style={{ padding: 0 }}>
          <Table headers={['Código Oficial', 'Ciudadano Titular', 'Cédula', 'Dosis', 'Centro Emisor', 'Fecha', 'Estatus']}>
            {certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell>
                  <code>{cert.code}</code>
                </TableCell>
                <TableCell>
                  <strong>{cert.recipientName}</strong>
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
        <form onSubmit={handleIssueCertificate}>
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

          <div
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              padding: '0.85rem',
              border: '1px solid var(--color-border)',
              fontSize: '0.825rem',
            }}
          >
            <strong>Aviso Legal y Sanitario:</strong> Al emitir este documento, se estampa la firma digital institucional y
            se genera un código hash único irrepetible que permitirá la verificación pública ciudadana en "Tu Tarjeta".
          </div>
        </form>
      </Modal>
    </div>
  );
}

