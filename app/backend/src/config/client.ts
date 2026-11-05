import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma'
import { DB_HOST, DB_NAME, DB_USER } from './variables'

const adapter = new PrismaMariaDb({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
})

export const prisma = new PrismaClient({ adapter })
