'use client'

import { useActionState } from 'react'
import { Pencil } from 'lucide-react'

import AdminModal from '@/components/site/AdminModal'
import { updateEventInline } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'

type EventEditModalProps = {
  id: string
  title: string
  description?: string | null
  coverUrl?: string | null
  eventDate?: string
  isActive?: boolean
  tone?: 'dark' | 'light'
}

const initialState = { success: false, error: '' }

export default function EventEditModal({
  id,
  title,
  description,
  coverUrl,
  eventDate,
  isActive = true,
  tone = 'dark',
}: EventEditModalProps) {
  const [state, formAction] = useActionState(updateEventInline, initialState)
  const toneClasses =
    tone === 'light'
      ? 'border-white/70 bg-stone-950/70 text-white hover:bg-stone-950/90'
      : 'border-zinc-300/70 bg-white/80 text-zinc-900 hover:bg-white'

  return (
    <AdminModal
      title={TEXTS.EVENTOS_EDIT_MODAL_TITLE_1}
      description={TEXTS.EVENTOS_EDIT_MODAL_DESCRIPTION_1}
      error={state.error}
      success={state.success}
      closeOnSuccess
      errorMessages={{
        title: TEXTS.EVENTOS_ADMIN_ERROR_TITLE_1,
        slug: TEXTS.EVENTOS_ADMIN_ERROR_SLUG_1,
      }}
      trigger={
        <button
          type="button"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${toneClasses}`}
          aria-label={TEXTS.EVENTOS_EDIT_ICON_ARIA_1}
        >
          <Pencil className="h-4 w-4" />
        </button>
      }
    >
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="isActive" value={isActive ? 'on' : ''} />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.EVENTOS_ADMIN_TITLE_LABEL_1}
          </span>
          <input
            name="title"
            defaultValue={title}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.EVENTOS_ADMIN_TITLE_PLACEHOLDER_1}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.EVENTOS_ADMIN_DESCRIPTION_LABEL_1}
          </span>
          <textarea
            name="description"
            rows={4}
            defaultValue={description ?? ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.EVENTOS_ADMIN_DESCRIPTION_PLACEHOLDER_1}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.EVENTOS_ADMIN_DATE_LABEL_1}
          </span>
          <input
            name="eventDate"
            type="date"
            defaultValue={eventDate ?? ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.EVENTOS_ADMIN_IMAGE_LABEL_1}
          </span>
          <input
            name="coverUrl"
            defaultValue={coverUrl ?? ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.EVENTOS_ADMIN_IMAGE_PLACEHOLDER_1}
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-full bg-[#0E0E0E] px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-stone-950"
        >
          {TEXTS.EVENTOS_EDIT_MODAL_SUBMIT_1}
        </button>
      </form>
    </AdminModal>
  )
}
