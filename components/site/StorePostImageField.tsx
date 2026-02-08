'use client'

import { useState } from 'react'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export default function StorePostImageField() {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
          {TEXTS.STORE_IMAGE_FIELD_LABEL_1}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="cursor-pointer rounded-2xl border px-4 py-2 text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground"
        />
      </label>
      <input type="hidden" name="imageUrl" value={preview} />
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
          {TEXTS.STORE_IMAGE_FIELD_PREVIEW_LABEL_1}
        </span>
        <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/40 px-4 py-3">
          <span className="text-xs text-zinc-600">
            {fileName || TEXTS.STORE_IMAGE_FIELD_EMPTY_1}
          </span>
        </div>
        <img
          src={preview || IMAGES.STORE_IMAGE_FIELD_PREVIEW_1}
          alt={TEXTS.STORE_IMAGE_FIELD_PREVIEW_ALT_1}
          className="h-32 w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
