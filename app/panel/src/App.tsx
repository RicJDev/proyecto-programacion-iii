import { useState } from 'react'
import { AppFooter, AppHeader } from './components/layout/AppHeader'
import { AdminLocalView } from './views/AdminLocalView'
import { AdminMaestroView } from './views/AdminMaestroView'
import { AdminRegionalView } from './views/AdminRegionalView'
import { PersonalInmunizadorView } from './views/PersonalInmunizadorView'
import { roleProfiles } from './mockData'
import type { RoleId } from './types'

function App() {
  const [role, setRole] = useState<RoleId>('ministerio')
  const profile =
    roleProfiles.find((item) => item.id === role) ?? roleProfiles[0]

  return (
    <div className='flex min-h-screen flex-col bg-bg'>
      <AppHeader
        profile={profile}
        activeRole={role}
        onRoleChange={setRole}
      />

      <main className='flex-1'>
        {role === 'ministerio' && <AdminMaestroView />}
        {role === 'sacs' && <AdminRegionalView />}
        {role === 'centro' && <AdminLocalView />}
        {role === 'inmunizador' && <PersonalInmunizadorView />}
      </main>

      <AppFooter profile={profile} />
    </div>
  )
}

export default App
