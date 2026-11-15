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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--color-bg)',
        padding: '1.5rem',
      }}
    >
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Badge variant="primary" style={{ marginBottom: '0.5rem' }}>
            REPÚBLICA BOLIVARIANA DE VENEZUELA
          </Badge>
          <h1 style={{ fontSize: '1.45rem', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
            Sistema Nacional de Inmunización y Vacunación
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
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
              <div
                style={{
                  backgroundColor: 'var(--color-danger-bg)',
                  border: '1px solid var(--color-danger)',
                  color: 'var(--color-danger)',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
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

              <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                Iniciar Sesión
              </Button>
            </form>

            {/* Accesos rápidos de prueba por perfil */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.75rem',
                  textAlign: 'center',
                }}
              >
                Acceso Demostrativo por Perfil Jerárquico:
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoSelect('admin_maestro')}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  👑 Admin Maestro
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoSelect('admin_regional')}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  🌐 Admin Regional
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoSelect('admin_local')}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  🏥 Admin Local
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDemoSelect('personal_inmunizador')}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  💉 Inmunizador
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

