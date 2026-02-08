'use client'

import { useActionState } from 'react'

import AdminModal from '@/components/site/AdminModal'
import ActionButton from '@/components/site/ActionButton'
import ClassCoverField from '@/components/site/ClassCoverField'
import { createClassInline } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'

const initialState = { success: false, error: '' }

export default function AulasAdminModal() {
  const [state, formAction] = useActionState(createClassInline, initialState)

  return (
    <AdminModal
      title={TEXTS.AULAS_ADMIN_MODAL_TITLE_1}
      description={TEXTS.AULAS_ADMIN_MODAL_DESCRIPTION_1}
      error={state.error}
      success={state.success}
      closeOnSuccess
      errorMessages={{
        title: TEXTS.AULAS_ADMIN_ERROR_TITLE_1,
      }}
      trigger={
        <ActionButton type="button" size="lg" className="w-full max-w-md">
          {TEXTS.AULAS_ADMIN_TRIGGER_1}
        </ActionButton>
      }
    >
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="isActive" value="on" />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.AULAS_ADMIN_TITLE_LABEL_1}
          </span>
          <input
            name="title"
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
            placeholder={TEXTS.AULAS_ADMIN_TITLE_PLACEHOLDER_1}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.AULAS_ADMIN_DESCRIPTION_LABEL_1}
          </span>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
            placeholder={TEXTS.AULAS_ADMIN_DESCRIPTION_PLACEHOLDER_1}
          />
        </label>
        <ClassCoverField />
        <ActionButton type="submit" size="sm" className="self-start">
          {TEXTS.AULAS_ADMIN_SUBMIT_1}
        </ActionButton>
      </form>
    </AdminModal>
  )
}
