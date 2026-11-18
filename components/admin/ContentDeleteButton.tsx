'use client'

import { useActionState } from 'react'
import { Trash2 } from 'lucide-react'

import {
  contentIconButtonClass,
  type ContentTone,
} from '@/components/admin/ContentFields'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  deleteClassInline,
  deleteDigitalProductInline,
  deleteEventInline,
  deleteWorkshopInline,
} from '@/lib/admin/actions'
import { CONTENT_FORMS, type ContentKind } from '@/lib/admin/content-forms'

const initialState = { success: false, error: '' }

const DELETE_ACTIONS = {
  class: deleteClassInline,
  event: deleteEventInline,
  workshop: deleteWorkshopInline,
  digitalProduct: deleteDigitalProductInline,
}

type ContentDeleteButtonProps = {
  kind: ContentKind
  id: string
  title: string
  tone?: ContentTone
}

export default function ContentDeleteButton({
  kind,
  id,
  title,
  tone,
}: ContentDeleteButtonProps) {
  const config = CONTENT_FORMS[kind].delete
  const [state, formAction, pending] = useActionState(
    DELETE_ACTIONS[kind],
    initialState,
  )
  const showPending = pending && Boolean(config.pending)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={contentIconButtonClass(kind, tone)}
          aria-label={config.iconAria}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-3xl border bg-white p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-zinc-900">{config.title}</DialogTitle>
          <DialogDescription className="text-sm text-zinc-600">
            {config.description.replace('{title}', title)}
          </DialogDescription>
        </DialogHeader>
        {state.error ? (
          <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {config.error}
          </p>
        ) : null}
        <form action={formAction} className="mt-4 flex gap-3">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={showPending}
            className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-zinc-300 disabled:opacity-60"
          >
            {showPending ? config.pending : config.confirm}
          </button>
          <DialogClose asChild>
            <button
              type="button"
              className="flex-1 rounded-full border px-4 py-2 text-sm text-zinc-700"
            >
              {config.cancel}
            </button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}
