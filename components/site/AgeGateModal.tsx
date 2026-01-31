'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const STORAGE_KEY = 'age_gate_loja_accepted'

export default function AgeGateModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(STORAGE_KEY)
      setIsOpen(accepted !== 'true')
    } catch {
      setIsOpen(true)
    }
  }, [])

  if (!isOpen) return null

  function handleConfirm() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // ignore storage errors
    }
    setIsOpen(false)
  }

  function handleReject() {
    router.replace('/')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex flex-col gap-3">
          <h2 id="age-gate-title" className="text-lg font-semibold">
            Você tem mais de 18 anos?
          </h2>
          <p className="text-sm text-muted-foreground">
            Este conteúdo é recomendado apenas para maiores de idade.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Sim, tenho 18+
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="rounded-full border px-4 py-2 text-sm text-muted-foreground"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  )
}
