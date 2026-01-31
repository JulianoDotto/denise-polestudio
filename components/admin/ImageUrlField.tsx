'use client'

import { useEffect, useState } from 'react'

export default function ImageUrlField({
  name,
  label,
  defaultValue = '',
}: {
  name: string
  label: string
  defaultValue?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      setFileName('')
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setValue(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="cursor-pointer rounded-2xl border px-4 py-2 text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground"
        />
      </label>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preview</span>
        {fileName ? (
          <span className="text-xs text-muted-foreground">{fileName}</span>
        ) : null}
        <img
          src={value || '/images/placeholder.svg'}
          alt="Preview"
          className="h-32 w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
