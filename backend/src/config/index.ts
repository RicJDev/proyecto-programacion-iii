import dotenv from 'dotenv'
import { join } from 'node:path'

dotenv.config({ path: join(__dirname, '../../.env') })

interface Config {
  env: string
  port: number
  mongoose: {
    url: string
  }
}

export const config: Config = {
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '5000', 10),
  mongoose: {
    url: process.env.DB_URI ?? 'mongodb://localhost:27017/app_db',
  },
}
