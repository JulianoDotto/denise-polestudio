'use client'

import ImageUploadField from '@/components/admin/ImageUploadField'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'
import {
  CONTENT_FORMS,
  type ContentKind,
  type ContentValues,
} from '@/lib/admin/content-forms'

export type ContentTone = 'dark' | 'light'

const TONE_CLASSES: Record<ContentTone, string> = {
  light: 'border-white/70 bg-stone-950/70 text-white hover:bg-stone-950/90',
  dark: 'border-zinc-300/70 bg-white/80 text-zinc-900 hover:bg-white',
}

const CLASS_ICON_CLASSES =
  'border-white/40 bg-stone-950/30 text-zinc-300 hover:bg-stone-950/50'

// Classes keep their own icon style unless a tone is requested explicitly.
export function contentIconButtonClass(kind: ContentKind, tone?: ContentTone) {
  const toneClasses =
    tone === undefined && kind === 'class'
      ? CLASS_ICON_CLASSES
      : TONE_CLASSES[tone ?? 'dark']
  return `inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${toneClasses}`
}

const LABEL_CLASS = 'text-xs uppercase tracking-[0.2em] text-zinc-600'
const TEXT_INPUT_CLASS =
  'w-full rounded-2xl border bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400'
const PLAIN_INPUT_CLASS = 'w-full rounded-2xl border bg-white px-4 py-2 text-sm text-zinc-900'

type ContentFieldsProps = {
  kind: ContentKind
  values?: ContentValues
}

export default function ContentFields({ kind, values }: ContentFieldsProps) {
  const { fields, labels } = CONTENT_FORMS[kind]
  const editing = values !== undefined
  // The old workshop edit form had no placeholders.
  const placeholders = !(kind === 'workshop' && editing)
  const textInputClass = placeholders ? TEXT_INPUT_CLASS : PLAIN_INPUT_CLASS

  return (
    <>
      {fields.includes('title') ? (
        <label className="flex flex-col gap-2 text-sm">
          <span className={LABEL_CLASS}>{labels.title}</span>
          <input
            name="title"
            autoComplete="off"
            required={kind === 'workshop'}
            defaultValue={editing ? (values.title ?? '') : undefined}
            className={textInputClass}
            placeholder={placeholders ? labels.titlePlaceholder : undefined}
          />
        </label>
      ) : null}
      {fields.includes('description') ? (
        <label className="flex flex-col gap-2 text-sm">
          <span className={LABEL_CLASS}>{labels.description}</span>
          <textarea
            name="description"
            autoComplete="off"
            rows={4}
            defaultValue={editing ? (values.description ?? '') : undefined}
            className={textInputClass}
            placeholder={placeholders ? labels.descriptionPlaceholder : undefined}
          />
        </label>
      ) : null}
      {fields.includes('eventDate') ? (
        <label className="flex flex-col gap-2 text-sm">
          <span className={LABEL_CLASS}>{labels.eventDate}</span>
          <input
            name="eventDate"
            type="date"
            defaultValue={editing ? (values.eventDate ?? '') : undefined}
            className={PLAIN_INPUT_CLASS}
          />
        </label>
      ) : null}
      {fields.includes('link') ? (
        <label className="flex flex-col gap-2 text-sm">
          <span className={LABEL_CLASS}>{labels.link}</span>
          <input
            name="hotmartUrl"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            defaultValue={editing ? (values.hotmartUrl ?? '') : undefined}
            className={TEXT_INPUT_CLASS}
            placeholder={labels.linkPlaceholder}
          />
        </label>
      ) : null}
      {fields.includes('digitalType') ? (
        <label className="flex flex-col gap-2 text-sm">
          <span className={LABEL_CLASS}>{labels.digitalType}</span>
          <select
            name="type"
            defaultValue={values?.type ?? 'EBOOK'}
            className={PLAIN_INPUT_CLASS}
          >
            <option value="EBOOK">{labels.typeEbook}</option>
            <option value="VIDEO">{labels.typeVideo}</option>
          </select>
        </label>
      ) : null}
      {fields.includes('cover') ? (
        <ImageUploadField
          name="coverFile"
          label={TEXTS.AULAS_ADMIN_IMAGE_LABEL_1}
          previewLabel={TEXTS.AULAS_ADMIN_PREVIEW_LABEL_1}
          emptyLabel={TEXTS.AULAS_ADMIN_PREVIEW_EMPTY_1}
          previewAlt={TEXTS.AULAS_ADMIN_PREVIEW_ALT_1}
          fallbackUrl={IMAGES.SITE_FALLBACK_1}
          initialUrl={editing ? (values.coverUrl ?? '') : undefined}
        />
      ) : null}
    </>
  )
}
