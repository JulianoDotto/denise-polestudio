'use client'

import { useState } from 'react'

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
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Foto
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="cursor-pointer rounded-2xl border px-4 py-2 text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground"
        />
      </label>
      <input type="hidden" name="imageUrl" value={preview} />
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Preview
        </span>
        <div className="flex items-center justify-between gap-3 rounded-2xl border bg-muted/40 px-4 py-3">
          <span className="text-xs text-muted-foreground">
            {fileName || 'Nenhuma imagem selecionada'}
          </span>
        </div>
        <img
          src={preview || '/images/placeholder.svg'}
          alt="Preview"
          className="h-32 w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  )
}
