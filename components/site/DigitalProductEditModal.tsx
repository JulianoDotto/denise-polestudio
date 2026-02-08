'use client'

import { useActionState } from 'react'
import { Pencil } from 'lucide-react'

import AdminModal from '@/components/site/AdminModal'
import { updateDigitalProductInline } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'

type DigitalProductEditModalProps = {
  id: string
  title: string
  description?: string | null
  hotmartUrl?: string | null
  type: 'EBOOK' | 'VIDEO'
  tone?: 'dark' | 'light'
}

const initialState = { success: false, error: '' }

export default function DigitalProductEditModal({
  id,
  title,
  description,
  hotmartUrl,
  type,
  tone = 'dark',
}: DigitalProductEditModalProps) {
  const [state, formAction] = useActionState(updateDigitalProductInline, initialState)
  const toneClasses =
    tone === 'light'
      ? 'border-white/70 bg-stone-950/70 text-white hover:bg-stone-950/90'
      : 'border-zinc-300/70 bg-white/80 text-zinc-900 hover:bg-white'

  return (
    <AdminModal
      title={TEXTS.PRODUTOS_DIGITAIS_EDIT_MODAL_TITLE_1}
      description={TEXTS.PRODUTOS_DIGITAIS_EDIT_MODAL_DESCRIPTION_1}
      error={state.error}
      success={state.success}
      closeOnSuccess
      errorMessages={{
        title: TEXTS.PRODUTOS_DIGITAIS_ADMIN_ERROR_TITLE_1,
        type: TEXTS.PRODUTOS_DIGITAIS_ADMIN_ERROR_TYPE_1,
      }}
      trigger={
        <button
          type="button"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${toneClasses}`}
          aria-label={TEXTS.PRODUTOS_DIGITAIS_EDIT_ICON_ARIA_1}
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
            {TEXTS.PRODUTOS_DIGITAIS_ADMIN_TITLE_LABEL_1}
          </span>
          <input
            name="title"
            defaultValue={title}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.PRODUTOS_DIGITAIS_ADMIN_TITLE_PLACEHOLDER_1}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.PRODUTOS_DIGITAIS_ADMIN_DESCRIPTION_LABEL_1}
          </span>
          <textarea
            name="description"
            rows={4}
            defaultValue={description ?? ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.PRODUTOS_DIGITAIS_ADMIN_DESCRIPTION_PLACEHOLDER_1}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.PRODUTOS_DIGITAIS_ADMIN_LINK_LABEL_1}
          </span>
          <input
            name="hotmartUrl"
            defaultValue={hotmartUrl ?? ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
            placeholder={TEXTS.PRODUTOS_DIGITAIS_ADMIN_LINK_PLACEHOLDER_1}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.PRODUTOS_DIGITAIS_ADMIN_TYPE_LABEL_1}
          </span>
          <select
            name="type"
            defaultValue={type}
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900"
          >
            <option value="EBOOK">{TEXTS.PRODUTOS_DIGITAIS_ADMIN_TYPE_EBOOK_1}</option>
            <option value="VIDEO">{TEXTS.PRODUTOS_DIGITAIS_ADMIN_TYPE_VIDEO_1}</option>
          </select>
        </label>
        <button
          type="submit"
          className="self-start rounded-full bg-[#0E0E0E] px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-stone-950"
        >
          {TEXTS.PRODUTOS_DIGITAIS_ADMIN_SUBMIT_1}
        </button>
      </form>
    </AdminModal>
  )
}
