import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, type NavTab } from './components/layout/Navbar';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { RecipientsView } from './views/RecipientsView';
import { ImmunizationView } from './views/ImmunizationView';
import { CertificatesView } from './views/CertificatesView';
import { CentersView } from './views/CentersView';
import { InventoryView } from './views/InventoryView';
import { UsersView } from './views/UsersView';
import { PERMISSIONS } from './types/permissions';

function MainPanel() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  if (!user) {
    return <LoginView />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="gov-container" style={{ flex: 1, width: '100%' }}>
        {activeTab === 'dashboard' && <DashboardView />}

        {activeTab === 'recipients' &&
          (hasPermission(PERMISSIONS.RECIPIENTS_READ) ? (
            <RecipientsView />
          ) : (
            <AccessDenied permission="recipients:read" />
          ))}

        {activeTab === 'immunization' &&
          (hasPermission(PERMISSIONS.IMMUNIZATIONS_READ) ? (
            <ImmunizationView />
          ) : (
            <AccessDenied permission="immunizations:read" />
          ))}

        {activeTab === 'certificates' &&
          (hasPermission(PERMISSIONS.CERTIFICATES_ISSUE) ||
          hasPermission(PERMISSIONS.CERTIFICATES_VERIFY) ? (
            <CertificatesView />
          ) : (
            <AccessDenied permission="certificates:issue / certificates:verify" />
          ))}

        {activeTab === 'centers' &&
          (hasPermission(PERMISSIONS.CENTERS_READ) ? (
            <CentersView />
          ) : (
            <AccessDenied permission="centers:read" />
          ))}

        {activeTab === 'inventory' &&
          (hasPermission(PERMISSIONS.INVENTORY_READ) ? (
            <InventoryView />
          ) : (
            <AccessDenied permission="inventory:read" />
          ))}

        {activeTab === 'users' &&
          (hasPermission(PERMISSIONS.USERS_READ) ? (
            <UsersView />
          ) : (
            <AccessDenied permission="users:read" />
          ))}
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          marginTop: '2rem',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <strong>Sistema Nacional de Información y Control de Vacunación &copy; 2026</strong>
          <div>República Bolivariana de Venezuela — Ministerio del Poder Popular para la Salud</div>
          <div style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
            Diseño plano institucional conforme a directrices de estilo (`rounded-none`).
          </div>
        </div>
      </footer>
    </div>
  );
}

function AccessDenied({ permission }: { permission: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-danger-bg)',
        border: '1px solid var(--color-danger)',
        padding: '2rem',
        textAlign: 'center',
        margin: '2rem auto',
        maxWidth: '600px',
      }}
    >
      <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }}>Acceso No Autorizado (403 Forbidden)</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
        Su rol actual no posee el permiso requerido: <code>{permission}</code>.
      </p>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
        Utilice el selector rápido de rol en la barra superior para alternar a un perfil con atribuciones suficientes.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainPanel />
    </AuthProvider>
  );
}
