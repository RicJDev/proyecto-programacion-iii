import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'root',
  database: 'vacunas',
})

export const prisma = new PrismaClient({ adapter })
