'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'adultOk'
const EXPIRY_DAYS = 7

function isStoredAdultOk() {
  if (typeof window === 'undefined') return false
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return false
  try {
    const parsed = JSON.parse(raw) as { value: boolean; expiresAt: number }
    if (!parsed.value) return false
    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(STORAGE_KEY)
      return false
    }
    return true
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return false
  }
}

export default function AdultGate({
  children,
  redirectHref = '/',
}: {
  children: React.ReactNode
  redirectHref?: string
}) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(() => isStoredAdultOk())
  const [open, setOpen] = useState(() => !isStoredAdultOk())

  const handleAccept = () => {
    const expiresAt = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value: true, expiresAt })
    )
    setAllowed(true)
    setOpen(false)
  }

  const handleReject = () => {
    setOpen(false)
    router.push(redirectHref)
  }

  if (!allowed) {
    return (
      <Dialog open={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>+18 Warning</DialogTitle>
            <DialogDescription>
              Este conteúdo é exclusivo para maiores de 18 anos.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={handleAccept}>Tenho mais de 18</Button>
            <Button variant="outline" onClick={handleReject}>
              Menor de idade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return <>{children}</>
}
