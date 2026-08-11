import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/')
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 text-sm text-muted-foreground">
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
