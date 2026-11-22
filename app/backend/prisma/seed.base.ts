import type { PrismaClient } from '../src/generated/prisma/client'

export const BASE_VACCINES = [
  { id: 1, name: 'BCG (Bacilo Calmette-Guérin)', type: 'Bacteriana viva atenuada' },
  { id: 2, name: 'Hepatitis B Pediátrica', type: 'Recombinante vírica' },
  { id: 3, name: 'Pentavalente (DPT + HB + Hib)', type: 'Combinada bacteriana/vírica' },
  { id: 4, name: 'Polio Oral / Inactivada (OPV/IPV)', type: 'Vírica atenuada / inactivada' },
  { id: 5, name: 'Fiebre Amarilla (Antiamarílica)', type: 'Vírica viva atenuada' },
  { id: 6, name: 'SRP (Trivalente Viral: Sarampión, Rubéola, Parotiditis)', type: 'Vírica viva atenuada' },
  { id: 7, name: 'Toxoide Tetánico Diftérico (Td)', type: 'Toxoide bacteriano' },
  { id: 8, name: 'Rotavirus', type: 'Vírica viva atenuada' },
  { id: 9, name: 'Neumococo Conjugada (PCV13)', type: 'Bacteriana conjugada' },
  { id: 10, name: 'Influenza Estacional', type: 'Vírica inactivada' },
  { id: 11, name: 'COVID-19 (Sputnik V / Sinopharm)', type: 'Vector viral / Inactivada' },
] as const

export const BASE_PERMISSIONS = [
  {
    name: 'users:create',
    description: 'Crear y registrar nuevas cuentas de usuario administrativas en el sistema',
  },
  {
    name: 'users:read',
    description: 'Consultar y listar cuentas de usuario existentes',
  },
  {
    name: 'users:update',
    description: 'Actualizar datos, credenciales y perfiles de usuarios administrativos',
  },
  {
    name: 'users:suspend',
    description: 'Suspender, desactivar o revocar el acceso a un usuario',
  },
  {
    name: 'roles:manage',
    description: 'Crear roles y gestionar la asignación granular de permisos',
  },
  {
    name: 'centers:create',
    description: 'Registrar y habilitar un nuevo centro de salud asociado a su parroquia, municipio y estado',
  },
  {
    name: 'centers:read',
    description: 'Consultar el directorio, ubicación y detalles de centros de salud',
  },
  {
    name: 'centers:update',
    description: 'Modificar datos, estatus operativo e información de centros de salud',
  },
  {
    name: 'recipients:create',
    description: 'Dar de alta a un nuevo ciudadano/paciente en el sistema',
  },
  {
    name: 'recipients:read',
    description: 'Buscar y consultar expedientes de pacientes por cédula de identidad o nombre',
  },
  {
    name: 'recipients:update',
    description: 'Actualizar información demográfica, peso o datos clínicos base de los pacientes',
  },
  {
    name: 'representations:manage',
    description: 'Crear y gestionar vínculos de representación legal para menores o dependientes',
  },
  {
    name: 'vaccines:manage',
    description: 'Administrar el catálogo nacional de vacunas y biológicos',
  },
  {
    name: 'schemes:manage',
    description: 'Definir y publicar esquemas de vacunación por rango de edad y vacunas asociadas',
  },
  {
    name: 'shipments:manage',
    description: 'Registrar órdenes de envío, remitentes y detalles de lotes despachados a los centros',
  },
  {
    name: 'inventory:read',
    description: 'Consultar existencias de stock, lotes y fechas de expiración disponibles en el centro',
  },
  {
    name: 'inventory:manage',
    description: 'Recepcionar lotes, actualizar existencias y controlar el inventario local del centro',
  },
  {
    name: 'immunizations:create',
    description: 'Registrar la aplicación de una dosis vinculando paciente, tarjeta, lote, fecha/hora y centro',
  },
  {
    name: 'immunizations:read',
    description: 'Consultar el historial de dosis aplicadas de un paciente',
  },
  {
    name: 'exams:create',
    description: 'Configurar exámenes médicos, parámetros (mínimo/máximo) y registrar resultados de aptitud',
  },
  {
    name: 'exams:read',
    description: 'Consultar el historial de evaluaciones y resultados de exámenes médicos de un paciente',
  },
  {
    name: 'cards:issue',
    description: 'Generar, actualizar e imprimir/reenviar la tarjeta digital de vacunación con código QR único',
  },
  {
    name: 'certificates:issue',
    description: 'Emitir y firmar electrónicamente el Certificado Oficial de Salud del paciente',
  },
  {
    name: 'certificates:verify',
    description: 'Validar públicamente la autenticidad de tarjetas y certificados mediante su código único/QR',
  },
  {
    name: 'reports:national',
    description: 'Acceder al dashboard centralizado de métricas epidemiológicas y comparativas nacionales',
  },
  {
    name: 'reports:regional',
    description: 'Visualizar mapas interactivos y estadísticas de cobertura a nivel estatal/regional',
  },
  {
    name: 'reports:local',
    description: 'Generar reportes operativos de dosis aplicadas y movimientos de inventario por centro',
  },
] as const

