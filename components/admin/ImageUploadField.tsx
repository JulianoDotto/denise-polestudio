'use client'

import { useEffect, useRef, useState } from 'react'
import { TEXTS } from '@/hardcoded/texts'
import { ImageTooLargeError, resizeImageFile } from '@/lib/admin/resize-image'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

type ImageUploadFieldProps = {
  name: string
  label: string
  previewLabel: string
  emptyLabel: string
  previewAlt: string
  fallbackUrl: string
  initialUrl?: string
}

export default function ImageUploadField({
  name,
  label,
  previewLabel,
  emptyLabel,
  previewAlt,
  fallbackUrl,
  initialUrl = '',
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [isReading, setIsReading] = useState(false)
  const readSequence = useRef(0)
  const previewUrl = useRef('')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const input = inputRef.current
    const form = input?.form
    function handleReset() {
      // React resets the form after every action, so the state must follow the emptied input.
      readSequence.current += 1
      input?.setCustomValidity('')
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
      previewUrl.current = ''
      setPreview('')
      setFileName('')
      setError('')
      setIsReading(false)
    }
    form?.addEventListener('reset', handleReset)
    return () => {
      form?.removeEventListener('reset', handleReset)
      readSequence.current += 1
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
      previewUrl.current = ''
    }
  }, [])

  function replacePreview(next: string) {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    previewUrl.current = next
    setPreview(next)
  }

  function fail(input: HTMLInputElement, message: string) {
    input.value = ''
    input.setCustomValidity(message)
    replacePreview('')
    setFileName('')
    setError(message)
    setIsReading(false)
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const sequence = ++readSequence.current
    const file = input.files?.[0]
    if (!file) {
      input.setCustomValidity('')
      replacePreview('')
      setFileName('')
      setError('')
      setIsReading(false)
      return
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      fail(input, TEXTS.AULAS_ADMIN_ERROR_IMAGE_TYPE_1)
      return
    }

    setFileName(file.name)
    setError('')
    setIsReading(true)
    input.setCustomValidity(TEXTS.AULAS_ADMIN_IMAGE_READING_1)

    try {
      const resized = await resizeImageFile(file)
      if (sequence !== readSequence.current) return
      const transfer = new DataTransfer()
      transfer.items.add(resized)
      input.files = transfer.files
      replacePreview(URL.createObjectURL(resized))
      setIsReading(false)
      input.setCustomValidity('')
    } catch (caught) {
      if (sequence !== readSequence.current) return
      fail(
        input,
        caught instanceof ImageTooLargeError
          ? TEXTS.AULAS_ADMIN_ERROR_IMAGE_SIZE_1
          : TEXTS.AULAS_ADMIN_ERROR_IMAGE_DATA_1,
      )
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">{label}</span>
        <input
          type="file"
          ref={inputRef}
          name={name}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="w-full min-w-0 max-w-full cursor-pointer rounded-2xl border px-4 py-2 text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-stone-950 file:px-4 file:py-2 file:text-xs file:font-medium file:text-zinc-300"
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
      <div className="flex min-w-0 flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">{previewLabel}</span>
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border bg-muted/40 px-4 py-3">
          <span className="min-w-0 truncate text-xs text-zinc-600">{fileName || emptyLabel}</span>
        </div>
        <img
          src={preview || initialUrl || fallbackUrl}
          alt={previewAlt}
          className="h-32 w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
