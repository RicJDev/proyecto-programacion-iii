import type { Patient, Vaccine } from '../types'

function CardHeader({ patient }: { patient: Patient }) {
  return (
    <>
      <h1>{patient.name}</h1>
      <p>Sexo: {patient.gender}</p>
      <p>Fecha de nacimiento: {patient.birthday}</p>
      <p>
        Tutor: {patient.parent.name} ({patient.parent.relationship}) —{' '}
        {patient.parent.phone}
      </p>
    </>
  )
}

function VaccineItem({ vaccine }: { vaccine: Vaccine }) {
  return (
    <>
      <h3>{vaccine.name}</h3>
      <p>Dosis aplicadas: {vaccine.doses.length}</p>
      <ul>
        {vaccine.doses.map((dose) => (
          <li key={dose}>{dose}</li>
        ))}
      </ul>
    </>
  )
}

interface CardProps {
  patient: Patient
  vaccines: Vaccine[]
}

export function Card({ patient, vaccines }: CardProps) {
  return (
    <>
      <CardHeader patient={patient} />
      <section>
        <h2>Vacunas</h2>
        <ul>
          {vaccines.map((vaccine) => (
            <li key={vaccine.name}>
              <VaccineItem vaccine={vaccine} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
