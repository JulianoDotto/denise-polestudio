"use client"

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: '/' })
  }, [])

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 text-sm text-muted-foreground">
      Encerrando sessão...
    </div>
  )
}
