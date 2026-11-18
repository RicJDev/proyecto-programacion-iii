import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { DEMO_USERS } from '../data/mockData';
import type { UserRole } from '../types/permissions';

export function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingrese su correo institucional.');
      return;
    }
    login(email, password);
  }

  function handleDemoSelect(role: UserRole) {
    const demo = DEMO_USERS[role];
    setEmail(demo.email);
    setPassword('password123');
    login(demo.email, 'password123');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-6">
      <div className="w-full max-w-[520px]">
        <div className="mb-6 text-center">
          <Badge variant="primary" className="mb-2">
            REPÚBLICA BOLIVARIANA DE VENEZUELA
          </Badge>
          <h1 className="mt-1 text-2xl font-bold text-primary">
            Sistema Nacional de Inmunización y Vacunación
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Módulo Central de Autenticación Sanitaria (RBAC)
          </p>
        </div>

        <Card>
          <CardHeader
            title="Ingreso al Panel Administrativo"
            subtitle="Identificación oficial mediante credenciales ministeriales"
          />
          <CardBody>
            {error && (
              <div className="mb-4 border border-danger bg-danger-soft p-3 text-sm text-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Correo Electrónico Institucional"
                type="email"
                required
                placeholder="usuario@salud.gob"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Contraseña"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button variant="primary" type="submit" className="mt-2 w-full">
                Iniciar Sesión
              </Button>
            </form>

            {/* Accesos rápidos de prueba por perfil */}
            <div className="mt-6 border-t border-border pt-5">
              <span className="mb-3 block text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                Acceso Demostrativo por Perfil Jerárquico:
              </span>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoSelect('admin_maestro')}
                  className="justify-start text-left"
                >
                  Admin Maestro
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoSelect('admin_regional')}
                  className="justify-start text-left"
                >
                  Admin Regional
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoSelect('admin_local')}
                  className="justify-start text-left"
                >
                  Admin Local
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoSelect('personal_inmunizador')}
                  className="justify-start text-left"
                >
                  Inmunizador
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
