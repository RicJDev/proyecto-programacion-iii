import bcrypt from 'bcrypt'
import type { PrismaClient } from '../src/generated/prisma/client'

const SALT_ROUNDS = 10

export async function seedProd(prisma: PrismaClient) {
  console.log('Cargando semilla de producción (seed.prod.ts)...')

  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD?.trim()
  if (!initialPassword) {
    throw new Error(
      'La variable de entorno ADMIN_INITIAL_PASSWORD es obligatoria para ejecutar la semilla en producción.',
    )
  }

  const adminEmail = (
    process.env.ADMIN_INITIAL_EMAIL?.trim() || 'admin@salud.gob'
  ).toLowerCase()
  const adminName =
    process.env.ADMIN_INITIAL_NAME?.trim() || 'Administrador Maestro MPPS'

  const passwordHash = await bcrypt.hash(initialPassword, SALT_ROUNDS)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      roles: { connect: [{ name: 'admin_maestro' }] },
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      roles: { connect: [{ name: 'admin_maestro' }] },
    },
  })

  console.log(
    `Semilla de producción cargada exitosamente (admin inicial: ${adminEmail}).`,
  )
}
