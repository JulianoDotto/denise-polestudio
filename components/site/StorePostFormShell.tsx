'use client'

import { useState } from 'react'

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
          <h2 className="text-base font-semibold">Publicar no feed</h2>
          <p className="text-sm text-muted-foreground">
            Use a publicação fixa para manter o post sem prazo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
        >
          {isOpen ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {isOpen ? (
        children
      ) : (
        <p className="text-xs text-muted-foreground">Formulário oculto.</p>
      )}
    </section>
  )
}
