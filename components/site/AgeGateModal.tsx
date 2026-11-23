'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { TEXTS } from '@/hardcoded/texts'
import { getActionButtonClasses } from '@/lib/action-button-styles'

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
  const overlayRef = useRef<HTMLDivElement>(null)

  // Keeps keyboard and screen reader focus inside the gate: everything else in <body> goes inert.
  useEffect(() => {
    if (isAccepted) return
    const overlay = overlayRef.current
    const madeInert = Array.from(document.body.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element !== overlay && !element.inert,
    )
    madeInert.forEach((element) => {
      element.inert = true
    })
    return () => {
      madeInert.forEach((element) => {
        element.inert = false
      })
    }
  }, [isAccepted])

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

  // Rendered into <body> so it sits above the floating WhatsApp button in the footer.
  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end justify-center overscroll-contain bg-[#1a0b10]/70 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-description"
        className="relative isolate w-full max-w-md overflow-hidden rounded-[28px] bg-tinta p-7 text-marfim shadow-[0_32px_64px_-24px_rgba(0,0,0,0.7)] ring-1 ring-marfim/10 sm:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-vinho opacity-80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 -z-10 h-64 w-64 rounded-full bg-vinho/40 blur-3xl"
        />

        <div className="flex items-start justify-between gap-4">
          <p className="flex items-center gap-2 pt-2 text-[11px] uppercase tracking-[0.32em] text-marfim/60">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
            {TEXTS.SITE_AGE_GATE_EYEBROW_1}
          </p>
          <span aria-hidden="true" className="font-display text-5xl italic leading-none text-[#e3b3be]">
            18+
          </span>
        </div>

        <h2
          id="age-gate-title"
          className="mt-6 font-display text-[2rem] leading-[1.1] tracking-[0.005em] text-marfim"
        >
          {TEXTS.SITE_AGE_GATE_TITLE_1}
        </h2>
        <div aria-hidden="true" className="mt-5 h-px w-12 bg-marfim/30" />
        <p id="age-gate-description" className="mt-5 text-base leading-relaxed text-marfim/75">
          {TEXTS.SITE_AGE_GATE_DESCRIPTION_1}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            autoFocus
            onClick={handleConfirm}
            className={`${getActionButtonClasses({ size: 'lg', variant: 'solid', tone: 'light' })} w-full`}
          >
            {TEXTS.SITE_AGE_GATE_CONFIRM_1}
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-marfim/25 px-5 text-sm tracking-[0.04em] text-marfim/80 transition duration-300 hover:border-marfim/60 hover:text-marfim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marfim motion-reduce:transition-none"
          >
            {TEXTS.SITE_AGE_GATE_REJECT_1}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
