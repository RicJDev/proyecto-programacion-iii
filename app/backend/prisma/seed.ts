import mariadb from 'mariadb'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../src/generated/prisma/client'
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} from '../src/config/variables'

const pool = mariadb.createPool({
  host: DB_HOST || 'localhost',
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
})

const adapter = new PrismaMariaDb(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Cargando semilla...')

  await prisma.medicalCertificate.deleteMany()
  await prisma.medicalExam.deleteMany()
  await prisma.immunization.deleteMany()
  await prisma.vaccine.deleteMany()
  await prisma.recipient.deleteMany()
  await prisma.healthCenter.deleteMany()
  await prisma.parish.deleteMany()
  await prisma.municipality.deleteMany()
  await prisma.state.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.permission.deleteMany()

  const permissionRead = await prisma.permission.create({
    data: {
      name: 'READ_USERS',
      description: 'Permite ver usuarios y perfiles',
    },
  })

  const permissionWrite = await prisma.permission.create({
    data: {
      name: 'MANAGE_IMMUNIZATIONS',
      description: 'Permite registrar vacunas e inmunizaciones',
    },
  })

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'Administrador del sistema con acceso total',
      permissions: {
        connect: [{ id: permissionRead.id }, { id: permissionWrite.id }],
      },
    },
  })

  const operatorRole = await prisma.role.create({
    data: {
      name: 'OPERATOR',
      description: 'Personal de salud autorizado para registrar dosis',
      permissions: {
        connect: [{ id: permissionWrite.id }],
      },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Administrador Principal',
      email: 'admin@healthsystem.com',
      passwordHash: '$2b$10$YourHashedPasswordHerePlaceholder',
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Cristian Feo',
      email: 'crisnotanfeo@gmail.com',
      passwordHash: '$2b$10$YourHashedPasswordHerePlaceholder',
      roles: {
        connect: [{ id: operatorRole.id }],
      },
    },
  })

  const araguaState = await prisma.state.create({
    data: {
      name: 'Aragua',
      municipalities: {
        create: [
          {
            name: 'Girardot',
            parishes: {
              create: [
                { name: 'Las Delicias' },
                { name: 'Madre María de San José' },
              ],
            },
          },
          {
            name: 'Mariño',
            parishes: {
              create: [{ name: 'Aparicio' }, { name: 'Samán Tarazonero' }],
            },
          },
        ],
      },
    },
    include: {
      municipalities: {
        include: {
          parishes: true,
        },
      },
    },
  })

  const targetParish = araguaState.municipalities[0].parishes[0]

  const healthCenter = await prisma.healthCenter.create({
    data: {
      name: 'Hospital Central de Maracay',
      address: 'Av. Las Delicias, Maracay',
      idParish: targetParish.id,
    },
  })

  const recipient1 = await prisma.recipient.create({
    data: {
      name: 'Carlos',
      lastName: 'Pérez',
      identificationNumber: 'V-20123456',
    },
  })

  const recipient2 = await prisma.recipient.create({
    data: {
      name: 'María',
      lastName: 'González',
      identificationNumber: 'V-22987654',
    },
  })

  const vaccine1 = await prisma.vaccine.create({
    data: {
      name: 'Tétanos (Toxoide Tetánico)',
      type: 'Bacteriana inactiva',
    },
  })

  const vaccine2 = await prisma.vaccine.create({
    data: {
      name: 'Fiebre Amarilla',
      type: 'Virus atenuado',
    },
  })

  const immunization1 = await prisma.immunization.create({
    data: {
      idPerson: recipient1.id,
      idVaccine: vaccine1.id,
      dateTime: new Date('2026-01-15T10:30:00Z'),
      idCenter: healthCenter.id,
    },
  })

  const medicalExam = await prisma.medicalExam.create({
    data: {
      idPerson: recipient1.id,
      data: JSON.stringify({
        blood_pressure: '120/80',
        heart_rate: 72,
        temperature: 36.5,
        observations:
          'Paciente apto para vacunación y certificado médico vial.',
      }),
    },
  })

  await prisma.medicalCertificate.create({
    data: {
      code: 'CERT-2026-0001',
      idExam: medicalExam.id,
      idDose: immunization1.idDose,
      idPerson: recipient1.id,
    },
  })

  console.log('Semilla creada!')
}

main()
  .catch((e) => {
    console.error('Error durante la generacion de la semilla:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
