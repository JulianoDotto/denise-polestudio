'use client'

import { useState } from 'react'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export default function ClassCoverField({
  initialUrl = '',
}: {
  initialUrl?: string
}) {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      setPreview('')
      setFileName('')
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setPreview(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
          {TEXTS.AULAS_ADMIN_IMAGE_LABEL_1}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="cursor-pointer rounded-2xl border px-4 py-2 text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-stone-950 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-zinc-300"
        />
      </label>
      <input type="hidden" name="coverUrl" value={preview || initialUrl} />
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
          {TEXTS.AULAS_ADMIN_PREVIEW_LABEL_1}
        </span>
        <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/40 px-4 py-3">
          <span className="text-xs text-zinc-600">
            {fileName || TEXTS.AULAS_ADMIN_PREVIEW_EMPTY_1}
          </span>
        </div>
        <img
          src={preview || initialUrl || IMAGES.AULAS_COVER_FALLBACK_1}
          alt={TEXTS.AULAS_ADMIN_PREVIEW_ALT_1}
          className="h-32 w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
