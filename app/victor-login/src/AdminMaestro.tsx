import { useState, type FormEvent } from 'react'
import type { RegisterData, UserRole, UserSession } from './types'
import { registerUser } from './authService'

interface AdminMaestroProps {
  session: UserSession
  onLogout: () => void
  setSuccessMessage: (msg: string | null) => void
  setErrorMessage: (msg: string | null) => void
}

export function AdminMaestro({
  session,
  onLogout,
  setSuccessMessage,
  setErrorMessage,
}: AdminMaestroProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Formulario para crear administradores o personal
  const [name, setName] = useState('')
  const [cedula, setCedula] = useState('')
  const [targetRole, setTargetRole] = useState<UserRole>('admin_regional')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [region, setRegion] = useState('Región Capital / Central')
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
        region: region.trim() || undefined,
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
    <div className='session-view session-admin-maestro'>
      <div className='session-badge-row'>
        <span className='session-tag maestro'>
          👑 Administrador Maestro — Nivel Central y Nacional
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
        <div className='session-user-avatar maestro'>MAE</div>
        <div className='session-user-meta'>
          <h3 className='session-user-name'>{session.name}</h3>
          <p className='session-user-email'>{session.email}</p>
          <div className='session-chips'>
            {session.cedula && (
              <span className='session-chip'>Cédula: {session.cedula}</span>
            )}
            <span className='session-chip maestro-chip'>
              Jerarquía: Nivel Central Nacional
            </span>
          </div>
        </div>
      </div>

      {/* Métricas sanitarias nacionales */}
      <div className='admin-stats-grid'>
        <div className='admin-stat-card'>
          <span className='stat-num'>1,420,890</span>
          <span className='stat-label'>Dosis Administradas en el País</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>24</span>
          <span className='stat-label'>Regiones Sanitarias Activas</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>350</span>
          <span className='stat-label'>Centros y Puntos de Vacunación</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>97.4%</span>
          <span className='stat-label'>Meta de Cobertura Nacional</span>
        </div>
      </div>

      {/* Módulo de Gestión de Usuarios y Regiones */}
      <div className='session-action-section'>
        <div className='action-section-header'>
          <h4>📋 Asignación y Alta de Administradores y Personal</h4>
          {!showCreateForm ? (
            <button
              type='button'
              className='login-submit-btn maestro-btn small'
              onClick={() => setShowCreateForm(true)}
            >
              + Dar de Alta Nuevo Usuario
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
          El Administrador Maestro cuenta con autoridad para crear Administradores
          Regionales, Administradores Locales y Personal Inmunizador en todo el territorio.
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
                  htmlFor='maestro-name'
                >
                  Nombre Completo
                </label>
                <input
                  id='maestro-name'
                  type='text'
                  className='login-input'
                  placeholder='Ej. Dr. Roberto Velásquez'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='maestro-cedula'
                >
                  Cédula de Identidad
                </label>
                <input
                  id='maestro-cedula'
                  type='text'
                  className='login-input'
                  placeholder='V-12345678'
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
              </div>
            </div>

            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='maestro-role'
                >
                  Rol Asignado
                </label>
                <select
                  id='maestro-role'
                  className='login-select'
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as UserRole)}
                >
                  <option value='admin_regional'>Administrador Regional</option>
                  <option value='admin_local'>Administrador Local</option>
                  <option value='personal_inmunizador'>
                    Personal Inmunizador
                  </option>
                  <option value='admin_maestro'>Administrador Maestro</option>
                </select>
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='maestro-region'
                >
                  Región Sanitaria
                </label>
                <input
                  id='maestro-region'
                  type='text'
                  className='login-input'
                  placeholder='Ej. Región Central / Capital'
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>
            </div>

            {(targetRole === 'admin_local' ||
              targetRole === 'personal_inmunizador') && (
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='maestro-centro'
                >
                  Centro de Salud Asignado
                </label>
                <input
                  id='maestro-centro'
                  type='text'
                  className='login-input'
                  placeholder='Ej. Centro de Salud Dr. Rafael Rangel'
                  value={centroSalud}
                  onChange={(e) => setCentroSalud(e.target.value)}
                />
              </div>
            )}

            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='maestro-email'
                >
                  Correo Electrónico
                </label>
                <input
                  id='maestro-email'
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
                  htmlFor='maestro-password'
                >
                  Contraseña Inicial
                </label>
                <input
                  id='maestro-password'
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
              className='login-submit-btn maestro-btn'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Registrando...'
                : 'Confirmar y Dar de Alta en el Sistema'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AdminMaestro
