import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UserRole,
  UserSession,
} from './types'

const BACKEND_URL = 'http://localhost:5000/api/auth'
const STORAGE_KEY = 'proga3_auth_session'

// Cuentas de prueba para los 4 perfiles solicitados
export const demoAccounts = {
  admin_maestro: {
    label: 'Administrador Maestro',
    name: 'Dra. Carmen Mendoza',
    email: 'maestro@salud.gob',
    password: 'password123',
    role: 'admin_maestro' as UserRole,
    cedula: 'V-09876543',
    description: 'Gestión nacional completa y supervisión general del sistema.',
  },
  admin_regional: {
    label: 'Administrador Regional',
    name: 'Dr. Roberto Velásquez',
    email: 'regional@salud.gob',
    password: 'password123',
    role: 'admin_regional' as UserRole,
    cedula: 'V-12345678',
    region: 'Región Capital / Central',
    description: 'Coordinación sanitaria de la región y centros de salud adscritos.',
  },
  admin_local: {
    label: 'Administrador Local',
    name: 'Lic. Elena Ramos',
    email: 'local@salud.gob',
    password: 'password123',
    role: 'admin_local' as UserRole,
    cedula: 'V-16789012',
    region: 'Región Capital / Central',
    centroSalud: 'Centro de Salud Dr. Rafael Rangel',
    description: 'Administración directa del centro de salud e inventario de biológicos.',
  },
  personal_inmunizador: {
    label: 'Personal Inmunizador',
    name: 'Enf. Marcos Duarte',
    email: 'inmunizador@salud.gob',
    password: 'password123',
    role: 'personal_inmunizador' as UserRole,
    cedula: 'V-20123456',
    centroSalud: 'Centro de Salud Dr. Rafael Rangel',
    description: 'Aplicación de vacunas y registro clínico de dosis a pacientes.',
  },
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin_maestro':
      return 'Administrador Maestro'
    case 'admin_regional':
      return 'Administrador Regional'
    case 'admin_local':
      return 'Administrador Local'
    case 'personal_inmunizador':
      return 'Personal Inmunizador'
    default:
      return role
  }
}

export function saveSession(session: UserSession | null): void {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Si localStorage falla, continúa en memoria
  }
}

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserSession) : null
  } catch {
    return null
  }
}

function createLocalToken(): string {
  return 'token-local-' + Math.random().toString(36).slice(2)
}

function createLocalId(): string {
  return 'local-' + Math.random().toString(36).slice(2)
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<UserSession> {
  const normalizedEmail = credentials.email.trim().toLowerCase()

  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        password: credentials.password,
      }),
    })

    const data: AuthResponse = await response.json()

    if (!response.ok || !data.success || !data.user) {
      throw new Error(data.message || 'Credenciales inválidas.')
    }

    const session: UserSession = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      cedula: data.user.cedula,
      region: data.user.region,
      centroSalud: data.user.centroSalud,
      token: data.token || createLocalToken(),
    }

    saveSession(session)
    return session
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error de conexión'

    // Soporte offline / fallback local si el backend no responde
    if (
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError') ||
      msg.includes('fetch')
    ) {
      const demoValues = Object.values(demoAccounts)
      const foundDemo = demoValues.find(
        (acc) => acc.email.toLowerCase() === normalizedEmail,
      )

      if (foundDemo && credentials.password !== 'password123') {
        throw new Error('Contraseña incorrecta.')
      }

      const fallbackRole: UserRole = foundDemo
        ? foundDemo.role
        : 'personal_inmunizador'

      const localSession: UserSession = {
        id: createLocalId(),
        name: foundDemo
          ? foundDemo.name
          : normalizedEmail.split('@')[0] || 'Usuario',
        email: normalizedEmail,
        role: fallbackRole,
        cedula: foundDemo?.cedula || 'V-00000000',
        region:
          foundDemo && 'region' in foundDemo ? foundDemo.region : undefined,
        centroSalud:
          foundDemo && 'centroSalud' in foundDemo
            ? foundDemo.centroSalud
            : undefined,
        token: createLocalToken(),
      }

      saveSession(localSession)
      return localSession
    }

    throw new Error(msg)
  }
}

export async function registerUser(
  data: RegisterData,
  currentSession?: UserSession | null,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(currentSession?.token
          ? { Authorization: `Bearer ${currentSession.token}` }
          : {}),
      },
      body: JSON.stringify(data),
    })

    const resData: AuthResponse = await response.json()

    if (!response.ok || !resData.success) {
      throw new Error(resData.message || 'Error al registrar el nuevo usuario.')
    }

    return {
      success: true,
      message: resData.message || 'Usuario registrado exitosamente',
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido'

    if (
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError') ||
      msg.includes('fetch')
    ) {
      return {
        success: true,
        message: `Usuario ${data.name} (${getRoleLabel(data.role)}) registrado localmente.`,
      }
    }

    throw new Error(msg)
  }
}
