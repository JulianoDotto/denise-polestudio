'use client'

import { useMemo, useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const errorMessages: Record<string, string> = {
  title: 'Informe um título para a publicação.',
  expiresAt: 'Defina uma data de duração ou marque como publicação fixa.',
}

export default function StorePostAdminModal({
  children,
  error,
  success,
  initialOpen = false,
  trigger,
}: {
  children: React.ReactNode
  error?: string
  success?: boolean
  initialOpen?: boolean
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(initialOpen)
  const errorMessage = useMemo(() => {
    if (!error) return ''
    return errorMessages[error] ?? 'Não foi possível salvar a publicação.'
  }, [error])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl rounded-3xl border bg-white p-0">
        <div className="grid gap-4 p-6">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-lg text-zinc-900">Publicar no feed</DialogTitle>
            <DialogDescription className="text-sm text-zinc-600">
              Use a publicação fixa para manter o post sem prazo.
            </DialogDescription>
          </DialogHeader>

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              Publicação criada com sucesso.
            </p>
          ) : null}

          {children}

          <div className="flex justify-end">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-700"
              >
                Fechar
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
