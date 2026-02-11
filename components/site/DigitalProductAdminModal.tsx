'use client'

import { useActionState } from 'react'

import AdminModal from '@/components/site/AdminModal'
import ActionButton from '@/components/site/ActionButton'
import { createDigitalProductInline } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'

const initialState = { success: false, error: '' }

export default function DigitalProductAdminModal() {
  const [state, formAction] = useActionState(createDigitalProductInline, initialState)

  return (
    <AdminModal
      title={TEXTS.PRODUTOS_DIGITAIS_ADMIN_MODAL_TITLE_1}
      description={TEXTS.PRODUTOS_DIGITAIS_ADMIN_MODAL_DESCRIPTION_1}
      error={state.error}
      success={state.success}
      closeOnSuccess
      errorMessages={{
        title: TEXTS.PRODUTOS_DIGITAIS_ADMIN_ERROR_TITLE_1,
        type: TEXTS.PRODUTOS_DIGITAIS_ADMIN_ERROR_TYPE_1,
      }}
      trigger={
        <ActionButton type="button" size="lg" className="w-full max-w-md">
          {TEXTS.PRODUTOS_DIGITAIS_ADMIN_TRIGGER_1}
        </ActionButton>
      }
    >
      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="isActive" value="on" />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            {TEXTS.PRODUTOS_DIGITAIS_ADMIN_TITLE_LABEL_1}
          </span>
          <input
            name="title"
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
            defaultValue="EBOOK"
            className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900"
          >
            <option value="EBOOK">{TEXTS.PRODUTOS_DIGITAIS_ADMIN_TYPE_EBOOK_1}</option>
            <option value="VIDEO">{TEXTS.PRODUTOS_DIGITAIS_ADMIN_TYPE_VIDEO_1}</option>
          </select>
        </label>
        <ActionButton type="submit" size="sm" className="self-start">
          {TEXTS.PRODUTOS_DIGITAIS_ADMIN_SUBMIT_1}
        </ActionButton>
      </form>
    </AdminModal>
  )
}
