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
import ActionButton from '@/components/site/ActionButton'
import { TEXTS } from '@/hardcoded/texts'

type AdminModalProps = {
  children: React.ReactNode
  trigger: React.ReactNode
  title: string
  description?: string
  error?: string
  success?: boolean
  errorMessages?: Record<string, string>
  errorFallbackMessage?: string
  successMessage?: string
  initialOpen?: boolean
  closeLabel?: string
}

export default function AdminModal({
  children,
  trigger,
  title,
  description,
  error,
  success,
  errorMessages,
  errorFallbackMessage = TEXTS.SITE_ADMIN_MODAL_ERROR_FALLBACK_1,
  successMessage = TEXTS.SITE_ADMIN_MODAL_SUCCESS_FALLBACK_1,
  initialOpen = false,
  closeLabel = TEXTS.SITE_ADMIN_MODAL_CLOSE_1,
}: AdminModalProps) {
  const [open, setOpen] = useState(initialOpen)
  const errorMessage = useMemo(() => {
    if (!error) return ''
    if (!errorMessages) return errorFallbackMessage
    return errorMessages[error] ?? errorFallbackMessage
  }, [error, errorMessages, errorFallbackMessage])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl rounded-3xl border bg-white p-0">
        <div className="grid gap-4 p-6">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-lg text-zinc-900">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-sm text-zinc-600">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          {children}

          <div className="flex justify-end">
            <DialogClose asChild>
              <ActionButton
                variant="outline"
                size="sm"
                className="uppercase tracking-[0.2em]"
                type="button"
              >
                {closeLabel}
              </ActionButton>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
