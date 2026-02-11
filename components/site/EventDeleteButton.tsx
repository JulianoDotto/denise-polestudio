'use client'

import { useActionState } from 'react'
import { Trash2 } from 'lucide-react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteEventInline } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'

type EventDeleteButtonProps = {
  id: string
  title: string
  tone?: 'dark' | 'light'
}

const initialState = { success: false, error: '' }

export default function EventDeleteButton({
  id,
  title,
  tone = 'dark',
}: EventDeleteButtonProps) {
  const [state, formAction] = useActionState(deleteEventInline, initialState)
  const toneClasses =
    tone === 'light'
      ? 'border-white/70 bg-stone-950/70 text-white hover:bg-stone-950/90'
      : 'border-zinc-300/70 bg-white/80 text-zinc-900 hover:bg-white'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${toneClasses}`}
          aria-label={TEXTS.EVENTOS_DELETE_ICON_ARIA_1}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-3xl border bg-white p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-zinc-900">{TEXTS.EVENTOS_DELETE_TITLE_1}</DialogTitle>
          <DialogDescription className="text-sm text-zinc-600">
            {TEXTS.EVENTOS_DELETE_DESCRIPTION_1.replace('{title}', title)}
          </DialogDescription>
        </DialogHeader>
        {state.error ? (
          <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {TEXTS.EVENTOS_DELETE_ERROR_1}
          </p>
        ) : null}
        <form action={formAction} className="mt-4 flex gap-3">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-zinc-300"
          >
            {TEXTS.EVENTOS_DELETE_CONFIRM_1}
          </button>
          <DialogClose asChild>
            <button
              type="button"
              className="flex-1 rounded-full border px-4 py-2 text-sm text-zinc-700"
            >
              {TEXTS.EVENTOS_DELETE_CANCEL_1}
            </button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}
