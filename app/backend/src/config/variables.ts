export const BACKEND_HOST = process.env.BACKEND_HOST ?? 'localhost'
export const BACKEND_PORT = process.env.BACKEND_PORT ?? 5000

export const DB_HOST = process.env.DB_HOST ?? 'localhost'
export const DB_PORT = isNaN(Number(process.env.DB_PORT))
  ? Number(process.env.DB_PORT)
  : 3306
export const DB_ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD ?? 'root'
export const DB_NAME = process.env.DB_NAME ?? 'vacunas'
export const DB_USER = process.env.DB_USER ?? 'vacunas'
export const DB_PASSWORD = process.env.DB_PASSWORD ?? 'vacunas'
export const DB_URL =
  process.env.DB_URL ??
  `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
