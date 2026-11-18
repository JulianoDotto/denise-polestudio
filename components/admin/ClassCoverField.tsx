'use client'

import { useRef, useState } from 'react'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'
import { validateClassCoverFile } from '@/lib/admin/class-cover'

export default function ClassCoverField({
  initialUrl = '',
}: {
  initialUrl?: string
}) {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [isReading, setIsReading] = useState(false)
  const readSequence = useRef(0)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const sequence = ++readSequence.current
    const file = event.target.files?.[0]
    if (!file) {
      input.setCustomValidity('')
      setPreview('')
      setFileName('')
      setError('')
      setIsReading(false)
      return
    }

    const validationError = validateClassCoverFile(file)
    if (validationError) {
      const message = validationError === 'imageSize'
        ? TEXTS.AULAS_ADMIN_ERROR_IMAGE_SIZE_1
        : TEXTS.AULAS_ADMIN_ERROR_IMAGE_TYPE_1
      input.setCustomValidity(message)
      setPreview('')
      setFileName('')
      setError(message)
      setIsReading(false)
      return
    }

    setFileName(file.name)
    setError('')
    setIsReading(true)
    input.setCustomValidity(TEXTS.AULAS_ADMIN_IMAGE_READING_1)

    const reader = new FileReader()
    reader.onload = () => {
      if (sequence !== readSequence.current) return
      const result = typeof reader.result === 'string' ? reader.result : ''
      if (!result) {
        setError(TEXTS.AULAS_ADMIN_ERROR_IMAGE_DATA_1)
        setIsReading(false)
        input.setCustomValidity(TEXTS.AULAS_ADMIN_ERROR_IMAGE_DATA_1)
        return
      }
      setPreview(result)
      setIsReading(false)
      input.setCustomValidity('')
    }
    reader.onerror = reader.onabort = () => {
      if (sequence !== readSequence.current) return
      setPreview('')
      setError(TEXTS.AULAS_ADMIN_ERROR_IMAGE_DATA_1)
      setIsReading(false)
      input.setCustomValidity(TEXTS.AULAS_ADMIN_ERROR_IMAGE_DATA_1)
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
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="cursor-pointer rounded-2xl border px-4 py-2 text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-stone-950 file:px-4 file:py-2 file:text-xs file:font-medium file:text-zinc-300"
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-rose-700">{error}</p>
      ) : null}
      {isReading ? (
        <p role="status" className="text-sm text-zinc-600">
          {TEXTS.AULAS_ADMIN_IMAGE_READING_1}
        </p>
      ) : null}
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
