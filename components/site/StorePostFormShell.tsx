'use client'

import { useState } from 'react'
import { TEXTS } from '@/hardcoded/texts'

export default function StorePostFormShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <section className="grid gap-4 rounded-3xl border bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold">{TEXTS.LOJA_ADMIN_TITLE_1}</h2>
          <p className="text-sm text-muted-foreground">
            {TEXTS.LOJA_ADMIN_DESCRIPTION_1}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
        >
          {isOpen ? TEXTS.STORE_POST_FORM_HIDE_1 : TEXTS.STORE_POST_FORM_SHOW_1}
        </button>
      </div>

      {isOpen ? (
        children
      ) : (
        <p className="text-xs text-muted-foreground">
          {TEXTS.STORE_POST_FORM_HIDDEN_1}
        </p>
      )}
    </section>
  )
}
