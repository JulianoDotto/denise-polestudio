'use client'

import { useState } from 'react'

export default function StorePostDurationFields() {
  const [isPinned, setIsPinned] = useState(false)

  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="isPinned"
          checked={isPinned}
          onChange={(event) => setIsPinned(event.target.checked)}
          className="h-4 w-4"
        />
        Publicação fixa
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Tempo de duração
        </span>
        <input
          type="datetime-local"
          name="expiresAt"
          disabled={isPinned}
          className="w-full rounded-2xl border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:bg-muted"
        />
      </label>
    </div>
  )
}
