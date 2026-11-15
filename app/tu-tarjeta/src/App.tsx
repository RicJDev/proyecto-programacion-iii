import { useState } from 'react'
import { Card } from './components/card'
import { Badge, Button, Input } from './components/ui'
import { patientRecords } from './mockData'
import type { PatientRecord } from './mockData'

type QueryState = 'idle' | 'loading' | 'found' | 'not_found'
type SendState = 'none' | 'sending' | 'sent'

function normalizeId(value: string) {
  return value.replace(/[^\d]/g, '')
}

function App() {
  const [documentId, setDocumentId] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<QueryState>('idle')
  const [record, setRecord] = useState<PatientRecord | null>(null)
  const [sendState, setSendState] = useState<SendState>('none')

  function lookup() {
    const term = normalizeId(documentId)
    const mail = email.trim().toLowerCase()

    if (!term && !mail) {
      setState('not_found')
      setRecord(null)
      return
    }

    setState('loading')
    setRecord(null)
    setSendState('none')

    window.setTimeout(() => {
      const match =
        patientRecords.find(
          (item) =>
            (term && normalizeId(item.patient.document) === term) ||
            (mail && item.patient.email.toLowerCase() === mail),
        ) ?? null

      setRecord(match)
      setState(match ? 'found' : 'not_found')
    }, 600)
  }

  function reset() {
    setDocumentId('')
    setEmail('')
    setState('idle')
    setRecord(null)
    setSendState('none')
  }

  function sendDigitalCard() {
    if (!record) return
    setSendState('sending')
    window.setTimeout(() => setSendState('sent'), 800)
  }

  return (
    <div className='flex min-h-screen flex-col bg-bg'>
      <header className='border-b border-border bg-surface'>
        <div className='bg-primary text-primary-foreground'>
          <div className='mx-auto flex min-h-8 max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1 text-[10px] font-semibold uppercase tracking-widest'>
            <span>
              República Bolivariana de Venezuela · Ministerio del Poder Popular
              para la Salud
            </span>
            <span>SIGEV</span>
          </div>
        </div>
        <div className='mx-auto max-w-3xl px-4 py-5 text-center'>
          <h1 className='text-2xl font-bold tracking-tight text-surface-text'>
            Tu Tarjeta
          </h1>
          <p className='mx-auto mt-2 max-w-xl text-sm text-text-muted'>
            Consulta ciudadana tu tarjeta de vacunación digital con tu documento
            de identidad o el correo registrado en tu centro de salud.
          </p>
          <div className='mt-3'>
            <Badge variant='info'>Servicio público · sin autenticación</Badge>
          </div>
        </div>
      </header>

      <main className='mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-8'>
        <section className='border border-border bg-surface'>
          <div className='border-b border-border px-5 py-4'>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-surface-text'>
              Consultar tarjeta de vacunación
            </h2>
            <p className='mt-1 text-xs text-text-muted'>
              Los datos se buscan en el registro nacional del SIGEV.
            </p>
          </div>
          <div className='grid gap-4 px-5 py-4 sm:grid-cols-2'>
            <Input
              label='Cédula de identidad'
              name='consulta-documento'
              placeholder='Ej. V-74812305'
              value={documentId}
              onChange={(event) => setDocumentId(event.target.value)}
              hint='Cédula (V-…) o pasaporte.'
            />
            <Input
              label='Correo registrado'
              name='consulta-correo'
              type='email'
              placeholder='correo@ejemplo.pe'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              hint='Basta con completar uno de los dos campos.'
            />
          </div>
          <div className='flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-alt px-5 py-3'>
            <span className='text-[11px] text-text-muted'>
              Prueba con C.I. <strong>V-74812305</strong> o correo{' '}
              <strong>carlos.ramirez@gmail.com</strong>
            </span>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={reset}
              >
                Limpiar
              </Button>
              <Button
                onClick={lookup}
                disabled={state === 'loading'}
              >
                {state === 'loading' ? 'Buscando…' : 'Consultar'}
              </Button>
            </div>
          </div>
        </section>

        {state === 'loading' && (
          <div className='border border-border bg-surface px-6 py-8 text-center'>
            <p className='text-xs font-semibold uppercase tracking-widest text-text-muted'>
              Consultando registro nacional…
            </p>
          </div>
        )}

        {state === 'not_found' && (
          <div className='border border-danger/40 bg-danger-soft px-5 py-4'>
            <p className='text-sm font-semibold text-danger'>
              No se encontró ninguna tarjeta
            </p>
            <p className='mt-1 text-xs text-danger/80'>
              Verifica el documento o el correo ingresado. Si el dato es
              incorrecto, acércate a tu centro de salud para actualizar tu
              registro.
            </p>
          </div>
        )}

        {state === 'found' && record && (
          <section className='space-y-4'>
            {sendState === 'sent' && (
              <div className='border border-success/40 bg-success-soft px-5 py-3 text-xs font-medium text-success'>
                Tarjeta enviada digitalmente a {record.patient.email}
              </div>
            )}

            <Card
              patient={record.patient}
              vaccines={record.vaccines}
            />

            <div className='flex flex-wrap items-center justify-between gap-3 border border-border bg-surface px-5 py-3'>
              <span className='text-[11px] text-text-muted'>
                {sendState === 'sent'
                  ? `Reenvío disponible a ${record.patient.email}`
                  : `La tarjeta puede enviarse a ${record.patient.email}`}
              </span>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() => window.print()}
                >
                  Imprimir
                </Button>
                <Button
                  onClick={sendDigitalCard}
                  disabled={sendState !== 'none'}
                >
                  {sendState === 'sending'
                    ? 'Enviando…'
                    : sendState === 'sent'
                      ? 'Reenviar tarjeta'
                      : 'Enviar tarjeta digital'}
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className='border-t border-border bg-surface'>
        <div className='mx-auto max-w-3xl px-4 py-4 text-[11px] text-text-muted'>
          © 2026 SIGEV — Módulo público «Tu Tarjeta». Datos simulados con fines
          académicos.
        </div>
      </footer>
    </div>
  )
}

export default App
