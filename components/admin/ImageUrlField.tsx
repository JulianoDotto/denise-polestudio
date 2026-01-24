'use client'

import { useState } from 'react'

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

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <input
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-2xl border px-4 py-2 text-sm"
        />
      </label>
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preview</span>
        <img
          src={value || '/images/placeholder.svg'}
          alt="Preview"
          className="h-32 w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
