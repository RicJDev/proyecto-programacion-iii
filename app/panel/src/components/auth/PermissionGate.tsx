import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Permission } from '../../types/permissions';

interface CanProps {
  do: Permission | Permission[];
  matchAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ do: permissions, matchAll = false, children, fallback = null }: CanProps) {
  const { hasPermission } = useAuth();

  const perms = Array.isArray(permissions) ? permissions : [permissions];

  const isAllowed = matchAll
    ? perms.every((p) => hasPermission(p))
    : perms.some((p) => hasPermission(p));

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

