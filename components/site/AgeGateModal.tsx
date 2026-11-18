'use client'

import { useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { TEXTS } from '@/hardcoded/texts'

const STORAGE_KEY = 'age_gate_loja_accepted'
const listeners = new Set<() => void>()
let acceptedInSession = false

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getIsAccepted() {
  if (acceptedInSession) return true
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

// Before hydration the modal stays closed, matching the previous initial state.
function getServerIsAccepted() {
  return true
}

export default function AgeGateModal() {
  const router = useRouter()
  const isAccepted = useSyncExternalStore(subscribe, getIsAccepted, getServerIsAccepted)

  if (isAccepted) return null

  function handleConfirm() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // ignore storage errors
    }
    acceptedInSession = true
    listeners.forEach((listener) => listener())
  }

  function handleReject() {
    router.replace('/')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex flex-col gap-3">
          <h2 id="age-gate-title" className="text-lg font-semibold">
            {TEXTS.SITE_AGE_GATE_TITLE_1}
          </h2>
          <p className="text-sm text-muted-foreground">
            {TEXTS.SITE_AGE_GATE_DESCRIPTION_1}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {TEXTS.SITE_AGE_GATE_CONFIRM_1}
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="rounded-full border px-4 py-2 text-sm text-muted-foreground"
          >
            {TEXTS.SITE_AGE_GATE_REJECT_1}
          </button>
        </div>
      </div>
    </div>
  )
}
