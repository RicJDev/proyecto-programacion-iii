import fs from 'node:fs'
import path from 'node:path'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../src/generated/prisma/client'
import { DB_URL } from '../src/config/variables'
import { seedBase } from './seed.base'
import { seedDev } from './seed.dev'
import { seedProd } from './seed.prod'

const adapter = new PrismaMariaDb(DB_URL)
const prisma = new PrismaClient({ adapter })

function parseSqlStatements(sqlContent: string): string[] {
  const withoutComments = sqlContent
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')

  return withoutComments
    .split(/;\s*(?:\r?\n|$)/)
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0)
}

async function runSqlFile(filePath: string, label: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Archivo SQL no encontrado: ${filePath}`)
    return
  }

  const sqlContent = fs.readFileSync(filePath, 'utf8')
  const statements = parseSqlStatements(sqlContent)

  console.log(`Ejecutando ${label} (${statements.length} sentencias SQL)...`)

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement)
  }

  console.log(`${label} ejecutado correctamente.`)
}

async function main() {
  console.log('Iniciando carga de semilla...')

  const baseSqlPath = path.join(__dirname, 'seed.base.sql')

  // 1. Cargar SIEMPRE los datos geográficos base en SQL (Estados, Municipios y Parroquias)
  await runSqlFile(baseSqlPath, 'Semilla Geográfica Base (seed.base.sql)')

  // 2. Cargar SIEMPRE el resto de datos base desde seed.base.ts (Vacunas, Permisos y Roles)
  await seedBase(prisma)

  // 3. Cargar datos según el entorno (producción o desarrollo)
  if (process.env.NODE_ENV === 'production') {
    await seedProd(prisma)
  } else {
    await seedDev(prisma)
  }

  const [
    statesCount,
    municipalitiesCount,
    parishesCount,
    vaccinesCount,
    permissionsCount,
    rolesCount,
  ] = await Promise.all([
    prisma.state.count(),
    prisma.municipality.count(),
    prisma.parish.count(),
    prisma.vaccine.count(),
    prisma.permission.count(),
    prisma.role.count(),
  ])

  console.log('------------------------------------------------------------')
  console.log('Semilla completada exitosamente:')
  console.log(`- Estados cargados: ${statesCount}`)
  console.log(`- Municipios cargados: ${municipalitiesCount}`)
  console.log(`- Parroquias cargadas: ${parishesCount}`)
  console.log(`- Vacunas cargadas: ${vaccinesCount}`)
  console.log(`- Permisos cargados: ${permissionsCount}`)
  console.log(`- Roles cargados: ${rolesCount}`)
  console.log('------------------------------------------------------------')
}

main()
  .catch((e) => {
    console.error('Error durante la ejecucion de la semilla:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
