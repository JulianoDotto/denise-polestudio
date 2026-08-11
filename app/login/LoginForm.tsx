'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      setError('Credenciais inválidas ou sem permissão.')
    }
  }, [searchParams])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')
    const callbackUrl = searchParams.get('from') || '/'

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    })

    setLoading(false)

    if (result?.error) {
      setError('Credenciais inválidas ou sem permissão.')
      return
    }

    router.push(result?.url || callbackUrl)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border bg-background p-6"
      >
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acesso restrito para administradores.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Username
            </span>
            <input
              type="text"
              name="email"
              autoComplete="username"
              className="w-full rounded-2xl border px-4 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Senha
            </span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                className="w-full rounded-2xl border py-2 pl-4 pr-12 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="size-5" />
                ) : (
                  <Eye aria-hidden="true" className="size-5" />
                )}
              </button>
            </div>
          </label>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
