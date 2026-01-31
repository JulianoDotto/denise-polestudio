'use client'

import { useEffect, useState } from 'react'

type Preview = {
  id: string
  url: string
  name: string
}

export default function StoreUpload() {
  const [previews, setPreviews] = useState<Preview[]>([])

  const hasPreviews = previews.length > 0

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    }
  }, [previews])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    previews.forEach((preview) => URL.revokeObjectURL(preview.url))
    const next = files.map((file, index) => ({
      id: `${file.name}-${index}-${file.size}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    setPreviews(next)
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border bg-white p-6">
      <div>
        <h2 className="text-base font-semibold">Fotos dos produtos</h2>
        <p className="text-sm text-muted-foreground">
          Faça upload de algumas imagens para mostrar o estilo e a qualidade dos produtos.
        </p>
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="cursor-pointer rounded-2xl border px-4 py-3 text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground"
      />
      {hasPreviews ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {previews.map((preview) => (
            <div key={preview.id} className="flex flex-col gap-2">
              <img
                src={preview.url}
                alt={preview.name}
                className="h-32 w-full rounded-2xl object-cover"
              />
              <span className="text-xs text-muted-foreground">{preview.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nenhuma foto selecionada ainda.
        </p>
      )}
    </div>
  )
}
