import { Suspense } from 'react'

import LoginForm from './LoginForm'

export default function LoginPage() {
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
