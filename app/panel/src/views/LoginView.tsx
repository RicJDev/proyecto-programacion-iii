import { useState, type FormEvent } from 'react'
import { Card, CardHeader, CardContent, Input, Button, Badge } from '../components/ui'
import { loginApi, type UserSession } from '../lib/auth'

interface LoginViewProps {
  onSuccess: (session: UserSession) => void
}

export function LoginView({ onSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const session = await loginApi(email.trim(), password.trim())
      onSuccess(session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-[calc(100vh-140px)] items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-md space-y-4'>
        <div className='border-l-4 border-primary pl-4'>
          <Badge variant='neutral' size='sm' className='mb-1 font-mono uppercase'>
            Acceso Autorizado
          </Badge>
          <h1 className='text-2xl font-bold uppercase tracking-tight text-surface-text'>
            SINACINM
          </h1>
          <p className='text-xs text-text-muted'>
            Sistema Nacional de Inmunizaciones
          </p>
        </div>

        {error && (
          <div className='border-l-4 border-danger bg-danger-soft p-3 text-xs font-semibold text-danger'>
            ⚠️ {error}
          </div>
        )}

        <Card>
          <CardHeader
            title='Credenciales de Acceso'
            subtitle='Solo ingresa tu correo electrónico y contraseña'
          />
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                label='Correo Electrónico'
                type='email'
                placeholder='admin@healthsystem.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label='Contraseña'
                type='password'
                placeholder='••••••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type='submit'
                variant='primary'
                className='w-full justify-center'
                isLoading={loading}
              >
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
