'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    const callbackUrl = searchParams.get('from') || '/admin'

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
              Email
            </span>
            <input
              type="email"
              name="email"
              className="w-full rounded-2xl border px-4 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Senha
            </span>
            <input
              type="password"
              name="password"
              className="w-full rounded-2xl border px-4 py-2 text-sm"
              required
            />
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
