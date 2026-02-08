'use client'

import { useFormState } from 'react-dom'
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
import { deleteClassInline } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'

type AulasDeleteButtonProps = {
  id: string
  title: string
}

const initialState = { success: false, error: '' }

export default function AulasDeleteButton({ id, title }: AulasDeleteButtonProps) {
  const [state, formAction] = useFormState(deleteClassInline, initialState)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white transition hover:bg-black/50"
          aria-label={TEXTS.AULAS_DELETE_ICON_ARIA_1}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-3xl border bg-white p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-zinc-900">
            {TEXTS.AULAS_DELETE_TITLE_1}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600">
            {TEXTS.AULAS_DELETE_DESCRIPTION_1.replace('{title}', title)}
          </DialogDescription>
        </DialogHeader>
        {state.error ? (
          <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {TEXTS.AULAS_DELETE_ERROR_1}
          </p>
        ) : null}
        <form action={formAction} className="mt-4 flex gap-3">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {TEXTS.AULAS_DELETE_CONFIRM_1}
          </button>
          <DialogClose asChild>
            <button
              type="button"
              className="flex-1 rounded-full border px-4 py-2 text-sm text-zinc-700"
            >
              {TEXTS.AULAS_DELETE_CANCEL_1}
            </button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}
