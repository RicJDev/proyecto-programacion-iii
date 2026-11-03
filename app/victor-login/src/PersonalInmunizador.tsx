import { useState, type FormEvent } from 'react'
import type { UserSession, VaccineApplicationRecord } from './types'

interface PersonalInmunizadorProps {
  session: UserSession
  onLogout: () => void
  setSuccessMessage: (msg: string | null) => void
  setErrorMessage: (msg: string | null) => void
}

const initialApplications: VaccineApplicationRecord[] = [
  {
    id: 'app-1',
    pacienteNombre: 'Carlos López',
    pacienteCedula: 'V-20000003',
    vacuna: 'COVID-19 (Bivalente)',
    dosis: 'Refuerzo Anual',
    lote: 'LOT-2026-X9',
    fecha: 'Hoy, 08:30 AM',
    inmunizador: 'Enf. Marcos Duarte',
    centroSalud: 'Centro de Salud Dr. Rafael Rangel',
  },
  {
    id: 'app-2',
    pacienteNombre: 'Valeria Martínez',
    pacienteCedula: 'V-24555888',
    vacuna: 'Fiebre Amarilla',
    dosis: 'Dosis Única',
    lote: 'FA-33120',
    fecha: 'Hoy, 09:15 AM',
    inmunizador: 'Enf. Marcos Duarte',
    centroSalud: 'Centro de Salud Dr. Rafael Rangel',
  },
  {
    id: 'app-3',
    pacienteNombre: 'José Hernández',
    pacienteCedula: 'V-18999444',
    vacuna: 'Toxoide Tetánico / Diftérico',
    dosis: 'Refuerzo (10 años)',
    lote: 'TT-88201',
    fecha: 'Hoy, 10:00 AM',
    inmunizador: 'Enf. Marcos Duarte',
    centroSalud: 'Centro de Salud Dr. Rafael Rangel',
  },
]

