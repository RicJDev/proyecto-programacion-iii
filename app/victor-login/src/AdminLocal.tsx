import { useState, type FormEvent } from 'react'
import type { RegisterData, UserSession } from './types'
import { registerUser } from './authService'

interface AdminLocalProps {
  session: UserSession
  onLogout: () => void
  setSuccessMessage: (msg: string | null) => void
  setErrorMessage: (msg: string | null) => void
}

export function AdminLocal({
  session,
  onLogout,
  setSuccessMessage,
  setErrorMessage,
}: AdminLocalProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Registro de Personal Inmunizador en el centro
  const [name, setName] = useState('')
  const [cedula, setCedula] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleCreateInmunizador(e: FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Por favor complete nombre, correo y contraseña.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener mínimo 6 caracteres.')
      return
    }

    setIsSubmitting(true)
    try {
      const data: RegisterData = {
        name: name.trim(),
        email: email.trim(),
        password,
        role: 'personal_inmunizador',
        cedula: cedula.trim() || undefined,
        region: session.region,
        centroSalud: session.centroSalud || 'Centro de Salud Local',
      }

      const res = await registerUser(data, session)
      setSuccessMessage(res.message)
      setName('')
      setCedula('')
      setEmail('')
      setPassword('')
      setShowCreateForm(false)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al registrar')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='session-view session-admin-local'>
      <div className='session-badge-row'>
        <span className='session-tag local'>
          🏥 Administrador Local — {session.centroSalud || 'Centro de Salud Local'}
        </span>
        <button
          type='button'
          className='session-logout-btn'
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      <div className='session-user-card'>
        <div className='session-user-avatar local'>LOC</div>
        <div className='session-user-meta'>
          <h3 className='session-user-name'>{session.name}</h3>
          <p className='session-user-email'>{session.email}</p>
          <div className='session-chips'>
            {session.cedula && (
              <span className='session-chip'>Cédula: {session.cedula}</span>
            )}
            <span className='session-chip local-chip'>
              Centro: {session.centroSalud || 'Centro de Salud Dr. Rafael Rangel'}
            </span>
          </div>
        </div>
      </div>

      {/* Métricas operativas del centro de salud */}
      <div className='admin-stats-grid'>
        <div className='admin-stat-card'>
          <span className='stat-num'>8</span>
          <span className='stat-label'>Inmunizadores de Guardia</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>1,250</span>
          <span className='stat-label'>Dosis en Cadena de Frío (2°C a 8°C)</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>185</span>
          <span className='stat-label'>Vacunaciones Realizadas Hoy</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>100%</span>
          <span className='stat-label'>Operatividad de Neveras</span>
        </div>
      </div>

      {/* Módulo para habilitar personal inmunizador */}
      <div className='session-action-section'>
        <div className='action-section-header'>
          <h4>💉 Personal Inmunizador del Centro de Salud</h4>
          {!showCreateForm ? (
            <button
              type='button'
              className='login-submit-btn local-btn small'
              onClick={() => setShowCreateForm(true)}
            >
              + Habilitar Inmunizador / Vacunador
            </button>
          ) : (
            <button
              type='button'
              className='session-cancel-btn'
              onClick={() => setShowCreateForm(false)}
            >
              Cancelar
            </button>
          )}
        </div>

        <p className='section-subtext'>
          Habilite a nuevos enfermeros y profesionales de la salud para aplicar y registrar vacunas en este centro.
        </p>

        {showCreateForm && (
          <form
            className='login-form create-user-form'
            onSubmit={handleCreateInmunizador}
          >
            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='local-name'
                >
                  Nombre Completo del Inmunizador
                </label>
                <input
                  id='local-name'
                  type='text'
                  className='login-input'
                  placeholder='Ej. Enf. Marcos Duarte'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='local-cedula'
                >
                  Cédula de Identidad / Matrícula
                </label>
                <input
                  id='local-cedula'
                  type='text'
                  className='login-input'
                  placeholder='V-20123456'
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
              </div>
            </div>

            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='local-email'
                >
                  Correo Electrónico
                </label>
                <input
                  id='local-email'
                  type='email'
                  className='login-input'
                  placeholder='inmunizador@salud.gob'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='local-password'
                >
                  Contraseña Inicial
                </label>
                <input
                  id='local-password'
                  type='password'
                  className='login-input'
                  placeholder='Mínimo 6 caracteres'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type='submit'
              className='login-submit-btn local-btn'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Registrando...'
                : 'Confirmar y Asignar al Centro de Salud'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AdminLocal
