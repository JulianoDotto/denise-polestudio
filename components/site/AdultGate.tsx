'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TEXTS } from '@/hardcoded/texts'

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
            <DialogTitle>{TEXTS.SITE_ADULT_GATE_TITLE_1}</DialogTitle>
            <DialogDescription>
              {TEXTS.SITE_ADULT_GATE_DESCRIPTION_1}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={handleAccept}>{TEXTS.SITE_ADULT_GATE_ACCEPT_1}</Button>
            <Button variant="outline" onClick={handleReject}>
              {TEXTS.SITE_ADULT_GATE_REJECT_1}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return <>{children}</>
}