export const BASE_ROLES = [
  {
    id: 1,
    name: 'admin_maestro',
    description: 'Administrador Maestro (Ministerio del Poder Popular para la Salud)',
    permissions: [
      'users:create',
      'users:read',
      'users:update',
      'users:suspend',
      'roles:manage',
      'centers:create',
      'centers:read',
      'centers:update',
      'recipients:read',
      'vaccines:manage',
      'schemes:manage',
      'shipments:manage',
      'inventory:read',
      'inventory:manage',
      'immunizations:read',
      'exams:create',
      'exams:read',
      'certificates:verify',
      'reports:national',
      'reports:regional',
      'reports:local',
    ],
  },
  {
    id: 2,
    name: 'admin_regional',
    description: 'Administrador Regional (Direcciones Regionales de Salud / SACS)',
    permissions: [
      'users:create',
      'users:read',
      'users:update',
      'users:suspend',
      'centers:create',
      'centers:read',
      'centers:update',
      'recipients:read',
      'shipments:manage',
      'inventory:read',
      'immunizations:read',
      'exams:read',
      'cards:issue',
      'certificates:issue',
      'certificates:verify',
      'reports:regional',
      'reports:local',
    ],
  },
  {
    id: 3,
    name: 'admin_local',
    description: 'Administrador Local (Centro de Salud / Institución sanitaria)',
    permissions: [
      'users:read',
      'users:update',
      'centers:read',
      'recipients:create',
      'recipients:read',
      'recipients:update',
      'representations:manage',
      'inventory:read',
      'inventory:manage',
      'immunizations:create',
      'immunizations:read',
      'exams:create',
      'exams:read',
      'cards:issue',
      'certificates:verify',
      'reports:local',
    ],
  },
] as const

export async function seedBase(prisma: PrismaClient) {
  console.log('Cargando vacunas base...')
  for (const vaccine of BASE_VACCINES) {
    await prisma.vaccine.upsert({
      where: { id: vaccine.id },
      update: { name: vaccine.name, type: vaccine.type },
      create: { id: vaccine.id, name: vaccine.name, type: vaccine.type },
    })
  }

  console.log('Cargando permisos RBAC base...')
  for (const permission of BASE_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: { name: permission.name, description: permission.description },
    })
  }

  console.log('Cargando roles y matriz de permisos...')
  for (const role of BASE_ROLES) {
    const permissionLinks = role.permissions.map((name) => ({ name }))
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        description: role.description,
        permissions: { set: permissionLinks },
      },
      create: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: { connect: permissionLinks },
      },
    })
  }

  console.log(
    `Datos base cargados: ${BASE_VACCINES.length} vacunas, ${BASE_PERMISSIONS.length} permisos y ${BASE_ROLES.length} roles.`,
  )
}
