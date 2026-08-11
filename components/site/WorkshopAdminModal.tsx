'use client'

import { useActionState } from 'react'

import ActionButton from '@/components/site/ActionButton'
import AdminModal from '@/components/site/AdminModal'
import { TEXTS } from '@/hardcoded/texts'
import { createWorkshopInline } from '@/lib/admin/actions'

const initialState = { success: false, error: '' }

export default function WorkshopAdminModal() {
  const [state, formAction, pending] = useActionState(
    createWorkshopInline,
    initialState,
  )

  return (
    <AdminModal
      title={TEXTS.WORKSHOPS_ADMIN_MODAL_TITLE_1}
      description={TEXTS.WORKSHOPS_ADMIN_MODAL_DESCRIPTION_1}
      error={state.error}
      success={state.success}
      actionState={state}
      closeOnSuccess
      errorMessages={{
        title: TEXTS.WORKSHOPS_ADMIN_ERROR_TITLE_1,
        create: TEXTS.WORKSHOPS_ADMIN_ERROR_CREATE_1,
      }}
      trigger={
        <ActionButton type="button" size="lg" className="w-full max-w-md">
          {TEXTS.WORKSHOPS_ADMIN_TRIGGER_1}
        </ActionButton>
      }
    >
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="isActive" value="on" />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.WORKSHOPS_ADMIN_TITLE_LABEL_1}
          </span>
          <input
            name="title"
            required
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.WORKSHOPS_ADMIN_TITLE_PLACEHOLDER_1}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.WORKSHOPS_ADMIN_DESCRIPTION_LABEL_1}
          </span>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.WORKSHOPS_ADMIN_DESCRIPTION_PLACEHOLDER_1}
          />
        </label>
        <ActionButton type="submit" size="sm" disabled={pending} className="self-start">
          {pending
            ? TEXTS.WORKSHOPS_ADMIN_SUBMIT_PENDING_1
            : TEXTS.WORKSHOPS_ADMIN_SUBMIT_1}
        </ActionButton>
      </form>
    </AdminModal>
  )
}
