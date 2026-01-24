import { redirect } from 'next/navigation'
import { compare } from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth/session'

async function loginAction(formData: FormData) {
  'use server'

  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    redirect('/admin/login?error=1')
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    redirect('/admin/login?error=1')
  }

  const isValid = await compare(password, user.passwordHash)
  if (!isValid || user.role !== 'ADMIN' || !user.isActive) {
    redirect('/admin/login?error=1')
  }

  await createSession({ userId: user.id, role: user.role })
  redirect('/admin')
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const hasError = sp.error === '1'

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <form
        action={loginAction}
        className="w-full max-w-md rounded-3xl border bg-background p-6"
      >
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre com seu usuário admin.
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

        {hasError ? (
          <p className="mt-4 text-sm text-red-500">
            Credenciais inválidas ou sem permissão.
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
