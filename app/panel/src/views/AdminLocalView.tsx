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
import {
  centerKpis,
  inventory as initialInventory,
  patients,
  pendingDocuments as initialDocuments,
  vaccineCatalog,
} from '../mockData'
import {
  documentStatusVariant,
  inventoryStatusLabel,
  inventoryStatusVariant,
} from '../lib/status'
import type {
  DocumentRecord,
  DocumentStatus,
  InventoryItem,
  InventoryStatus,
} from '../types'

const TABS = [
  { id: 'inventario', label: 'Inventario' },
  {
    id: 'documentos',
    label: 'Validación de documentos',
    count: initialDocuments.filter((doc) => doc.status === 'pendiente').length,
  },
]

const INVENTORY_FILTERS = [
  { value: '', label: 'Todos los estados' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'stock_bajo', label: 'Stock bajo' },
  { value: 'por_vencer', label: 'Por vencer' },
  { value: 'vencido', label: 'Vencido' },
]

const INVENTORY_STATUS_OPTIONS: InventoryStatus[] = [
  'disponible',
  'stock_bajo',
  'por_vencer',
  'vencido',
]

export function AdminLocalView() {
  const [activeTab, setActiveTab] = useState('inventario')
  const [items, setItems] = useState<InventoryItem[]>(initialInventory)
  const [documents, setDocuments] = useState<DocumentRecord[]>(initialDocuments)
  const [statusFilter, setStatusFilter] = useState('')
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [receipt, setReceipt] = useState({
    vaccine: 'BCG',
    lot: '',
    availableDoses: '',
    expiryDate: '',
    status: 'disponible' as InventoryStatus,
  })

  const filteredItems = useMemo(
    () => items.filter((item) => !statusFilter || item.status === statusFilter),
    [items, statusFilter],
  )

  const totalDoses = items.reduce((sum, item) => sum + item.availableDoses, 0)
  const previewDocument = documents.find((doc) => doc.id === previewId) ?? null
  const previewPatient = previewDocument
    ? patients.find((patient) => patient.document === previewDocument.document)
    : undefined

  function registerReceipt() {
    const parsedDoses = Number(receipt.availableDoses)
    if (
      !receipt.lot.trim() ||
      !Number.isFinite(parsedDoses) ||
      parsedDoses <= 0
    ) {
      return
    }

    setItems((previous) => [
      {
        id: `i-${String(previous.length + 1).padStart(3, '0')}`,
        centerId: 'c-001',
        vaccine:
          vaccineCatalog.find((option) => option.value === receipt.vaccine)
            ?.label ?? receipt.vaccine,
        laboratory: 'Por asignar',
        lot: receipt.lot.trim().toUpperCase(),
        availableDoses: parsedDoses,
        totalDoses: parsedDoses,
        expiryDate: receipt.expiryDate || '2027-12-31',
        status: receipt.status,
      },
      ...previous,
    ])
    setReceipt({
      vaccine: 'BCG',
      lot: '',
      availableDoses: '',
      expiryDate: '',
      status: 'disponible',
    })
    setReceiptOpen(false)
  }

  function setDocumentStatus(id: string, status: DocumentStatus) {
    setDocuments((previous) =>
      previous.map((doc) => (doc.id === id ? { ...doc, status } : doc)),
    )
    setPreviewId(null)
  }

  return (
    <div className='mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-widest text-primary'>
            Administración local
          </p>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-surface-text'>
            Ambulatorio Urbano Baruta
          </h1>
          <p className='mt-1 text-sm text-text-muted'>
            AM-3102 · Baruta, Estado Miranda · Distrito Sanitario Baruta
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge variant='success'>Almacén operativo</Badge>
          <Badge variant='warning'>4 documentos pendientes</Badge>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {centerKpis.map((metric) => (
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
        {activeTab === 'inventario' && (
          <Card>
            <CardHeader
              title='Inventario por vacuna y lote'
              subtitle='Control de existencias, vencimientos y trazabilidad de lotes'
              actions={
                <>
                  <Select
                    aria-label='Filtrar por estado de inventario'
                    className='w-44'
                    name='filtro-inventario'
                    options={INVENTORY_FILTERS}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  />
                  <Button
                    size='sm'
                    onClick={() => setReceiptOpen(true)}
                  >
                    + Registrar ingreso
                  </Button>
                </>
              }
            />
            <Table className='border-0'>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Vacuna</TableHeaderCell>
                  <TableHeaderCell>Laboratorio</TableHeaderCell>
                  <TableHeaderCell>Lote</TableHeaderCell>
                  <TableHeaderCell>Existencias</TableHeaderCell>
                  <TableHeaderCell>Caducidad</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => {
                  const percentage =
                    item.totalDoses > 0
                      ? Math.round(
                          (item.availableDoses / item.totalDoses) * 100,
                        )
                      : 0

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className='font-semibold'>{item.vaccine}</p>
                        <p className='text-[11px] text-text-muted'>
                          {item.id.toUpperCase()}
                        </p>
                      </TableCell>
                      <TableCell>{item.laboratory}</TableCell>
                      <TableCell className='font-mono text-xs'>
                        {item.lot}
                      </TableCell>
                      <TableCell>
                        <p className='font-semibold'>
                          {item.availableDoses}{' '}
                          <span className='font-normal text-text-muted'>
                            / {item.totalDoses} dosis
                          </span>
                        </p>
                        <div className='mt-1 h-1.5 w-32 bg-secondary-soft'>
                          <div
                            className={`h-1.5 ${
                              percentage <= 25
                                ? 'bg-danger'
                                : percentage <= 50
                                  ? 'bg-warning'
                                  : 'bg-success'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className='font-mono text-xs'>
                        {item.expiryDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inventoryStatusVariant[item.status]}>
                          {inventoryStatusLabel[item.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='py-8 text-center text-text-muted'
                    >
                      Sin lotes para el estado seleccionado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <CardFooter>
              <span className='text-[11px] text-text-muted'>
                {filteredItems.length} lotes ·{' '}
                {totalDoses.toLocaleString('es-VE')} dosis disponibles en
                almacén
              </span>
              <Badge variant='danger'>1 lote vencido para descarte</Badge>
            </CardFooter>
          </Card>
        )}

        {activeTab === 'documentos' && (
          <Card>
            <CardHeader
              title='Módulo de validación de documentos'
              subtitle='Revisión de certificados y consentimientos enviados por la ciudadanía'
              actions={
                <Badge variant='warning'>
                  {documents.filter((doc) => doc.status === 'pendiente').length}{' '}
                  en cola
                </Badge>
              }
            />
            <Table className='border-0'>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Folio</TableHeaderCell>
                  <TableHeaderCell>Solicitante</TableHeaderCell>
                  <TableHeaderCell>Tipo de documento</TableHeaderCell>
                  <TableHeaderCell>Enviado</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                  <TableHeaderCell className='text-right'>
                    Acciones
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className='font-mono text-xs font-semibold'>
                      {doc.folio}
                    </TableCell>
                    <TableCell>
                      <p className='font-semibold'>{doc.patientName}</p>
                      <p className='text-[11px] text-text-muted'>
                        C.I. {doc.document}
                      </p>
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell className='font-mono text-xs'>
                      {doc.submittedAt}
                    </TableCell>
                    <TableCell>
                      <Badge variant={documentStatusVariant[doc.status]}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setPreviewId(doc.id)}
                      >
                        Previsualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CardFooter>
              <span className='text-[11px] text-text-muted'>
                Tiempo máximo de validación institucional: 48 horas
              </span>
              <span className='text-[11px] text-text-muted'>
                Documentos totales: {documents.length}
              </span>
            </CardFooter>
          </Card>
        )}
      </Tabs>

      <Modal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title='Registrar ingreso de stock'
        description='Almacén CS-1402 · movimientos auditados'
        size='sm'
        footer={
          <>
            <Button
              variant='outline'
              onClick={() => setReceiptOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={registerReceipt}>Registrar ingreso</Button>
          </>
        }
      >
        <div className='grid gap-4 sm:grid-cols-2'>
          <Select
            label='Vacuna'
            name='ingreso-vacuna'
            options={vaccineCatalog}
            value={receipt.vaccine}
            onChange={(event) =>
              setReceipt({ ...receipt, vaccine: event.target.value })
            }
          />
          <Input
            label='Número de lote'
            name='ingreso-lote'
            placeholder='Ej. BCG-2510-B'
            value={receipt.lot}
            onChange={(event) =>
              setReceipt({ ...receipt, lot: event.target.value })
            }
            error={
              receipt.lot.trim() === '' ? 'El lote es obligatorio.' : undefined
            }
          />
          <Input
            label='Cantidad de dosis'
            name='ingreso-cantidad'
            type='number'
            min={1}
            placeholder='Ej. 200'
            value={receipt.availableDoses}
            onChange={(event) =>
              setReceipt({ ...receipt, availableDoses: event.target.value })
            }
            error={
              receipt.availableDoses !== '' &&
              Number(receipt.availableDoses) <= 0
                ? 'Debe ser mayor a cero.'
                : undefined
            }
          />
          <Input
            label='Fecha de caducidad'
            name='ingreso-caducidad'
            type='date'
            value={receipt.expiryDate}
            onChange={(event) =>
              setReceipt({ ...receipt, expiryDate: event.target.value })
            }
          />
          <Select
            label='Estado inicial'
            name='ingreso-estado'
            className='sm:col-span-2'
            options={INVENTORY_STATUS_OPTIONS.map((status) => ({
              value: status,
              label: inventoryStatusLabel[status],
            }))}
            value={receipt.status}
            onChange={(event) =>
              setReceipt({
                ...receipt,
                status: event.target.value as InventoryStatus,
              })
            }
          />
        </div>
      </Modal>

      <Modal
        open={previewDocument !== null}
        onClose={() => setPreviewId(null)}
        title='Previsualización de certificado'
        description={
          previewDocument
            ? `${previewDocument.folio} · ${previewDocument.type}`
            : undefined
        }
        size='lg'
        footer={
          previewDocument?.status === 'pendiente' ? (
            <>
              <Button
                variant='danger'
                onClick={() =>
                  setDocumentStatus(previewDocument.id, 'rechazado')
                }
              >
                Rechazar
              </Button>
              <Button
                variant='primary'
                onClick={() =>
                  setDocumentStatus(previewDocument.id, 'aprobado')
                }
              >
                Aprobar documento
              </Button>
            </>
          ) : (
            <Button
              variant='outline'
              onClick={() => setPreviewId(null)}
            >
              Cerrar
            </Button>
          )
        }
      >
        {previewDocument ? (
          <div className='border border-border-strong bg-surface-alt p-6'>
            <div className='flex flex-wrap items-start justify-between gap-3 border-b-2 border-primary pb-4'>
              <div>
                <p className='text-[10px] font-bold uppercase tracking-widest text-primary'>
                  República Bolivariana de Venezuela · Ministerio del Poder
                  Popular para la Salud
                </p>
                <h3 className='mt-1 text-lg font-bold uppercase tracking-wide text-surface-text'>
                  Certificado de vacunación
                </h3>
                <p className='text-[11px] text-text-muted'>
                  Emitido por SIGEV — Sistema Nacional de Gestión y Seguimiento
                  de Vacunas
                </p>
              </div>
              <div className='text-right'>
                <p className='font-mono text-xs font-semibold text-surface-text'>
                  {previewDocument.folio}
                </p>
                <Badge
                  variant={documentStatusVariant[previewDocument.status]}
                  className='mt-2'
                >
                  {previewDocument.status}
                </Badge>
              </div>
            </div>

            <div className='grid gap-4 border-b border-border py-4 sm:grid-cols-3'>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
                  Titular
                </p>
                <p className='mt-1 text-sm font-semibold text-surface-text'>
                  {previewDocument.patientName}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
                  Documento de identidad
                </p>
                <p className='mt-1 font-mono text-sm text-surface-text'>
                  C.I. {previewDocument.document}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
                  Fecha de emisión
                </p>
                <p className='mt-1 font-mono text-sm text-surface-text'>
                  20/10/2026
                </p>
              </div>
            </div>

            <p className='pt-4 text-xs font-semibold uppercase tracking-widest text-text-muted'>
              Esquema de vacunación registrado
            </p>

            {previewPatient && previewPatient.doses.length > 0 ? (
              <Table className='mt-2 border-border-strong'>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Vacuna</TableHeaderCell>
                    <TableHeaderCell>Dosis</TableHeaderCell>
                    <TableHeaderCell>Fecha</TableHeaderCell>
                    <TableHeaderCell>Lote</TableHeaderCell>
                    <TableHeaderCell>Aplicado por</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewPatient.doses.map((dose) => (
                    <TableRow key={dose.id}>
                      <TableCell className='font-semibold'>
                        {dose.vaccine}
                      </TableCell>
                      <TableCell>{dose.doseNumber}</TableCell>
                      <TableCell className='font-mono text-xs'>
                        {dose.date}
                      </TableCell>
                      <TableCell className='font-mono text-xs'>
                        {dose.lot}
                      </TableCell>
                      <TableCell>{dose.appliedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className='mt-2 border border-warning/40 bg-warning-soft px-4 py-3 text-xs text-warning'>
                Sin esquema vinculado en el expediente. El certificado solo
                ampara la identidad del solicitante.
              </div>
            )}

            <div className='mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4'>
              <div className='text-[11px] text-text-muted'>
                <p>
                  Verificado por: <strong>Lucía Fernanda Torres Mejía</strong>
                </p>
                <p>Administrador Local · CS-1402</p>
              </div>
              <div className='flex h-16 w-16 items-center justify-center border-2 border-dashed border-primary text-center text-[9px] font-bold uppercase leading-tight text-primary'>
                SELLO
                <br />
                SIGEV
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
