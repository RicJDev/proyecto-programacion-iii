import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../src/generated/prisma/client'
import { DB_URL } from '../src/config/variables'
import bcrypt from 'bcrypt'

const adapter = new PrismaMariaDb(DB_URL)
const prisma = new PrismaClient({ adapter })

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

async function main() {
  console.log('🌱  Iniciando seed…\n')

  // =========================================================================
  // 0. Limpieza (orden inverso por dependencias de FK)
  // =========================================================================
  console.log('🧹  Limpiando datos previos…')
  await prisma.medicalExamResult.deleteMany()
  await prisma.medicalCertificate.deleteMany()
  await prisma.immunization.deleteMany()
  await prisma.medicalExamParameter.deleteMany()
  await prisma.medicalExam.deleteMany()
  await prisma.parentChild.deleteMany()
  await prisma.vaccine.deleteMany()
  await prisma.person.deleteMany()
  await prisma.healthCenter.deleteMany()
  await prisma.parish.deleteMany()
  await prisma.municipality.deleteMany()
  await prisma.state.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.permission.deleteMany()
  console.log('    ✔ Limpieza completada\n')

  // =========================================================================
  // 1. PERMISSIONS
  // =========================================================================
  console.log('🔑  Creando permisos…')
  const permissionNames = [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'persons:read',
    'persons:create',
    'persons:update',
    'vaccines:read',
    'vaccines:manage',
    'immunizations:read',
    'immunizations:create',
    'certificates:read',
    'certificates:issue',
    'reports:read',
  ] as const

  const permissions: Record<string, { id: number }> = {}
  for (const name of permissionNames) {
    permissions[name] = await prisma.permission.create({
      data: { name, description: `Permiso: ${name}` },
    })
  }
  console.log(`    ✔ ${permissionNames.length} permisos creados\n`)

  // =========================================================================
  // 2. ROLES
  // =========================================================================
  console.log('🎭  Creando roles…')

  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrador con acceso total',
      permissions: {
        connect: Object.values(permissions).map((p) => ({ id: p.id })),
      },
    },
  })

  const doctorRole = await prisma.role.create({
    data: {
      name: 'doctor',
      description: 'Personal médico',
      permissions: {
        connect: [
          permissions['persons:read'],
          permissions['persons:create'],
          permissions['persons:update'],
          permissions['vaccines:read'],
          permissions['immunizations:read'],
          permissions['immunizations:create'],
          permissions['certificates:read'],
          permissions['certificates:issue'],
          permissions['reports:read'],
        ].map((p) => ({ id: p.id })),
      },
    },
  })

  const nurseRole = await prisma.role.create({
    data: {
      name: 'nurse',
      description: 'Personal de enfermería',
      permissions: {
        connect: [
          permissions['persons:read'],
          permissions['vaccines:read'],
          permissions['immunizations:read'],
          permissions['immunizations:create'],
          permissions['certificates:read'],
        ].map((p) => ({ id: p.id })),
      },
    },
  })

  const viewerRole = await prisma.role.create({
    data: {
      name: 'viewer',
      description: 'Solo lectura',
      permissions: {
        connect: [
          permissions['persons:read'],
          permissions['vaccines:read'],
          permissions['immunizations:read'],
          permissions['certificates:read'],
          permissions['reports:read'],
        ].map((p) => ({ id: p.id })),
      },
    },
  })
  console.log('    ✔ 4 roles creados\n')

  // =========================================================================
  // 3. USERS
  // =========================================================================
  console.log('👤  Creando usuarios…')
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador del Sistema',
      email: 'admin@vacunacion.local',
      passwordHash: await hashPassword('Admin123!'),
      roles: { connect: [{ id: adminRole.id }] },
    },
  })

  const doctorUser = await prisma.user.create({
    data: {
      name: 'Dra. María González',
      email: 'doctor@vacunacion.local',
      passwordHash: await hashPassword('Doctor123!'),
      roles: { connect: [{ id: doctorRole.id }] },
    },
  })

  const nurseUser = await prisma.user.create({
    data: {
      name: 'Enf. Pedro Ramírez',
      email: 'nurse@vacunacion.local',
      passwordHash: await hashPassword('Nurse123!'),
      roles: { connect: [{ id: nurseRole.id }] },
    },
  })

  await prisma.user.create({
    data: {
      name: 'Visitante de Consulta',
      email: 'viewer@vacunacion.local',
      passwordHash: await hashPassword('Viewer123!'),
      roles: { connect: [{ id: viewerRole.id }] },
    },
  })
  console.log('    ✔ 4 usuarios creados\n')

  // =========================================================================
  // 4. GEOGRAFÍA: States → Municipalities → Parishes → HealthCenters
  // =========================================================================
  console.log('🗺️   Creando geografía…')

  const stateCapital = await prisma.state.create({
    data: { name: 'Distrito Capital' },
  })
  const stateMiranda = await prisma.state.create({ data: { name: 'Miranda' } })
  const stateZulia = await prisma.state.create({ data: { name: 'Zulia' } })

  const munLibertador = await prisma.municipality.create({
    data: { name: 'Libertador', idState: stateCapital.id },
  })
  const munChacao = await prisma.municipality.create({
    data: { name: 'Chacao', idState: stateCapital.id },
  })
  const munSucre = await prisma.municipality.create({
    data: { name: 'Sucre', idState: stateMiranda.id },
  })
  const munMaracaibo = await prisma.municipality.create({
    data: { name: 'Maracaibo', idState: stateZulia.id },
  })

  const parishAltagracia = await prisma.parish.create({
    data: { name: 'Altagracia', idMunicipality: munLibertador.id },
  })
  const parishCatedral = await prisma.parish.create({
    data: { name: 'Catedral', idMunicipality: munLibertador.id },
  })
  const parishChacao = await prisma.parish.create({
    data: { name: 'Chacao', idMunicipality: munChacao.id },
  })
  const parishPetare = await prisma.parish.create({
    data: { name: 'Petare', idMunicipality: munSucre.id },
  })
  const parishBolivar = await prisma.parish.create({
    data: { name: 'Bolívar', idMunicipality: munMaracaibo.id },
  })

  const hcAltagracia = await prisma.healthCenter.create({
    data: {
      name: 'Ambulatorio Urbano Altagracia',
      address: 'Av. Baralt, Parroquia Altagracia, Caracas',
      idParish: parishAltagracia.id,
    },
  })
  const hcVargas = await prisma.healthCenter.create({
    data: {
      name: 'Hospital Vargas de Caracas',
      address: 'Esquina San Lorenzo, Parroquia Catedral, Caracas',
      idParish: parishCatedral.id,
    },
  })
  const hcChacao = await prisma.healthCenter.create({
    data: {
      name: 'Ambulatorio Chacao',
      address: 'Av. Francisco de Miranda, Parroquia Chacao',
      idParish: parishChacao.id,
    },
  })
  const hcPetare = await prisma.healthCenter.create({
    data: {
      name: 'Ambulatorio Petare',
      address: 'Calle Sucre, Parroquia Petare',
      idParish: parishPetare.id,
    },
  })
  const hcMaracaibo = await prisma.healthCenter.create({
    data: {
      name: 'Hospital Central de Maracaibo',
      address: 'Av. 3 con Calle 68, Parroquia Bolívar',
      idParish: parishBolivar.id,
    },
  })
  console.log(
    '    ✔ 3 estados, 4 municipios, 5 parroquias, 5 centros de salud\n',
  )

  // =========================================================================
  // 5. VACCINES
  // =========================================================================
  console.log('💉  Creando vacunas…')
  const vaccineData = [
    { name: 'BCG', type: 'Bacteriana atenuada' },
    { name: 'Hepatitis B', type: 'Recombinante' },
    { name: 'Pentavalente (DPT+HB+Hib)', type: 'Combinada' },
    { name: 'Antipoliomielítica (OPV)', type: 'Virus atenuado' },
    { name: 'Trivalente viral (SRP)', type: 'Virus atenuado' },
    { name: 'Fiebre amarilla', type: 'Virus atenuado' },
    { name: 'Toxoide diftérico-tetánico (Td)', type: 'Toxoide' },
  ]
  const vaccines: Record<string, { id: number }> = {}
  for (const v of vaccineData) {
    vaccines[v.name] = await prisma.vaccine.create({ data: v })
  }
  const [vBCG, vHepB, vPenta, vOPV, vSRP, vFiebreAmarilla, vTd] =
    vaccineData.map((v) => vaccines[v.name])
  console.log(`    ✔ ${vaccineData.length} vacunas creadas\n`)

  // =========================================================================
  // 6. PERSONS
  // =========================================================================
  console.log('👨‍👩‍👧  Creando personas…')

  // Familia Pérez Gómez
  const carlos = await prisma.person.create({
    data: {
      genre: 'M',
      birthday: new Date('1990-05-15'),
      name: 'Carlos',
      secondName: 'Andrés',
      lastName: 'Pérez',
      secondLastName: 'Gómez',
      identificationNumber: 'V-12345678',
      weight: 78.5,
    },
  })
  const ana = await prisma.person.create({
    data: {
      genre: 'F',
      birthday: new Date('1992-09-22'),
      name: 'Ana',
      secondName: 'María',
      lastName: 'Martínez',
      secondLastName: 'Rojas',
      identificationNumber: 'V-23456789',
      weight: 62.0,
    },
  })
  const lucia = await prisma.person.create({
    data: {
      genre: 'F',
      birthday: new Date('2020-03-10'),
      name: 'Lucía',
      lastName: 'Pérez',
      secondLastName: 'Martínez',
      identificationNumber: 'V-34567890',
      weight: 18.2,
    },
  })
  const diego = await prisma.person.create({
    data: {
      genre: 'M',
      birthday: new Date('2022-11-05'),
      name: 'Diego',
      secondName: 'Alejandro',
      lastName: 'Pérez',
      secondLastName: 'Martínez',
      weight: 11.4,
    },
  })

  // Familia Rodríguez Silva
  const luis = await prisma.person.create({
    data: {
      genre: 'M',
      birthday: new Date('1985-01-30'),
      name: 'Luis',
      lastName: 'Rodríguez',
      secondLastName: 'Silva',
      identificationNumber: 'V-87654321',
      weight: 85.0,
    },
  })
  const camila = await prisma.person.create({
    data: {
      genre: 'F',
      birthday: new Date('1988-07-14'),
      name: 'Camila',
      secondName: 'Isabel',
      lastName: 'Fernández',
      identificationNumber: 'V-76543210',
      weight: 58.5,
    },
  })
  const sofia = await prisma.person.create({
    data: {
      genre: 'F',
      birthday: new Date('2018-12-25'),
      name: 'Sofía',
      lastName: 'Rodríguez',
      secondLastName: 'Fernández',
      weight: 22.8,
    },
  })

  // Persona sin identificación (recién nacido)
  const recienNacido = await prisma.person.create({
    data: {
      genre: 'M',
      birthday: new Date('2024-11-20'),
      name: 'Mateo',
      lastName: 'Rodríguez',
      secondLastName: 'Fernández',
      weight: 3.2,
    },
  })
  console.log('    ✔ 8 personas creadas\n')

  // =========================================================================
  // 7. PARENT-CHILD (relaciones familiares)
  // =========================================================================
  console.log('🔗  Vinculando padres e hijos…')
  await prisma.parentChild.createMany({
    data: [
      // Carlos & Ana → Lucía
      { parentId: carlos.id, childId: lucia.id, relationType: 'padre' },
      { parentId: ana.id, childId: lucia.id, relationType: 'madre' },
      // Carlos & Ana → Diego
      { parentId: carlos.id, childId: diego.id, relationType: 'padre' },
      { parentId: ana.id, childId: diego.id, relationType: 'madre' },
      // Luis & Camila → Sofía
      { parentId: luis.id, childId: sofia.id, relationType: 'padre' },
      { parentId: camila.id, childId: sofia.id, relationType: 'madre' },
      // Luis & Camila → Mateo
      { parentId: luis.id, childId: recienNacido.id, relationType: 'padre' },
      { parentId: camila.id, childId: recienNacido.id, relationType: 'madre' },
    ],
  })
  console.log('    ✔ 8 relaciones parentales creadas\n')

  // =========================================================================
  // 8. IMMUNIZATIONS
  // =========================================================================
  console.log('💉  Registrando inmunizaciones…')

  const immLuciaBCG = await prisma.immunization.create({
    data: {
      idPerson: lucia.id,
      idVaccine: vBCG.id,
      dateTime: new Date('2020-03-12T09:30:00'),
      idCenter: hcAltagracia.id,
    },
  })
  const immLuciaHepB = await prisma.immunization.create({
    data: {
      idPerson: lucia.id,
      idVaccine: vHepB.id,
      dateTime: new Date('2020-03-12T09:45:00'),
      idCenter: hcAltagracia.id,
    },
  })
  await prisma.immunization.create({
    data: {
      idPerson: lucia.id,
      idVaccine: vPenta.id,
      dateTime: new Date('2020-05-15T10:00:00'),
      idCenter: hcChacao.id,
    },
  })
  await prisma.immunization.create({
    data: {
      idPerson: lucia.id,
      idVaccine: vOPV.id,
      dateTime: new Date('2020-05-15T10:15:00'),
      idCenter: hcChacao.id,
    },
  })
  const immLuciaSRP = await prisma.immunization.create({
    data: {
      idPerson: lucia.id,
      idVaccine: vSRP.id,
      dateTime: new Date('2021-03-10T11:00:00'),
      idCenter: hcChacao.id,
    },
  })

  const immDiegoBCG = await prisma.immunization.create({
    data: {
      idPerson: diego.id,
      idVaccine: vBCG.id,
      dateTime: new Date('2022-11-07T08:20:00'),
      idCenter: hcPetare.id,
    },
  })
  await prisma.immunization.create({
    data: {
      idPerson: diego.id,
      idVaccine: vPenta.id,
      dateTime: new Date('2023-01-10T09:00:00'),
      idCenter: hcPetare.id,
    },
  })

  const immSofiaSRP = await prisma.immunization.create({
    data: {
      idPerson: sofia.id,
      idVaccine: vSRP.id,
      dateTime: new Date('2019-12-27T10:30:00'),
      idCenter: hcMaracaibo.id,
    },
  })
  await prisma.immunization.create({
    data: {
      idPerson: sofia.id,
      idVaccine: vFiebreAmarilla.id,
      dateTime: new Date('2020-12-28T11:00:00'),
      idCenter: hcMaracaibo.id,
    },
  })

  await prisma.immunization.create({
    data: {
      idPerson: recienNacido.id,
      idVaccine: vBCG.id,
      dateTime: new Date('2024-11-21T07:45:00'),
      idCenter: hcVargas.id,
    },
  })
  await prisma.immunization.create({
    data: {
      idPerson: recienNacido.id,
      idVaccine: vHepB.id,
      dateTime: new Date('2024-11-21T08:00:00'),
      idCenter: hcVargas.id,
    },
  })

  // Adultos
  await prisma.immunization.create({
    data: {
      idPerson: carlos.id,
      idVaccine: vTd.id,
      dateTime: new Date('2024-01-15T09:00:00'),
      idCenter: hcAltagracia.id,
    },
  })
  await prisma.immunization.create({
    data: {
      idPerson: ana.id,
      idVaccine: vTd.id,
      dateTime: new Date('2024-02-20T09:00:00'),
      idCenter: hcChacao.id,
    },
  })
  console.log('    ✔ 13 inmunizaciones registradas\n')

  // =========================================================================
  // 9. MEDICAL EXAMS + PARAMETERS
  // =========================================================================
  console.log('🧪  Creando exámenes y parámetros…')

  const examHemograma = await prisma.medicalExam.create({
    data: { name: 'Hemograma completo' },
  })
  const examPerfilLipidico = await prisma.medicalExam.create({
    data: { name: 'Perfil lipídico' },
  })
  const examGlucosa = await prisma.medicalExam.create({
    data: { name: 'Glucosa en ayunas' },
  })

  const paramLeucocitos = await prisma.medicalExamParameter.create({
    data: { medicalExamId: examHemograma.id, min: 4.0, max: 11.0 },
  })
  const paramHemoglobina = await prisma.medicalExamParameter.create({
    data: { medicalExamId: examHemograma.id, min: 12.0, max: 17.5 },
  })
  const paramPlaquetas = await prisma.medicalExamParameter.create({
    data: { medicalExamId: examHemograma.id, min: 150.0, max: 450.0 },
  })
  const paramColesterol = await prisma.medicalExamParameter.create({
    data: { medicalExamId: examPerfilLipidico.id, min: 0.0, max: 200.0 },
  })
  const paramTrigliceridos = await prisma.medicalExamParameter.create({
    data: { medicalExamId: examPerfilLipidico.id, min: 0.0, max: 150.0 },
  })
  const paramGlucosa = await prisma.medicalExamParameter.create({
    data: { medicalExamId: examGlucosa.id, min: 70.0, max: 100.0 },
  })
  console.log('    ✔ 3 exámenes con 6 parámetros\n')

  // =========================================================================
  // 10. MEDICAL CERTIFICATES
  // =========================================================================
  console.log('📜  Emitiendo certificados médicos…')

  const certLucia = await prisma.medicalCertificate.create({
    data: {
      idDose: immLuciaSRP.idDose,
      idPerson: lucia.id,
      code: 'CERT-2025-000001',
    },
  })
  const certDiego = await prisma.medicalCertificate.create({
    data: {
      idDose: immDiegoBCG.idDose,
      idPerson: diego.id,
      code: 'CERT-2025-000002',
    },
  })
  const certSofia = await prisma.medicalCertificate.create({
    data: {
      idDose: immSofiaSRP.idDose,
      idPerson: sofia.id,
      code: 'CERT-2025-000003',
    },
  })
  const certCarlos = await prisma.medicalCertificate.create({
    data: {
      idDose: immLuciaBCG.idDose, // nota: certificado asociado a una dosis existente
      idPerson: carlos.id,
      code: 'CERT-2025-000004',
    },
  })
  console.log('    ✔ 4 certificados emitidos\n')

  // =========================================================================
  // 11. MEDICAL EXAM RESULTS
  // =========================================================================
  console.log('📊  Registrando resultados de exámenes…')

  await prisma.medicalExamResult.createMany({
    data: [
      // Resultados de Lucía (hemograma)
      {
        medicalExamParameterId: paramLeucocitos.id,
        medicalCertificateId: certLucia.id,
        personId: lucia.id,
        value: 7.5,
        date: new Date('2025-01-10T10:00:00'),
      },
      {
        medicalExamParameterId: paramHemoglobina.id,
        medicalCertificateId: certLucia.id,
        personId: lucia.id,
        value: 13.2,
        date: new Date('2025-01-10T10:00:00'),
      },
      {
        medicalExamParameterId: paramPlaquetas.id,
        medicalCertificateId: certLucia.id,
        personId: lucia.id,
        value: 280.0,
        date: new Date('2025-01-10T10:00:00'),
      },
      // Resultados de Diego
      {
        medicalExamParameterId: paramLeucocitos.id,
        medicalCertificateId: certDiego.id,
        personId: diego.id,
        value: 6.8,
        date: new Date('2025-01-15T11:30:00'),
      },
      {
        medicalExamParameterId: paramHemoglobina.id,
        medicalCertificateId: certDiego.id,
        personId: diego.id,
        value: 12.5,
        date: new Date('2025-01-15T11:30:00'),
      },
      // Resultados de Sofía
      {
        medicalExamParameterId: paramLeucocitos.id,
        medicalCertificateId: certSofia.id,
        personId: sofia.id,
        value: 8.1,
        date: new Date('2025-02-05T09:15:00'),
      },
      // Resultados de Carlos (perfil lipídico + glucosa)
      {
        medicalExamParameterId: paramColesterol.id,
        medicalCertificateId: certCarlos.id,
        personId: carlos.id,
        value: 185.0,
        date: new Date('2025-02-20T08:00:00'),
      },
      {
        medicalExamParameterId: paramTrigliceridos.id,
        medicalCertificateId: certCarlos.id,
        personId: carlos.id,
        value: 140.0,
        date: new Date('2025-02-20T08:00:00'),
      },
      {
        medicalExamParameterId: paramGlucosa.id,
        medicalCertificateId: certCarlos.id,
        personId: carlos.id,
        value: 92.0,
        date: new Date('2025-02-20T08:00:00'),
      },
    ],
  })
  console.log('    ✔ 9 resultados registrados\n')

  // =========================================================================
  // Resumen
  // =========================================================================
  console.log('========================================')
  console.log('✅  SEED COMPLETADO EXITOSAMENTE')
  console.log('========================================')
  console.log('🔐  Credenciales de acceso:')
  console.log('    admin@vacunacion.local  →  Admin123!')
  console.log('    doctor@vacunacion.local →  Doctor123!')
  console.log('    nurse@vacunacion.local  →  Nurse123!')
  console.log('    viewer@vacunacion.local →  Viewer123!')
  console.log('========================================\n')

  // Silencia warnings de variables no usadas
  void adminUser
  void doctorUser
  void nurseUser
  void immLuciaBCG
  void immLuciaHepB
}

main()
  .catch((e) => {
    console.error('❌  Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
