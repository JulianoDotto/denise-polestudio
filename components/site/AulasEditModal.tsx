'use client'

import { useFormState } from 'react-dom'
import { Pencil } from 'lucide-react'

import AdminModal from '@/components/site/AdminModal'
import ClassCoverField from '@/components/site/ClassCoverField'
import { updateClassInline } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'

type AulasEditModalProps = {
  id: string
  title: string
  description?: string | null
  coverUrl?: string | null
}

const initialState = { success: false, error: '' }

export default function AulasEditModal({
  id,
  title,
  description,
  coverUrl,
}: AulasEditModalProps) {
  const [state, formAction] = useFormState(updateClassInline, initialState)

  return (
    <AdminModal
      title={TEXTS.AULAS_EDIT_MODAL_TITLE_1}
      description={TEXTS.AULAS_EDIT_MODAL_DESCRIPTION_1}
      error={state.error}
      success={state.success}
      closeOnSuccess
      errorMessages={{
        title: TEXTS.AULAS_ADMIN_ERROR_TITLE_1,
      }}
      trigger={
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white transition hover:bg-black/50"
          aria-label={TEXTS.AULAS_EDIT_ICON_ARIA_1}
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
            {TEXTS.AULAS_ADMIN_TITLE_LABEL_1}
          </span>
          <input
            name="title"
            defaultValue={title}
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
            defaultValue={description ?? ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
            placeholder={TEXTS.AULAS_ADMIN_DESCRIPTION_PLACEHOLDER_1}
          />
        </label>
        <ClassCoverField initialUrl={coverUrl ?? ''} />
        <button
          type="submit"
          className="self-start rounded-full bg-[#0E0E0E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          {TEXTS.AULAS_ADMIN_SUBMIT_1}
        </button>
      </form>
    </AdminModal>
  )
}
