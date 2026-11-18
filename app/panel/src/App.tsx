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
    <div className="flex min-h-screen flex-col bg-bg text-surface-text">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-6">
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

      <footer className="mt-8 border-t border-border bg-surface px-5 py-5 text-center text-xs text-text-muted">
        <div className="mx-auto max-w-[1400px]">
          <strong className="font-semibold text-surface-text">
            Sistema Nacional de Información y Control de Vacunación &copy; 2026
          </strong>
          <div className="mt-0.5">
            República Bolivariana de Venezuela — Ministerio del Poder Popular para la Salud
          </div>
          <div className="mt-1 text-[11px]">
            Diseño plano institucional conforme a directrices de estilo (rounded-none).
          </div>
        </div>
      </footer>
    </div>
  );
}

function AccessDenied({ permission }: { permission: string }) {
  return (
    <div className="mx-auto my-8 max-w-xl rounded-none border border-danger bg-danger-soft p-8 text-center">
      <h3 className="mb-2 text-base font-bold uppercase tracking-wider text-danger">
        Acceso No Autorizado (403 Forbidden)
      </h3>
      <p className="text-sm text-surface-text">
        Su rol actual no posee el permiso requerido:{' '}
        <code className="border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">
          {permission}
        </code>
        .
      </p>
      <p className="mt-2 text-xs text-text-muted">
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
