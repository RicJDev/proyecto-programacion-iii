import type { BadgeVariant } from '../components/ui'
import type {
  CenterStatus,
  DocumentStatus,
  InventoryStatus,
  TrendDirection,
  UserStatus,
} from '../types'

export const userStatusVariant: Record<UserStatus, BadgeVariant> = {
  activo: 'success',
  inactivo: 'neutral',
  pendiente: 'warning',
}

export const centerStatusVariant: Record<CenterStatus, BadgeVariant> = {
  activo: 'success',
  inactivo: 'neutral',
  suspendido: 'danger',
}

export const inventoryStatusVariant: Record<InventoryStatus, BadgeVariant> = {
  disponible: 'success',
  stock_bajo: 'danger',
  por_vencer: 'warning',
  vencido: 'danger',
}

export const inventoryStatusLabel: Record<InventoryStatus, string> = {
  disponible: 'Disponible',
  stock_bajo: 'Stock bajo',
  por_vencer: 'Por vencer',
  vencido: 'Vencido',
}

export const documentStatusVariant: Record<DocumentStatus, BadgeVariant> = {
  pendiente: 'warning',
  aprobado: 'success',
  rechazado: 'danger',
}

export const trendVariant: Record<TrendDirection, BadgeVariant> = {
  up: 'success',
  down: 'danger',
  stable: 'neutral',
}
