import bcrypt from 'bcrypt'
import type { PrismaClient } from '../src/generated/prisma/client'

const SALT_ROUNDS = 10

async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

export async function seedDev(prisma: PrismaClient) {
  console.log('Cargando semilla de desarrollo (seed.dev.ts)...')

  // 1. Usuarios de desarrollo (contraseña: password123)
  const devPasswordHash = await hashPassword('password123')

  const devUsers = [
    {
      name: 'Dra. Carmen Mendoza',
      email: 'admin@salud.gob',
      roleName: 'admin_maestro',
    },
    {
      name: 'Dr. Roberto Velásquez',
      email: 'regional.miranda@salud.gob',
      roleName: 'admin_regional',
    },
    {
      name: 'Lic. Elena Ramos',
      email: 'local.lavictoria@salud.gob',
      roleName: 'admin_local',
    },
  ] as const

  for (const user of devUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        passwordHash: devPasswordHash,
        roles: { set: [{ name: user.roleName }] },
      },
      create: {
        name: user.name,
        email: user.email,
        passwordHash: devPasswordHash,
        roles: { connect: [{ name: user.roleName }] },
      },
    })
  }

  // 2. Centros de salud vinculados a parroquias reales de seed.base.sql
  // 113: Las Delicias (Girardot, Aragua)
  // 122: José Félix Ribas (La Victoria, Aragua)
  // 1117: Altagracia (Libertador, Distrito Capital)
  // 1120: Catedral (Libertador, Distrito Capital)
  // 1066: Bolívar (Maracaibo, Zulia)
  const healthCenters = [
    {
      id: 1,
      idParish: 113,
      name: 'Hospital Central de Maracay',
      address: 'Av. Las Delicias, Parroquia Las Delicias, Maracay',
    },
    {
      id: 2,
      idParish: 122,
      name: 'Ambulatorio Urbano La Victoria',
      address: 'Calle Rivas Dávila, Parroquia José Félix Ribas, La Victoria',
    },
    {
      id: 3,
      idParish: 1117,
      name: 'Ambulatorio Urbano Altagracia',
      address: 'Av. Baralt, Parroquia Altagracia, Caracas',
    },
    {
      id: 4,
      idParish: 1120,
      name: 'Hospital Vargas de Caracas',
      address: 'Esquina San Lorenzo, Parroquia Catedral, Caracas',
    },
    {
      id: 5,
      idParish: 1066,
      name: 'Hospital Central Dr. Urquinaona',
      address: 'Av. 2 El Milagro, Parroquia Bolívar, Maracaibo',
    },
  ] as const

  for (const center of healthCenters) {
    await prisma.healthCenter.upsert({
      where: { id: center.id },
      update: {
        idParish: center.idParish,
        name: center.name,
        address: center.address,
      },
      create: {
        id: center.id,
        idParish: center.idParish,
        name: center.name,
        address: center.address,
      },
    })
  }

  // 3. Esquemas de vacunación
  const schedules = [
    {
      id: 1,
      ageRange: '0-12 años (Infantil)',
      publishedDate: new Date('2026-01-01T00:00:00Z'),
      vaccineIds: [1, 2, 3, 4, 6, 8, 9],
    },
    {
      id: 2,
      ageRange: '13-65 años (Adultos)',
      publishedDate: new Date('2026-01-01T00:00:00Z'),
      vaccineIds: [5, 7, 10, 11],
    },
  ] as const

  for (const schedule of schedules) {
    const vaccineLinks = schedule.vaccineIds.map((id) => ({ id }))
    await prisma.vaccinationSchedule.upsert({
      where: { id: schedule.id },
      update: {
        ageRange: schedule.ageRange,
        publishedDate: schedule.publishedDate,
        vaccines: { set: vaccineLinks },
      },
      create: {
        id: schedule.id,
        ageRange: schedule.ageRange,
        publishedDate: schedule.publishedDate,
        vaccines: { connect: vaccineLinks },
      },
    })
  }

  // 4. Lotes de vacunas
  const batches = [
    { id: 1, idVaccine: 1, lotNumber: 'LOT-BCG-2026-01', expirationDate: new Date('2027-12-31') },
    { id: 2, idVaccine: 2, lotNumber: 'LOT-HEPB-2026-02', expirationDate: new Date('2027-11-30') },
    { id: 3, idVaccine: 3, lotNumber: 'LOT-PENTA-2026-03', expirationDate: new Date('2027-10-15') },
    { id: 4, idVaccine: 5, lotNumber: 'LOT-FA-2026-04', expirationDate: new Date('2028-03-20') },
    { id: 5, idVaccine: 7, lotNumber: 'LOT-TD-2026-05', expirationDate: new Date('2028-06-30') },
  ] as const

  for (const batch of batches) {
    await prisma.batch.upsert({
      where: { id: batch.id },
      update: {
        idVaccine: batch.idVaccine,
        lotNumber: batch.lotNumber,
        expirationDate: batch.expirationDate,
      },
      create: {
        id: batch.id,
        idVaccine: batch.idVaccine,
        lotNumber: batch.lotNumber,
        expirationDate: batch.expirationDate,
      },
    })
  }

  // 5. Inventario por centro de salud
  const inventories = [
    { idHealthCenter: 1, idBatch: 1, quantityAvailable: 250 },
    { idHealthCenter: 1, idBatch: 3, quantityAvailable: 180 },
    { idHealthCenter: 2, idBatch: 4, quantityAvailable: 320 },
    { idHealthCenter: 3, idBatch: 2, quantityAvailable: 150 },
    { idHealthCenter: 4, idBatch: 5, quantityAvailable: 400 },
  ] as const

  for (const inv of inventories) {
    await prisma.inventory.upsert({
      where: {
        idHealthCenter_idBatch: {
          idHealthCenter: inv.idHealthCenter,
          idBatch: inv.idBatch,
        },
      },
      update: { quantityAvailable: inv.quantityAvailable },
      create: {
        idHealthCenter: inv.idHealthCenter,
        idBatch: inv.idBatch,
        quantityAvailable: inv.quantityAvailable,
      },
    })
  }

  // 6. Personas / Pacientes
  const carlos = await prisma.person.upsert({
    where: { identificationNumber: 'V-20123456' },
    update: {
      firstName: 'Carlos',
      secondName: 'Andrés',
      lastName: 'Pérez',
      secondLastName: 'Gómez',
      weight: 78.5,
    },
    create: {
      genre: 'M',
      weight: 78.5,
      birthday: new Date('1990-05-15T00:00:00Z'),
      firstName: 'Carlos',
      secondName: 'Andrés',
      lastName: 'Pérez',
      secondLastName: 'Gómez',
      identificationNumber: 'V-20123456',
    },
  })

  const maria = await prisma.person.upsert({
    where: { identificationNumber: 'V-22987654' },
    update: {
      firstName: 'María',
      secondName: 'Alejandra',
      lastName: 'González',
      secondLastName: 'Rojas',
      weight: 62.0,
    },
    create: {
      genre: 'F',
      weight: 62.0,
      birthday: new Date('1992-09-22T00:00:00Z'),
      firstName: 'María',
      secondName: 'Alejandra',
      lastName: 'González',
      secondLastName: 'Rojas',
      identificationNumber: 'V-22987654',
    },
  })

  const lucia = await prisma.person.upsert({
    where: { identificationNumber: 'V-34567890' },
    update: {
      firstName: 'Lucía',
      secondName: 'Valentina',
      lastName: 'Pérez',
      secondLastName: 'González',
      weight: 18.2,
    },
    create: {
      genre: 'F',
      weight: 18.2,
      birthday: new Date('2020-03-10T00:00:00Z'),
      firstName: 'Lucía',
      secondName: 'Valentina',
      lastName: 'Pérez',
      secondLastName: 'González',
      identificationNumber: 'V-34567890',
    },
  })

  // 7. Representaciones legales
  const representations = [
    { idRepresentative: carlos.id, idRepresented: lucia.id, relationType: 'padre' },
    { idRepresentative: maria.id, idRepresented: lucia.id, relationType: 'madre' },
  ] as const

  for (const rep of representations) {
    await prisma.representation.upsert({
      where: {
        idRepresentative_idRepresented: {
          idRepresentative: rep.idRepresentative,
          idRepresented: rep.idRepresented,
        },
      },
      update: { relationType: rep.relationType },
      create: {
        idRepresentative: rep.idRepresentative,
        idRepresented: rep.idRepresented,
        relationType: rep.relationType,
      },
    })
  }

  // 8. Tarjetas de vacunación
  const cardCarlos = await prisma.vaccineCard.upsert({
    where: { code: 'TARJ-2026-0001' },
    update: { status: 'ACTIVA' },
    create: {
      idPerson: carlos.id,
      idVaccinationSchedule: 2,
      status: 'ACTIVA',
      emissionDate: new Date('2026-01-15T10:30:00Z'),
      code: 'TARJ-2026-0001',
    },
  })

  const cardMaria = await prisma.vaccineCard.upsert({
    where: { code: 'TARJ-2026-0002' },
    update: { status: 'ACTIVA' },
    create: {
      idPerson: maria.id,
      idVaccinationSchedule: 2,
      status: 'ACTIVA',
      emissionDate: new Date('2026-02-10T09:15:00Z'),
      code: 'TARJ-2026-0002',
    },
  })

  const cardLucia = await prisma.vaccineCard.upsert({
    where: { code: 'TARJ-2026-0003' },
    update: { status: 'ACTIVA' },
    create: {
      idPerson: lucia.id,
      idVaccinationSchedule: 1,
      status: 'ACTIVA',
      emissionDate: new Date('2026-03-05T11:00:00Z'),
      code: 'TARJ-2026-0003',
    },
  })

  // 9. Inmunizaciones
  const immunizations = [
    {
      id: 1,
      idVaccineCard: cardCarlos.id,
      idBatch: 4,
      idHealthCenter: 1,
      dateTime: new Date('2026-01-15T10:30:00Z'),
    },
    {
      id: 2,
      idVaccineCard: cardMaria.id,
      idBatch: 5,
      idHealthCenter: 2,
      dateTime: new Date('2026-02-10T09:15:00Z'),
    },
    {
      id: 3,
      idVaccineCard: cardLucia.id,
      idBatch: 3,
      idHealthCenter: 1,
      dateTime: new Date('2026-03-05T11:00:00Z'),
    },
  ] as const

  for (const imm of immunizations) {
    await prisma.immunization.upsert({
      where: { id: imm.id },
      update: { dateTime: imm.dateTime },
      create: {
        id: imm.id,
        idVaccineCard: imm.idVaccineCard,
        idBatch: imm.idBatch,
        idHealthCenter: imm.idHealthCenter,
        dateTime: imm.dateTime,
      },
    })
  }

  // 10. Exámenes médicos y parámetros
  const examHemograma = await prisma.medicalExam.upsert({
    where: { id: 1 },
    update: { name: 'Hemograma completo', description: 'Evaluación hematológica básica' },
    create: { id: 1, name: 'Hemograma completo', description: 'Evaluación hematológica básica' },
  })

  const examGlucosa = await prisma.medicalExam.upsert({
    where: { id: 2 },
    update: { name: 'Glucosa en ayunas', description: 'Nivel de glucemia basal' },
    create: { id: 2, name: 'Glucosa en ayunas', description: 'Nivel de glucemia basal' },
  })

  const paramHemoglobina = await prisma.medicalExamParameter.upsert({
    where: { id: 1 },
    update: { min: 12.0, max: 17.5 },
    create: { id: 1, idMedicalExam: examHemograma.id, min: 12.0, max: 17.5 },
  })

  const paramGlucosa = await prisma.medicalExamParameter.upsert({
    where: { id: 2 },
    update: { min: 70.0, max: 100.0 },
    create: { id: 2, idMedicalExam: examGlucosa.id, min: 70.0, max: 100.0 },
  })

  // 11. Certificados médicos
  await prisma.medicalCertificate.upsert({
    where: { code: 'CERT-2026-0001' },
    update: { date: new Date('2026-01-15T10:45:00Z') },
    create: {
      idPerson: carlos.id,
      date: new Date('2026-01-15T10:45:00Z'),
      code: 'CERT-2026-0001',
    },
  })

  await prisma.medicalCertificate.upsert({
    where: { code: 'CERT-2026-0002' },
    update: { date: new Date('2026-02-10T09:30:00Z') },
    create: {
      idPerson: maria.id,
      date: new Date('2026-02-10T09:30:00Z'),
      code: 'CERT-2026-0002',
    },
  })

  // 12. Resultados de exámenes médicos
  await prisma.medicalExamResult.upsert({
    where: { id: 1 },
    update: { value: 14.8 },
    create: {
      id: 1,
      idPerson: carlos.id,
      idMedicalExamParameter: paramHemoglobina.id,
      value: 14.8,
      date: new Date('2026-01-15T10:00:00Z'),
    },
  })

  await prisma.medicalExamResult.upsert({
    where: { id: 2 },
    update: { value: 88.0 },
    create: {
      id: 2,
      idPerson: maria.id,
      idMedicalExamParameter: paramGlucosa.id,
      value: 88.0,
      date: new Date('2026-02-10T08:45:00Z'),
    },
  })

  console.log('Semilla de desarrollo (seed.dev.ts) cargada exitosamente.')
}
