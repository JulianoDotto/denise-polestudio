'use client'

import { useActionState } from 'react'
import { Pencil } from 'lucide-react'

import AdminModal from '@/components/site/AdminModal'
import ActionButton from '@/components/site/ActionButton'
import { TEXTS } from '@/hardcoded/texts'
import { updateWorkshopInline } from '@/lib/admin/actions'

type WorkshopEditModalProps = {
  id: string
  title: string
  description?: string | null
}

const initialState = { success: false, error: '' }

export default function WorkshopEditModal({
  id,
  title,
  description,
}: WorkshopEditModalProps) {
  const [state, formAction, pending] = useActionState(
    updateWorkshopInline,
    initialState,
  )

  return (
    <AdminModal
      title={TEXTS.WORKSHOPS_EDIT_MODAL_TITLE_1}
      description={TEXTS.WORKSHOPS_EDIT_MODAL_DESCRIPTION_1}
      error={state.error}
      success={state.success}
      actionState={state}
      closeOnSuccess
      errorMessages={{
        title: TEXTS.WORKSHOPS_ADMIN_ERROR_TITLE_1,
        slug: TEXTS.WORKSHOPS_EDIT_ERROR_SLUG_1,
        update: TEXTS.WORKSHOPS_EDIT_ERROR_UPDATE_1,
      }}
      trigger={
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300/70 bg-white/80 text-zinc-900 transition hover:bg-white"
          aria-label={TEXTS.WORKSHOPS_EDIT_ICON_ARIA_1}
        >
          <Pencil className="h-4 w-4" />
        </button>
      }
    >
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="isActive" value="on" />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.WORKSHOPS_ADMIN_TITLE_LABEL_1}
          </span>
          <input
            name="title"
            required
            defaultValue={title}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.WORKSHOPS_ADMIN_DESCRIPTION_LABEL_1}
          </span>
          <textarea
            name="description"
            rows={4}
            defaultValue={description ?? ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900"
          />
        </label>
        <ActionButton type="submit" size="sm" disabled={pending} className="self-start">
          {pending
            ? TEXTS.WORKSHOPS_ADMIN_SUBMIT_PENDING_1
            : TEXTS.WORKSHOPS_EDIT_SUBMIT_1}
        </ActionButton>
      </form>
    </AdminModal>
  )
}
