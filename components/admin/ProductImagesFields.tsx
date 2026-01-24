'use client'

import { useMemo, useState } from 'react'

function parseLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function ProductImagesFields({
  defaultCoverUrl = '',
  defaultGalleryUrls = '',
}: {
  defaultCoverUrl?: string
  defaultGalleryUrls?: string
}) {
  const [coverUrl, setCoverUrl] = useState(defaultCoverUrl)
  const [galleryUrls, setGalleryUrls] = useState(defaultGalleryUrls)

  const previews = useMemo(() => {
    const gallery = parseLines(galleryUrls)
    const urls = [coverUrl, ...gallery].filter(Boolean)
    return urls
  }, [coverUrl, galleryUrls])

  return (
    <div className="grid gap-4">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Imagem principal (URL)
        </span>
        <input
          name="coverUrl"
          value={coverUrl}
          onChange={(event) => setCoverUrl(event.target.value)}
          className="w-full rounded-2xl border px-4 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Galeria (uma URL por linha)
        </span>
        <textarea
          name="galleryUrls"
          value={galleryUrls}
          onChange={(event) => setGalleryUrls(event.target.value)}
          className="min-h-[120px] w-full rounded-2xl border px-4 py-2 text-sm"
        />
      </label>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Preview
        </span>
        <div className="grid gap-3 md:grid-cols-3">
          {previews.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed p-6 text-center text-xs text-muted-foreground">
              Adicione URLs de imagem para visualizar o preview.
            </div>
          ) : (
            previews.map((url, index) => (
              <div key={`${url}-${index}`} className="overflow-hidden rounded-2xl border">
                <img src={url} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover" />
                <div className="bg-muted/40 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {index === 0 ? 'Principal' : `Imagem ${index + 1}`}
                </div>
              </div>
            ))
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          A primeira imagem será usada como principal. Reordene alterando a sequência das URLs.
        </p>
      </div>
    </div>
  )
}
