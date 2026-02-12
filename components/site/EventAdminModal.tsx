'use client'

import { useActionState } from 'react'

import AdminModal from '@/components/site/AdminModal'
import ActionButton from '@/components/site/ActionButton'
import { createEventInline } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'

const initialState = { success: false, error: '' }

export default function EventAdminModal() {
  const [state, formAction] = useActionState(createEventInline, initialState)

  return (
    <AdminModal
      title={TEXTS.EVENTOS_ADMIN_MODAL_TITLE_1}
      description={TEXTS.EVENTOS_ADMIN_MODAL_DESCRIPTION_1}
      error={state.error}
      success={state.success}
      closeOnSuccess
      errorMessages={{
        title: TEXTS.EVENTOS_ADMIN_ERROR_TITLE_1,
        slug: TEXTS.EVENTOS_ADMIN_ERROR_SLUG_1,
      }}
      trigger={
        <ActionButton type="button" size="lg" className="w-full max-w-md">
          {TEXTS.EVENTOS_ADMIN_TRIGGER_1}
        </ActionButton>
      }
    >
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="isActive" value="on" />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.EVENTOS_ADMIN_TITLE_LABEL_1}
          </span>
          <input
            name="title"
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
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.EVENTOS_ADMIN_IMAGE_LABEL_1}
          </span>
          <input
            name="coverUrl"
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.EVENTOS_ADMIN_IMAGE_PLACEHOLDER_1}
          />
        </label>
        <ActionButton type="submit" size="sm" className="self-start">
          {TEXTS.EVENTOS_ADMIN_SUBMIT_1}
        </ActionButton>
      </form>
    </AdminModal>
  )
}
