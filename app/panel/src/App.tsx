import { useState } from 'react'
import { AppFooter, AppHeader } from './components/layout/AppHeader'
import { AdminLocalView } from './views/AdminLocalView'
import { AdminMaestroView } from './views/AdminMaestroView'
import { AdminRegionalView } from './views/AdminRegionalView'
import { PersonalInmunizadorView } from './views/PersonalInmunizadorView'
import { LoginView } from './views/LoginView'
import { roleProfiles } from './mockData'
import { getStoredSession, logoutApi, type UserSession } from './lib/auth'
import type { RoleId } from './types'

function mapRoleToRoleId(roleName?: string): RoleId {
  switch (roleName) {
    case 'ADMIN':
    case 'admin_maestro':
      return 'ministerio'
    case 'admin_regional':
      return 'sacs'
    case 'admin_local':
      return 'centro'
    case 'OPERATOR':
    case 'personal_inmunizador':
      return 'inmunizador'
    default:
      return 'ministerio'
  }
}

function App() {
  const [session, setSession] = useState<UserSession | null>(() => getStoredSession())
  const [role, setRole] = useState<RoleId>(() =>
    mapRoleToRoleId(getStoredSession()?.role),
  )

  const profile =
    roleProfiles.find((item) => item.id === role) ?? roleProfiles[0]

  async function handleLogout() {
    await logoutApi()
    setSession(null)
  }

  function handleLoginSuccess(newSession: UserSession) {
    setSession(newSession)
    setRole(mapRoleToRoleId(newSession.role))
  }

  if (!session) {
    return (
      <div className='flex min-h-screen flex-col bg-bg'>
        <AppHeader
          profile={profile}
          activeRole={role}
          onRoleChange={setRole}
          user={null}
        />
        <main className='flex-1'>
          <LoginView onSuccess={handleLoginSuccess} />
        </main>
        <AppFooter profile={profile} isLoggedIn={false} />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col bg-bg'>
      <AppHeader
        profile={profile}
        activeRole={role}
        onRoleChange={setRole}
        user={{ name: session.name, email: session.email, role: session.role }}
        onLogout={handleLogout}
      />

      <main className='flex-1'>
        {role === 'ministerio' && <AdminMaestroView />}
        {role === 'sacs' && <AdminRegionalView />}
        {role === 'centro' && <AdminLocalView />}
        {role === 'inmunizador' && <PersonalInmunizadorView />}
      </main>

      <AppFooter profile={profile} isLoggedIn={true} />
    </div>
  )
}

export default App
