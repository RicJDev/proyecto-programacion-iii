import type { Patient, Vaccine } from './types'

export interface PatientRecord {
  patient: Patient
  vaccines: Vaccine[]
}

export const patientRecords: PatientRecord[] = [
  {
    patient: {
      document: 'V-74812305',
      name: 'Sofía Alejandra Ramírez Torres',
      gender: 'F',
      birthday: '2018-04-12',
      email: 'carlos.ramirez@gmail.com',
      cardNumber: 'TJ-2018-0045123',
      municipality: 'Baruta, Estado Miranda',
      parent: {
        name: 'Carlos Ramírez López',
        relationship: 'Padre',
        phone: '+58 412 987 6543',
      },
    },
    vaccines: [
      { name: 'BCG', doses: ['2018-04-12'] },
      {
        name: 'Hepatitis B',
        doses: ['2018-04-12', '2018-05-12', '2018-10-12'],
      },
      {
        name: 'Polio (IPV)',
        doses: ['2018-06-12', '2018-08-12', '2020-06-12'],
      },
      { name: 'Triple viral (SRP)', doses: ['2019-04-15', '2025-04-10'] },
      { name: 'Influenza', doses: ['2024-10-01', '2026-10-19'] },
    ],
  },
  {
    patient: {
      document: 'V-76120984',
      name: 'Mateo Andrés Sequera Hernández',
      gender: 'M',
      birthday: '2021-09-03',
      email: 'm.sequera@gmail.com',
      cardNumber: 'TJ-2021-0118920',
      municipality: 'Sucre, Estado Miranda',
      parent: {
        name: 'Rosa Hernández Álvarez',
        relationship: 'Madre',
        phone: '+58 414 912 3456',
      },
    },
    vaccines: [
      { name: 'BCG', doses: ['2021-09-10'] },
      { name: 'Polio (IPV)', doses: ['2021-10-03', '2022-01-11'] },
      { name: 'Neumococo', doses: ['2021-11-15', '2022-01-11'] },
      { name: 'Triple viral (SRP)', doses: ['2022-09-05'] },
    ],
  },
  {
    patient: {
      document: 'V-41208766',
      name: 'Luis Rafael Cedeño Márquez',
      gender: 'M',
      birthday: '1987-06-14',
      email: 'l.cedeno@gmail.com',
      cardNumber: 'TJ-1987-0002149',
      municipality: 'Libertador, Distrito Capital',
      parent: {
        name: '—',
        relationship: '—',
        phone: '+58 412 945 7721',
      },
    },
    vaccines: [
      { name: 'Triple viral (SRP)', doses: ['1995-06-20'] },
      { name: 'COVID-19 bivalente', doses: ['2025-04-12', '2026-10-19'] },
      { name: 'Influenza', doses: ['2026-10-19'] },
    ],
  },
]
