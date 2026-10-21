import { useState, type FormEvent } from 'react'
import type { UserSession } from './types'
import { getStoredSession, loginUser, saveSession } from './authService'
import { AdminMaestro } from './AdminMaestro'
import { AdminRegional } from './AdminRegional'
import { AdminLocal } from './AdminLocal'
import { PersonalInmunizador } from './PersonalInmunizador'
import './login.css'

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() =>
    getStoredSession(),
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const session = await loginUser({
        email: email.trim(),
        password: password.trim(),
      })
      setCurrentUser(session)
      setSuccessMessage(`Sesión iniciada correctamente como ${session.name}.`)
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al iniciar sesión.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogout() {
    saveSession(null)
    setCurrentUser(null)
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  function handleFillDemo(demoEmail: string) {
    setEmail(demoEmail)
    setPassword('password123')
    setErrorMessage(null)
  }

  return (
    <div className='login-container'>
      <div className='login-header-box'>
        <span className='login-badge'>Módulo de Autenticación Sanitaria</span>
        <h2 className='login-main-title'>Control y Tarjeta de Vacunación</h2>
        <p className='login-main-subtitle'>
          Sistema unificado de control de vacunas. Ingrese con sus credenciales
          para acceder automáticamente a su panel según su rol asignado.
        </p>
      </div>

      {/* Alerta de Error */}
      {errorMessage && (
        <div className='auth-alert auth-alert-error'>
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Alerta de Éxito */}
      {successMessage && (
        <div className='auth-alert auth-alert-success'>
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {currentUser ? (
        /* VISTA AUTENTICADA: Delegada al archivo de cada tipo de usuario */
        <>
          {currentUser.role === 'admin_maestro' && (
            <AdminMaestro
              session={currentUser}
              onLogout={handleLogout}
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
            />
          )}

          {currentUser.role === 'admin_regional' && (
            <AdminRegional
              session={currentUser}
              onLogout={handleLogout}
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
            />
          )}

          {currentUser.role === 'admin_local' && (
            <AdminLocal
              session={currentUser}
              onLogout={handleLogout}
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
            />
          )}

          {currentUser.role === 'personal_inmunizador' && (
            <PersonalInmunizador
              session={currentUser}
              onLogout={handleLogout}
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
            />
          )}

          {/* Compatibilidad con roles anteriores si existiera sesión previa */}
          {currentUser.role !== 'admin_maestro' &&
            currentUser.role !== 'admin_regional' &&
            currentUser.role !== 'admin_local' &&
            currentUser.role !== 'personal_inmunizador' && (
              <div
                className='login-role-card'
                style={{ textAlign: 'center' }}
              >
                <p>Sesión con rol no reconocido ({currentUser.role}).</p>
                <button
                  type='button'
                  className='session-logout-btn'
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
        </>
      ) : (
        /* VISTA DE INICIO DE SESIÓN UNIFICADA: Solo Correo y Contraseña */
        <div className='login-role-card'>
          <div className='login-role-header'>
            <div className='login-role-icon maestro'>
              <span>🔐</span>
            </div>
            <div>
              <h3 className='login-role-title'>Inicio de Sesión</h3>
              <p className='login-role-desc'>
                El sistema detectará su perfil automáticamente según su correo
                institucional.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className='login-form'
          >
            <div className='login-field-group'>
              <label
                htmlFor='login-email'
                className='login-label'
              >
                Correo Electrónico
              </label>
              <input
                id='login-email'
                type='email'
                className='login-input'
                placeholder='ejemplo: usuario@salud.gob'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='email'
              />
            </div>

            <div className='login-field-group'>
              <label
                htmlFor='login-pass'
                className='login-label'
              >
                Contraseña
              </label>
              <input
                id='login-pass'
                type='password'
                className='login-input'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='current-password'
              />
            </div>

            <button
              type='submit'
              className='login-submit-btn'
              disabled={isLoading}
            >
              {isLoading ? 'Comprobando credenciales...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Acceso Rápido a Cuentas Demo para los 4 Perfiles */}
          <div className='demo-accounts-bar'>
            <div className='demo-accounts-title'>
              Acceso Rápido Demo (4 Tipos de Usuarios):
            </div>
            <div className='demo-accounts-grid'>
              <button
                type='button'
                className='demo-account-btn'
                onClick={() => handleFillDemo('maestro@salud.gob')}
              >
                <span className='demo-role-name'>👑 Admin Maestro</span>
                <span className='demo-role-email'>maestro@salud.gob</span>
              </button>

              <button
                type='button'
                className='demo-account-btn'
                onClick={() => handleFillDemo('regional@salud.gob')}
              >
                <span className='demo-role-name'>🌎 Admin Regional</span>
                <span className='demo-role-email'>regional@salud.gob</span>
              </button>

              <button
                type='button'
                className='demo-account-btn'
                onClick={() => handleFillDemo('local@salud.gob')}
              >
                <span className='demo-role-name'>🏥 Admin Local</span>
                <span className='demo-role-email'>local@salud.gob</span>
              </button>

              <button
                type='button'
                className='demo-account-btn'
                onClick={() => handleFillDemo('inmunizador@salud.gob')}
              >
                <span className='demo-role-name'>💉 Personal Inmunizador</span>
                <span className='demo-role-email'>inmunizador@salud.gob</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
