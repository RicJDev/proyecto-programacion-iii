import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT ?? 5000
export const DB_NAME = process.env.DB_NAME ?? ''
export const DB_ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD ?? ''
export const DB_USER = process.env.DB_USER ?? ''
export const DB_HOST = process.env.DB_HOST ?? 'localhost'
export const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
export const DATABASE_URL = process.env.DATABASE_URL ?? ''
export const HOST = process.env.HOST ?? 'localhost'
