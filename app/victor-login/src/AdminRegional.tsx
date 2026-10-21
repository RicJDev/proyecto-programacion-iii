import { useState, type FormEvent } from 'react'
import type { RegisterData, UserRole, UserSession } from './types'
import { registerUser } from './authService'

interface AdminRegionalProps {
  session: UserSession
  onLogout: () => void
  setSuccessMessage: (msg: string | null) => void
  setErrorMessage: (msg: string | null) => void
}

export function AdminRegional({
  session,
  onLogout,
  setSuccessMessage,
  setErrorMessage,
}: AdminRegionalProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Formulario para crear administradores locales o inmunizadores regionales
  const [name, setName] = useState('')
  const [cedula, setCedula] = useState('')
  const [targetRole, setTargetRole] = useState<UserRole>('admin_local')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [centroSalud, setCentroSalud] = useState('')

  async function handleCreateUser(e: FormEvent) {
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
        role: targetRole,
        cedula: cedula.trim() || undefined,
        region: session.region || 'Región Capital / Central',
        centroSalud: centroSalud.trim() || undefined,
      }

      const res = await registerUser(data, session)
      setSuccessMessage(res.message)
      setName('')
      setCedula('')
      setEmail('')
      setPassword('')
      setCentroSalud('')
      setShowCreateForm(false)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al registrar')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='session-view session-admin-regional'>
      <div className='session-badge-row'>
        <span className='session-tag regional'>
          🌐 Administrador Regional — {session.region || 'Región Sanitaria'}
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
        <div className='session-user-avatar regional'>REG</div>
        <div className='session-user-meta'>
          <h3 className='session-user-name'>{session.name}</h3>
          <p className='session-user-email'>{session.email}</p>
          <div className='session-chips'>
            {session.cedula && (
              <span className='session-chip'>Cédula: {session.cedula}</span>
            )}
            <span className='session-chip regional-chip'>
              Jurisdicción: {session.region || 'Región Central'}
            </span>
          </div>
        </div>
      </div>

      {/* Métricas de la región */}
      <div className='admin-stats-grid'>
        <div className='admin-stat-card'>
          <span className='stat-num'>14</span>
          <span className='stat-label'>Municipios en la Jurisdicción</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>38</span>
          <span className='stat-label'>Centros y Módulos Sanitarios</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>185,400</span>
          <span className='stat-label'>Dosis Recibidas y Distribuidas</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>94.8%</span>
          <span className='stat-label'>Cobertura de Inmunización</span>
        </div>
      </div>

      {/* Módulo de Administración de Centros Locales e Inmunizadores */}
      <div className='session-action-section'>
        <div className='action-section-header'>
          <h4>🏥 Centros Locales y Personal de la Región</h4>
          {!showCreateForm ? (
            <button
              type='button'
              className='login-submit-btn regional-btn small'
              onClick={() => setShowCreateForm(true)}
            >
              + Habilitar Administrador Local o Inmunizador
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
          Supervise la distribución de lotes biológicos y registre directores locales y enfermeros vacunadores en su región.
        </p>

        {showCreateForm && (
          <form
            className='login-form create-user-form'
            onSubmit={handleCreateUser}
          >
            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='regional-name'
                >
                  Nombre Completo
                </label>
                <input
                  id='regional-name'
                  type='text'
                  className='login-input'
                  placeholder='Ej. Lic. Elena Ramos'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='regional-cedula'
                >
                  Cédula de Identidad
                </label>
                <input
                  id='regional-cedula'
                  type='text'
                  className='login-input'
                  placeholder='V-16789012'
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
              </div>
            </div>

            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='regional-role'
                >
                  Rol en la Región
                </label>
                <select
                  id='regional-role'
                  className='login-select'
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as UserRole)}
                >
                  <option value='admin_local'>
                    Administrador Local (Centro de Salud)
                  </option>
                  <option value='personal_inmunizador'>
                    Personal Inmunizador
                  </option>
                </select>
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='regional-centro'
                >
                  Centro de Salud Asignado
                </label>
                <input
                  id='regional-centro'
                  type='text'
                  className='login-input'
                  placeholder='Ej. Centro de Salud Dr. Rafael Rangel'
                  value={centroSalud}
                  onChange={(e) => setCentroSalud(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='regional-email'
                >
                  Correo Electrónico
                </label>
                <input
                  id='regional-email'
                  type='email'
                  className='login-input'
                  placeholder='usuario@salud.gob'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='regional-password'
                >
                  Contraseña Inicial
                </label>
                <input
                  id='regional-password'
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
              className='login-submit-btn regional-btn'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Registrando...'
                : 'Confirmar y Asignar a la Región'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AdminRegional
