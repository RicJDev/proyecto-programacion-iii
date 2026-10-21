import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
  KPICard,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '../components/ui'
import {
  immunizerKpis,
  patients as mockPatients,
  vaccineCatalog,
} from '../mockData'
import type { Patient, Sex } from '../types'

const APPLICATOR = 'Carmen Rosa Villanueva Soto'
const CENTER_NAME = 'Amb. U. Baruta'

const EMPTY_FORM = {
  document: '',
  fullName: '',
  birthDate: '',
  sex: 'F' as Sex,
  phone: '',
  email: '',
  vaccine: 'BCG',
  lot: '',
  doseNumber: '1',
  notes: '',
}

export function PersonalInmunizadorView() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [issued, setIssued] = useState<Patient | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [turno, setTurno] = useState<Patient[]>(mockPatients)

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function validate() {
    const nextErrors: Record<string, string> = {}

    const digits = form.document.replace(/[^\d]/g, '')
    if (digits.length < 7 || digits.length > 8) {
      nextErrors.document =
        'Ingrese una cédula de 7 u 8 dígitos (ej. V-12345678).'
    }
    if (form.fullName.trim().length < 5) {
      nextErrors.fullName = 'Ingrese los nombres completos del paciente.'
    }
    if (!form.birthDate) {
      nextErrors.birthDate = 'La fecha de nacimiento es obligatoria.'
    }
    if (!form.lot.trim()) {
      nextErrors.lot = 'Indique el lote aplicado.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function issueCard() {
    if (!validate()) return

    const cardNumber = `TJ-2026-${String(1_200_000 + turno.length * 137)}`
    const newPatient: Patient = {
      id: `p-${String(turno.length + 1).padStart(3, '0')}`,
      document: form.document.trim(),
      fullName: form.fullName.trim(),
      birthDate: form.birthDate,
      sex: form.sex,
      phone: form.phone.trim() || '—',
      email: form.email.trim() || '—',
      cardNumber,
      municipality: 'Baruta',
      doses: [
        {
          id: `d-${Date.now()}`,
          vaccine:
            vaccineCatalog.find((option) => option.value === form.vaccine)
              ?.label ?? form.vaccine,
          doseNumber: Number(form.doseNumber),
          date: '2026-10-20',
          lot: form.lot.trim().toUpperCase(),
          center: CENTER_NAME,
          appliedBy: APPLICATOR,
        },
      ],
    }

    setTurno((previous) => [newPatient, ...previous])
    setIssued(newPatient)
    setNotice(
      `Tarjeta ${cardNumber} emitida y enviada digitalmente a ${newPatient.email}.`,
    )
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function resetAll() {
    setForm(EMPTY_FORM)
    setErrors({})
    setNotice(null)
    setIssued(null)
  }

  return (
    <div className='mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-widest text-primary'>
            Personal inmunizador
          </p>
          <h1 className='mt-1 text-xl font-semibold tracking-tight text-surface-text'>
            Registro ágil de pacientes — Sala de Vacunación, turno mañana
          </h1>
          <p className='mt-1 text-sm text-text-muted'>
            Turno 08:00 – 14:00 · Aplicador: {APPLICATOR}
          </p>
        </div>
        <Badge variant='info'>Jornada en curso</Badge>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {immunizerKpis.map((metric) => (
          <KPICard
            key={metric.id}
            metric={metric}
          />
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader
            title='Registro de paciente y aplicación'
            subtitle='Los campos marcados son obligatorios para emitir la tarjeta'
          />
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <Input
              label='Cédula de identidad *'
              name='paciente-documento'
              placeholder='V-12345678'
              value={form.document}
              onChange={(event) => updateField('document', event.target.value)}
              error={errors.document}
            />
            <Input
              label='Nombres y apellidos *'
              name='paciente-nombres'
              placeholder='Nombres completos'
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              error={errors.fullName}
            />
            <Input
              label='Fecha de nacimiento *'
              name='paciente-nacimiento'
              type='date'
              value={form.birthDate}
              onChange={(event) => updateField('birthDate', event.target.value)}
              error={errors.birthDate}
            />
            <Select
              label='Sexo'
              name='paciente-sexo'
              options={[
                { value: 'F', label: 'Femenino' },
                { value: 'M', label: 'Masculino' },
              ]}
              value={form.sex}
              onChange={(event) => updateField('sex', event.target.value)}
            />
            <Input
              label='Teléfono de contacto'
              name='paciente-telefono'
              placeholder='+58 412 123 4567'
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
            <Input
              label='Correo para tarjeta digital'
              name='paciente-correo'
              type='email'
              placeholder='correo@ejemplo.pe'
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              hint='Aquí se enviará la tarjeta PDF.'
            />

            <div className='sm:col-span-2 border-t border-border pt-4'>
              <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
                Aplicación
              </p>
            </div>

            <Select
              label='Vacuna *'
              name='aplicacion-vacuna'
              options={vaccineCatalog}
              value={form.vaccine}
              onChange={(event) => updateField('vaccine', event.target.value)}
            />
            <Input
              label='Lote aplicado *'
              name='aplicacion-lote'
              placeholder='Ej. BCG-2510-B'
              value={form.lot}
              onChange={(event) => updateField('lot', event.target.value)}
              error={errors.lot}
            />
            <Select
              label='Número de dosis'
              name='aplicacion-dosis'
              options={[
                { value: '1', label: 'Dosis 1' },
                { value: '2', label: 'Dosis 2' },
                { value: '3', label: 'Dosis 3' },
                { value: '4', label: 'Dosis 4' },
              ]}
              value={form.doseNumber}
              onChange={(event) =>
                updateField('doseNumber', event.target.value)
              }
            />
            <Input
              label='Centro de salud'
              name='aplicacion-centro'
              value={CENTER_NAME}
              readOnly
              disabled
            />
            <Select
              label='Observaciones'
              name='aplicacion-observaciones'
              className='sm:col-span-2'
              options={[
                { value: '', label: 'Sin observaciones' },
                { value: 'reaccion', label: 'Reacción leve post-vacunal' },
                {
                  value: 'contraindicacion',
                  label: 'Contraindicación temporal',
                },
                { value: 'pendiente', label: 'Refuerzo pendiente' },
              ]}
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
            />
          </CardContent>
          <CardFooter className='justify-end gap-2'>
            <Button
              variant='outline'
              onClick={resetAll}
            >
              Limpiar
            </Button>
            <Button onClick={issueCard}>Registrar y emitir tarjeta</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader
            title='Tarjeta de vacunación'
            subtitle='Vista previa del documento que recibirá el paciente'
            actions={
              issued ? <Badge variant='success'>Emitida</Badge> : undefined
            }
          />
          <CardContent>
            {notice ? (
              <div className='mb-4 border border-success/40 bg-success-soft px-4 py-3 text-xs font-medium text-success'>
                {notice}
              </div>
            ) : null}

            {issued ? (
              <div className='border border-border-strong'>
                <div className='flex flex-wrap items-start justify-between gap-3 border-b-2 border-primary bg-surface-alt px-4 py-3'>
                  <div>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-primary'>
                      Tarjeta de vacunación · SIGEV
                    </p>
                    <p className='mt-1 text-base font-bold text-surface-text'>
                      {issued.fullName}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-mono text-xs font-semibold text-surface-text'>
                      {issued.cardNumber}
                    </p>
                    <p className='text-[11px] text-text-muted'>
                      Emitida: 20/10/2026
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 border-b border-border px-4 py-3 text-xs sm:grid-cols-4'>
                  <div>
                    <p className='text-[10px] uppercase tracking-widest text-text-muted'>
                      Documento
                    </p>
                    <p className='font-semibold'>{issued.document}</p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase tracking-widest text-text-muted'>
                      Nacimiento
                    </p>
                    <p className='font-semibold'>{issued.birthDate}</p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase tracking-widest text-text-muted'>
                      Sexo
                    </p>
                    <p className='font-semibold'>{issued.sex}</p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase tracking-widest text-text-muted'>
                      Distrito
                    </p>
                    <p className='font-semibold'>{issued.municipality}</p>
                  </div>
                </div>

                <Table className='border-0'>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Vacuna</TableHeaderCell>
                      <TableHeaderCell>Dosis</TableHeaderCell>
                      <TableHeaderCell>Fecha</TableHeaderCell>
                      <TableHeaderCell>Lote</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {issued.doses.map((dose) => (
                      <TableRow
                        key={dose.id}
                        highlight
                      >
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className='border-t border-border px-4 py-3 text-[11px] text-text-muted'>
                  Aplicado en {issued.doses.at(-1)?.center} por{' '}
                  {issued.doses.at(-1)?.appliedBy}
                </div>
              </div>
            ) : (
              <div className='flex min-h-56 flex-col items-center justify-center border border-dashed border-border-strong bg-surface-alt px-6 py-8 text-center'>
                <p className='text-sm font-semibold text-surface-text'>
                  Aún no se ha emitido una tarjeta
                </p>
                <p className='mt-1 max-w-sm text-xs text-text-muted'>
                  Complete el formulario del paciente y pulse «Registrar y
                  emitir tarjeta» para generar la tarjeta de vacunación digital.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <span className='text-[11px] text-text-muted'>
              Emisión simultánea al correo del paciente
            </span>
            <Badge variant='neutral'>PDF + QR institucional</Badge>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader
          title='Pacientes del turno'
          subtitle='Registros de la jornada en curso'
          actions={<Badge variant='neutral'>{turno.length} pacientes</Badge>}
        />
        <Table className='border-0'>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Paciente</TableHeaderCell>
              <TableHeaderCell>Documento</TableHeaderCell>
              <TableHeaderCell>Nacimiento</TableHeaderCell>
              <TableHeaderCell>Dosis registradas</TableHeaderCell>
              <TableHeaderCell>Última aplicación</TableHeaderCell>
              <TableHeaderCell className='text-right'>Acciones</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turno.map((patient) => {
              const lastDose = patient.doses.at(-1)

              return (
                <TableRow key={patient.id}>
                  <TableCell>
                    <p className='font-semibold'>{patient.fullName}</p>
                    <p className='text-[11px] text-text-muted'>
                      {patient.cardNumber}
                    </p>
                  </TableCell>
                  <TableCell className='font-mono text-xs'>
                    {patient.document}
                  </TableCell>
                  <TableCell className='font-mono text-xs'>
                    {patient.birthDate}
                  </TableCell>
                  <TableCell>
                    <Badge variant='info'>{patient.doses.length}</Badge>
                  </TableCell>
                  <TableCell className='text-xs'>
                    {lastDose ? `${lastDose.vaccine} · ${lastDose.date}` : '—'}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        setIssued(patient)
                        setNotice(null)
                      }}
                    >
                      Ver tarjeta
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
