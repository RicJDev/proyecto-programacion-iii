export interface UserSession {
  id: string | number
  name: string
  email: string
  role: string
  roles?: string[]
  permissions?: string[]
  token: string
}

const STORAGE_KEY = 'sigev_auth_session'

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
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
    // Ignore storage issues
  }
}

export async function loginApi(email: string, password: string): Promise<UserSession> {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Credenciales inválidas')
  }

  const roleName = data.user.roles?.[0] || 'ADMIN'

  const session: UserSession = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: roleName,
    roles: data.user.roles,
    permissions: data.user.permissions,
    token: data.token,
  }

  saveSession(session)
  return session
}

export async function logoutApi(): Promise<void> {
  try {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' })
  } catch {
    // Continue
  }
  saveSession(null)
}

