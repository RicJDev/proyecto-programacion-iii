import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserSession } from '../types/models';
import { ROLE_PERMISSIONS, type Permission, type UserRole } from '../types/permissions';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: UserSession | null;
  role: UserRole | null;
  login: (email: string, password?: string) => boolean;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'vacunacion_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default con el Administrador Maestro para tener acceso inicial completo
    return DEMO_USERS.admin_maestro;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function login(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    const foundRole = (Object.keys(DEMO_USERS) as UserRole[]).find(
      (r) => DEMO_USERS[r].email.toLowerCase() === normalized
    );

    if (foundRole) {
      setUser(DEMO_USERS[foundRole]);
      return true;
    }

    // Fallback: Si ingresa cualquier otro correo, se asigna como personal inmunizador por defecto
    setUser({
      id: 'usr-custom-' + Math.random().toString(36).slice(2, 6),
      name: normalized.split('@')[0],
      email: normalized,
      role: 'personal_inmunizador',
      cedula: 'V-00000000',
      region: 'Miranda',
      centroSalud: 'Ambulatorio La Victoria',
      permissions: ROLE_PERMISSIONS.personal_inmunizador,
    });
    return true;
  }

  function switchRole(newRole: UserRole) {
    if (DEMO_USERS[newRole]) {
      setUser(DEMO_USERS[newRole]);
    }
  }

  function logout() {
    setUser(null);
  }

  function hasPermission(permission: Permission): boolean {
    if (!user) return false;
    return user.permissions.includes(permission);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        login,
        switchRole,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

