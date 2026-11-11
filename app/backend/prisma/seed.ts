import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../src/generated/prisma/client'
import { DB_URL } from '../src/config/variables'

const adapter = new PrismaMariaDb(DB_URL)
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

  // --- Permisos ---
  const permReadUsers = await prisma.permission.create({
    data: { name: 'READ_USERS', description: 'Permite ver usuarios y perfiles' },
  })
  const permManageImmunizations = await prisma.permission.create({
    data: { name: 'MANAGE_IMMUNIZATIONS', description: 'Permite registrar vacunas e inmunizaciones' },
  })
  const permFullControl = await prisma.permission.create({
    data: { name: 'FULL_CONTROL', description: 'Acceso total al sistema' },
  })
  const permManageCenters = await prisma.permission.create({
    data: { name: 'MANAGE_CENTERS', description: 'Gestión de centros de salud' },
  })
  const permReadReports = await prisma.permission.create({
    data: { name: 'READ_REPORTS', description: 'Ver reportes e informes' },
  })
  const permManageStaff = await prisma.permission.create({
    data: { name: 'MANAGE_STAFF', description: 'Gestión del personal de salud' },
  })
  const permManageStock = await prisma.permission.create({
    data: { name: 'MANAGE_STOCK', description: 'Gestión del inventario de vacunas' },
  })

  // --- Roles ---
  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'Administrador Maestro con acceso total',
      permissions: {
        connect: [
          { id: permReadUsers.id },
          { id: permManageImmunizations.id },
          { id: permFullControl.id },
        ],
      },
    },
  })

  const regionalRole = await prisma.role.create({
    data: {
      name: 'REGIONAL',
      description: 'Administrador Regional',
      permissions: {
        connect: [
          { id: permManageCenters.id },
          { id: permReadReports.id },
        ],
      },
    },
  })

  const localRole = await prisma.role.create({
    data: {
      name: 'LOCAL',
      description: 'Administrador Local',
      permissions: {
        connect: [
          { id: permManageStaff.id },
          { id: permManageStock.id },
        ],
      },
    },
  })

  const operatorRole = await prisma.role.create({
    data: {
      name: 'OPERATOR',
      description: 'Personal Inmunizador autorizado para registrar dosis',
      permissions: {
        connect: [{ id: permManageImmunizations.id }],
      },
    },
  })

  // --- Usuarios de desarrollo ---
  // Contraseña para todos: password123
  // Hash generado con bcrypt (cost factor 10)
  const devPasswordHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'

  await prisma.user.create({
    data: {
      name: 'Dra. Carmen Mendoza',
      email: 'admin@healthsystem.com',
      passwordHash: devPasswordHash,
      roles: { connect: [{ id: adminRole.id }] },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Dr. Roberto Velásquez',
      email: 'regional@salud.gob',
      passwordHash: devPasswordHash,
      roles: { connect: [{ id: regionalRole.id }] },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Lic. Elena Ramos',
      email: 'local@salud.gob',
      passwordHash: devPasswordHash,
      roles: { connect: [{ id: localRole.id }] },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Enf. Cristian Feo',
      email: 'crisnotanfeo@gmail.com',
      passwordHash: devPasswordHash,
      roles: { connect: [{ id: operatorRole.id }] },
    },
  })

  // --- Geografía ---
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
        include: { parishes: true },
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

  // --- Receptores / Pacientes ---
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

  // --- Vacunas ---
  const vaccine1 = await prisma.vaccine.create({
    data: { name: 'Tétanos (Toxoide Tetánico)', type: 'Bacteriana inactiva' },
  })

  const vaccine2 = await prisma.vaccine.create({
    data: { name: 'Fiebre Amarilla', type: 'Virus atenuado' },
  })

  // --- Inmunizaciones ---
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
        observations: 'Paciente apto para vacunación y certificado médico vial.',
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

  // Silenciar variables no utilizadas (para evitar warnings de TypeScript)
  void recipient2
  void vaccine2

  console.log('Semilla creada exitosamente!')
}

main()
  .catch((e) => {
    console.error('Error durante la generacion de la semilla:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
