export type UserRole =
  | 'admin_maestro'
  | 'admin_regional'
  | 'admin_local'
  | 'personal_inmunizador'

export interface UserSession {
  id: string
  name: string
  email: string
  role: UserRole
  cedula?: string
  region?: string
  centroSalud?: string
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
  role?: UserRole
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: UserRole
  cedula?: string
  region?: string
  centroSalud?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    name: string
    email: string
    role: UserRole
    cedula?: string
    region?: string
    centroSalud?: string
    createdAt: string | Date
  }
  token?: string
}

export interface VaccineApplicationRecord {
  id: string
  pacienteNombre: string
  pacienteCedula: string
  vacuna: string
  dosis: string
  lote: string
  fecha: string
  inmunizador: string
  centroSalud: string
}
