'use client'

import { useState } from 'react'
import { TEXTS } from '@/hardcoded/texts'

export default function StorePostDurationFields() {
  const [isPinned, setIsPinned] = useState(false)

  function handleOpenPicker(event: React.SyntheticEvent<HTMLInputElement>) {
    if (isPinned) return
    event.currentTarget.showPicker?.()
  }

  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="isPinned"
          checked={isPinned}
          onChange={(event) => setIsPinned(event.target.checked)}
          className="h-4 w-4"
        />
        {TEXTS.STORE_DURATION_PINNED_LABEL_1}
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
          {TEXTS.STORE_DURATION_DURATION_LABEL_1}
        </span>
        <input
          type="datetime-local"
          name="expiresAt"
          disabled={isPinned}
          onClick={handleOpenPicker}
          onFocus={handleOpenPicker}
          className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 disabled:cursor-not-allowed disabled:bg-muted disabled:text-zinc-300"
        />
      </label>
    </div>
  )
}
