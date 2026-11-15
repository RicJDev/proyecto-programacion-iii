/** Identificadores de los perfiles/roles del sistema. */
export type RoleId = 'ministerio' | 'sacs' | 'centro' | 'inmunizador'

/** Roles operativos que pueden asignarse a un usuario del sistema. */
export type SystemRole =
  | 'Administrador Maestro'
  | 'Administrador Regional'
  | 'Administrador Local'
  | 'Personal Inmunizador'

export type UserStatus = 'activo' | 'inactivo' | 'pendiente'

export type CenterStatus = 'activo' | 'inactivo' | 'suspendido'

export type InventoryStatus =
  'disponible' | 'stock_bajo' | 'por_vencer' | 'vencido'

export type DocumentStatus = 'pendiente' | 'aprobado' | 'rechazado'

export type Sex = 'M' | 'F'

export type TrendDirection = 'up' | 'down' | 'stable'

/** Perfil de acceso simulado (Dev Role Switcher). */
export interface RoleProfile {
  id: RoleId
  label: string
  scope: string
  organization: string
}

export interface SystemUser {
  id: string
  fullName: string
  email: string
  document: string
  role: SystemRole
  region: string
  status: UserStatus
  createdAt: string
  lastAccess: string
}

export interface Region {
  id: string
  name: string
  code: string
  coverage: number
  centers: number
  population: number
}

export interface HealthCenter {
  id: string
  code: string
  name: string
  regionId: string
  municipality: string
  address: string
  adminId: string | null
  status: CenterStatus
}

export interface InventoryItem {
  id: string
  centerId: string
  vaccine: string
  laboratory: string
  lot: string
  availableDoses: number
  totalDoses: number
  expiryDate: string
  status: InventoryStatus
}

export interface Dose {
  id: string
  vaccine: string
  doseNumber: number
  date: string
  lot: string
  center: string
  appliedBy: string
}

export interface Patient {
  id: string
  document: string
  fullName: string
  birthDate: string
  sex: Sex
  phone: string
  email: string
  cardNumber: string
  municipality: string
  doses: Dose[]
}

export interface DocumentRecord {
  id: string
  folio: string
  patientName: string
  document: string
  type:
    | 'Certificado de vacunación'
    | 'Consentimiento informado'
    | 'Comprobante de identidad'
  submittedAt: string
  status: DocumentStatus
}

export interface KpiMetric {
  id: string
  label: string
  value: string
  unit?: string
  trend: TrendDirection
  trendValue: string
  hint: string
}