export function PersonalInmunizador({
  session,
  onLogout,
  setSuccessMessage,
  setErrorMessage,
}: PersonalInmunizadorProps) {
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [applications, setApplications] = useState<VaccineApplicationRecord[]>(initialApplications)

  // Campos para aplicar vacuna
  const [pacienteNombre, setPacienteNombre] = useState('')
  const [pacienteCedula, setPacienteCedula] = useState('')
  const [vacuna, setVacuna] = useState('COVID-19 (Bivalente)')
  const [dosis, setDosis] = useState('Primera Dosis')
  const [lote, setLote] = useState('LOT-2026-B4')

  function handleRegisterApplication(e: FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!pacienteNombre.trim() || !pacienteCedula.trim()) {
      setErrorMessage('Por favor ingrese el nombre y la cédula del paciente.')
      return
    }

    const newRecord: VaccineApplicationRecord = {
      id: 'app-' + Math.random().toString(36).slice(2, 7),
      pacienteNombre: pacienteNombre.trim(),
      pacienteCedula: pacienteCedula.trim(),
      vacuna,
      dosis,
      lote: lote.trim() || 'LOT-ACTIVO',
      fecha: 'Hoy, recién aplicada',
      inmunizador: session.name,
      centroSalud: session.centroSalud || 'Centro de Salud Local',
    }

    setApplications([newRecord, ...applications])
    setSuccessMessage(
      `✓ Vacuna aplicada con éxito a ${pacienteNombre} (${pacienteCedula}). Se actualizó su tarjeta digital.`,
    )
    setPacienteNombre('')
    setPacienteCedula('')
    setShowApplyForm(false)
  }

  return (
    <div className='session-view session-personal-inmunizador'>
      <div className='session-badge-row'>
        <span className='session-tag inmunizador'>
          💉 Personal Inmunizador — Vacunador Activo en Turno
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
        <div className='session-user-avatar inmunizador'>INM</div>
        <div className='session-user-meta'>
          <h3 className='session-user-name'>{session.name}</h3>
          <p className='session-user-email'>{session.email}</p>
          <div className='session-chips'>
            {session.cedula && (
              <span className='session-chip'>Matrícula Sanitaria: {session.cedula}</span>
            )}
            <span className='session-chip inmunizador-chip'>
              Puesto: {session.centroSalud || 'Centro de Salud Dr. Rafael Rangel'}
            </span>
          </div>
        </div>
      </div>

      {/* Métricas de la jornada del inmunizador */}
      <div className='admin-stats-grid'>
        <div className='admin-stat-card'>
          <span className='stat-num'>{applications.length}</span>
          <span className='stat-label'>Pacientes Inmunizados en este Turno</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>100%</span>
          <span className='stat-label'>Trazabilidad y Lotes Verificados</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-num'>0</span>
          <span className='stat-label'>Eventos Adversos (ESAVI)</span>
        </div>
      </div>

      {/* Formulario y Registro de Vacunación a Paciente */}
      <div className='session-action-section'>
        <div className='action-section-header'>
          <h4>💉 Registro Inmediato de Vacunación</h4>
          {!showApplyForm ? (
            <button
              type='button'
              className='login-submit-btn inmunizador-btn small'
              onClick={() => setShowApplyForm(true)}
            >
              + Aplicar y Registrar Vacuna
            </button>
          ) : (
            <button
              type='button'
              className='session-cancel-btn'
              onClick={() => setShowApplyForm(false)}
            >
              Cerrar Formulario
            </button>
          )}
        </div>

        <p className='section-subtext'>
          Ingrese los datos del ciudadano que acaba de recibir su dosis biológica para actualizar su tarjeta sanitaria.
        </p>

        {showApplyForm && (
          <form
            className='login-form create-user-form'
            onSubmit={handleRegisterApplication}
          >
            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='inm-paciente-nombre'
                >
                  Nombre y Apellido del Paciente
                </label>
                <input
                  id='inm-paciente-nombre'
                  type='text'
                  className='login-input'
                  placeholder='Ej. María Alejandra Contreras'
                  value={pacienteNombre}
                  onChange={(e) => setPacienteNombre(e.target.value)}
                  required
                />
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='inm-paciente-cedula'
                >
                  Cédula de Identidad
                </label>
                <input
                  id='inm-paciente-cedula'
                  type='text'
                  className='login-input'
                  placeholder='V-25123456'
                  value={pacienteCedula}
                  onChange={(e) => setPacienteCedula(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='form-grid-2'>
              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='inm-vacuna'
                >
                  Vacuna Suministrada
                </label>
                <select
                  id='inm-vacuna'
                  className='login-select'
                  value={vacuna}
                  onChange={(e) => setVacuna(e.target.value)}
                >
                  <option value='COVID-19 (Bivalente)'>COVID-19 (Bivalente)</option>
                  <option value='Fiebre Amarilla'>Fiebre Amarilla</option>
                  <option value='Hepatitis B Adulto'>Hepatitis B Adulto</option>
                  <option value='Toxoide Tetánico / Diftérico'>Toxoide Tetánico / Diftérico</option>
                  <option value='Influenza Estacional 2026'>Influenza Estacional 2026</option>
                  <option value='SRP (Sarampión, Rubéola, Parotiditis)'>SRP (Sarampión, Rubéola, Parotiditis)</option>
                  <option value='Polio Oral / Inactivada'>Polio Oral / Inactivada</option>
                  <option value='BCG'>BCG</option>
                </select>
              </div>

              <div className='login-field-group'>
                <label
                  className='login-label'
                  htmlFor='inm-dosis'
                >
                  Dosis Aplicada
                </label>
                <select
                  id='inm-dosis'
                  className='login-select'
                  value={dosis}
                  onChange={(e) => setDosis(e.target.value)}
                >
                  <option value='Primera Dosis'>Primera Dosis</option>
                  <option value='Segunda Dosis'>Segunda Dosis</option>
                  <option value='Tercera Dosis / Refuerzo'>Tercera Dosis / Refuerzo</option>
                  <option value='Refuerzo Anual'>Refuerzo Anual</option>
                  <option value='Dosis Única'>Dosis Única</option>
                </select>
              </div>
            </div>

            <div className='login-field-group'>
              <label
                className='login-label'
                htmlFor='inm-lote'
              >
                Número de Lote del Frasco
              </label>
              <input
                id='inm-lote'
                type='text'
                className='login-input'
                placeholder='Ej. LOT-2026-B4'
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                required
              />
            </div>

            <button
              type='submit'
              className='login-submit-btn inmunizador-btn'
            >
              Registrar Vacunación en Tarjeta del Paciente
            </button>
          </form>
        )}

        {/* Tabla de vacunas aplicadas en la jornada */}
        <div style={{ marginTop: '1.5rem' }}>
          <h5 style={{ margin: '0 0 0.75rem 0', color: '#0f172a' }}>
            📋 Pacientes Atendidos en esta Jornada
          </h5>
          <div className='vaccine-table-responsive'>
            <table className='vaccine-table'>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Cédula</th>
                  <th>Vacuna</th>
                  <th>Dosis</th>
                  <th>Lote</th>
                  <th>Hora / Estado</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className='bold-td'>{app.pacienteNombre}</td>
                    <td>{app.pacienteCedula}</td>
                    <td>{app.vacuna}</td>
                    <td>{app.dosis}</td>
                    <td><span className='badge-lot'>{app.lote}</span></td>
                    <td>
                      <span className='badge-applied'>✓ {app.fecha}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalInmunizador
