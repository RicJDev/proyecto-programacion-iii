import type { Patient, Vaccine } from '../types'
import { Badge } from './ui'

export interface CardProps {
  patient: Patient
  vaccines: Vaccine[]
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return iso
  return `${day}/${month}/${year}`
}

export function Card({ patient, vaccines }: CardProps) {
  const totalDoses = vaccines.reduce(
    (sum, vaccine) => sum + vaccine.doses.length,
    0,
  )

  return (
    <div className='border border-border-strong bg-surface'>
      <div className='flex flex-wrap items-start justify-between gap-3 border-b-2 border-primary bg-surface-alt px-5 py-4'>
        <div>
          <p className='text-[10px] font-bold uppercase tracking-widest text-primary'>
            República Bolivariana de Venezuela · Ministerio del Poder Popular
            para la Salud
          </p>
          <h2 className='mt-1 text-base font-bold uppercase tracking-wide text-surface-text'>
            Tarjeta de vacunación
          </h2>
          <p className='text-[11px] text-text-muted'>
            SIGEV — Programa Ampliado de Inmunizaciones (PAI)
          </p>
        </div>
        <div className='text-right'>
          <p className='font-mono text-xs font-semibold text-surface-text'>
            {patient.cardNumber}
          </p>
          <Badge
            variant='success'
            className='mt-1.5'
          >
            Verificada
          </Badge>
        </div>
      </div>

      <div className='grid gap-4 border-b border-border px-5 py-4 sm:grid-cols-3'>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
            Titular
          </p>
          <p className='mt-1 text-sm font-semibold text-surface-text'>
            {patient.name}
          </p>
        </div>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
            Documento
          </p>
          <p className='mt-1 font-mono text-sm text-surface-text'>
            {patient.document}
          </p>
        </div>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
            Fecha de nacimiento
          </p>
          <p className='mt-1 font-mono text-sm text-surface-text'>
            {formatDate(patient.birthday)}
          </p>
        </div>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
            Sexo
          </p>
          <p className='mt-1 text-sm text-surface-text'>{patient.gender}</p>
        </div>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
            Municipio / estado
          </p>
          <p className='mt-1 text-sm text-surface-text'>
            {patient.municipality}
          </p>
        </div>
        <div>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-text-muted'>
            Tutor / contacto
          </p>
          <p className='mt-1 text-sm text-surface-text'>
            {patient.parent.name}{' '}
            <span className='text-text-muted'>
              ({patient.parent.relationship}) · {patient.parent.phone}
            </span>
          </p>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-[520px] text-left text-sm'>
          <thead className='border-b border-border-strong bg-secondary-soft'>
            <tr>
              <th className='px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted'>
                Vacuna
              </th>
              <th className='px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted'>
                Dosis aplicadas
              </th>
              <th className='px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted'>
                Fechas
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {vaccines.map((vaccine) => (
              <tr
                key={vaccine.name}
                className='transition-colors hover:bg-surface-alt'
              >
                <td className='px-5 py-3 font-semibold text-surface-text'>
                  {vaccine.name}
                </td>
                <td className='px-5 py-3'>
                  <Badge variant='info'>{vaccine.doses.length}</Badge>
                </td>
                <td className='px-5 py-3 font-mono text-xs text-text-muted'>
                  {vaccine.doses.map(formatDate).join(' · ')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className='border-t border-border-strong bg-surface-alt'>
              <td className='px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted'>
                Total
              </td>
              <td className='px-5 py-3 text-sm font-semibold text-surface-text'>
                {totalDoses} dosis
              </td>
              <td className='px-5 py-3 text-[11px] text-text-muted'>
                Esquema completo según registro nacional
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
