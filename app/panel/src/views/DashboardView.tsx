import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../types/permissions';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Table, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { INITIAL_CENTERS, INITIAL_IMMUNIZATIONS, INITIAL_RECIPIENTS, INITIAL_VACCINES } from '../data/mockData';

export function DashboardView() {
  const { user, hasPermission } = useAuth();

  const canNational = hasPermission(PERMISSIONS.REPORTS_NATIONAL);
  const canRegional = hasPermission(PERMISSIONS.REPORTS_REGIONAL);
  const canLocal = hasPermission(PERMISSIONS.REPORTS_LOCAL);

  return (
    <div>
      {/* Banner de bienvenida y alcance institucional */}
      <div
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#ffffff',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          borderLeft: '6px solid var(--color-secondary)',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            opacity: 0.85,
            fontWeight: 700,
          }}
        >
          {canNational
            ? '🏛️ Nivel Central — Ministerio del Poder Popular para la Salud'
            : canRegional
            ? `🌐 Dirección Regional Sanitaria — Estado ${user?.region || 'Miranda'}`
            : `🏥 Módulo Operativo — ${user?.centroSalud || 'Centro de Salud Local'}`}
        </span>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginTop: '0.35rem' }}>
          Bienvenido(a), {user?.name}
        </h2>
        <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Sistema Nacional de Control y Seguimiento Epidemiológico. Sus permisos activos determinan el alcance
          territorial de las métricas visualizadas.
        </p>
      </div>

      {/* Tarjetas de Métricas basadas en permisos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {canNational ? (
          <>
            <StatCard
              label="Dosis Totales Nacionales"
              value="1,420,890"
              subtitle="Consolidado de 24 entidades federales"
              tag="Nacional"
              accentColor="#1e3a8a"
            />
            <StatCard
              label="Centros Operativos"
              value={INITIAL_CENTERS.length * 142}
              subtitle="Ambulatorios, CDI y Hospitales activos"
              tag="Infraestructura"
              accentColor="#0f766e"
            />
            <StatCard
              label="Población Inmunizada"
              value="89.4%"
              subtitle="Cobertura del esquema básico nacional"
              tag="Meta País"
              accentColor="#15803d"
            />
            <StatCard
              label="Biológicos en Catálogo"
              value={`${INITIAL_VACCINES.length} vacunas`}
              subtitle="Esquemas aprobados por el Ministerio"
              tag="Catálogo"
              accentColor="#b45309"
            />
          </>
        ) : canRegional ? (
          <>
            <StatCard
              label={`Dosis en ${user?.region || 'Región'}`}
              value="184,320"
              subtitle="Municipios bajo supervisión regional"
              tag="Regional"
              accentColor="#0f766e"
            />
            <StatCard
              label="Centros en el Estado"
              value={INITIAL_CENTERS.filter((c) => c.state === (user?.region || 'Miranda')).length + 38}
              subtitle="Centros adscritos al SACS Regional"
              tag="Red Sanitaria"
              accentColor="#1e3a8a"
            />
            <StatCard
              label="Cobertura Infantil"
              value="91.2%"
              subtitle="Esquema Pentavalente / Polio"
              tag="Regional"
              accentColor="#15803d"
            />
            <StatCard
              label="Lotes en Tránsito"
              value="45 frascos"
              subtitle="Distribución a municipios"
              tag="Logística"
              accentColor="#b45309"
            />
          </>
        ) : canLocal ? (
          <>
            <StatCard
              label="Dosis Aplicadas Hoy"
              value={INITIAL_IMMUNIZATIONS.length + 68}
              subtitle="Jornada actual en este centro"
              tag="Hoy"
              accentColor="#1e3a8a"
            />
            <StatCard
              label="Pacientes Atendidos"
              value={INITIAL_RECIPIENTS.length + 42}
              subtitle="Registros ingresados en el padrón"
              tag="Turno Activo"
              accentColor="#0f766e"
            />
            <StatCard
              label="Stock Disponible Centro"
              value="825 dosis"
              subtitle="Frascos aptos en refrigeración"
              tag="Almacén Local"
              accentColor="#15803d"
            />
            <StatCard
              label="Certificados Emitidos"
              value="18"
              subtitle="Tarjetas digitales y físicas entregadas"
              tag="Validación"
              accentColor="#b45309"
            />
          </>
        ) : null}
      </div>

      {/* Tablas de Supervisión */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Resumen diario de aplicaciones en el centro (Módulo linux.html) */}
        {canLocal && (
          <Card>
            <CardHeader
              title="Resumen Operativo Diario de Vacunación (Punto de Atención)"
              subtitle="Registro en tiempo real de dosis aplicadas en el centro por el personal de guardia"
            />
            <CardBody style={{ padding: 0 }}>
              <Table headers={['Vacuna', 'Lote', 'Dosis / Esquema', 'Hora', 'Inmunizador a Cargo', 'Paciente']}>
                {INITIAL_IMMUNIZATIONS.map((imm) => (
                  <TableRow key={imm.id}>
                    <TableCell>
                      <strong>{imm.vaccineName}</strong>
                    </TableCell>
                    <TableCell>
                      <code>{imm.batchNumber}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{imm.doseType}</Badge>
                    </TableCell>
                    <TableCell>{imm.dateTime}</TableCell>
                    <TableCell>{imm.administeredBy}</TableCell>
                    <TableCell>
                      {imm.recipientName} ({imm.recipientCedula})
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </CardBody>
          </Card>
        )}

        {/* Consolidado Regional o Nacional de Centros */}
        {(canNational || canRegional) && (
          <Card>
            <CardHeader
              title={
                canNational
                  ? 'Red de Centros de Salud Monitoreados (Cobertura Nacional)'
                  : `Centros de Salud en la Jurisdicción (${user?.region || 'Miranda'})`
              }
              subtitle="Supervisión del estatus operativo y capacidad instalada de vacunación"
            />
            <CardBody style={{ padding: 0 }}>
              <Table headers={['Código Oficial', 'Nombre del Centro', 'Tipología', 'Ubicación Territorial', 'Estatus Operativo', 'Contacto']}>
                {INITIAL_CENTERS.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <code>{c.code}</code>
                    </TableCell>
                    <TableCell>
                      <strong>{c.name}</strong>
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary">{c.type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      {c.state} — {c.municipality} ({c.parish})
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'activo' ? 'success' : 'danger'}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{c.phone || c.email || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

