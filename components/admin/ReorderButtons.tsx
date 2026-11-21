'use client'

import { useActionState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { TEXTS } from '@/hardcoded/texts'
import { moveItem, moveStoreSection, type ReorderState } from '@/lib/admin/actions/reorder'

type ReorderTarget =
  | { kind: 'item'; list: 'class' | 'digitalProduct' }
  | { kind: 'storeSection' }

type ReorderButtonsProps = {
  target: ReorderTarget
  id: string
  isFirst: boolean
  isLast: boolean
  tone: 'light' | 'dark'
}

const TONE_CLASSES = {
  light: 'border-white/70 bg-stone-950/70 text-white hover:bg-stone-950/90',
  dark: 'border-zinc-300/70 bg-white/80 text-zinc-900 hover:bg-white',
}

const initialState: ReorderState = {}

export default function ReorderButtons({ target, id, isFirst, isLast, tone }: ReorderButtonsProps) {
  const [state, formAction, pending] = useActionState(
    target.kind === 'item' ? moveItem : moveStoreSection,
    initialState,
  )
  const buttonClass = `inline-flex h-11 w-11 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-35 ${TONE_CLASSES[tone]}`

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      {target.kind === 'item' ? <input type="hidden" name="list" value={target.list} /> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          name="direction"
          value="up"
          disabled={pending || isFirst}
          className={buttonClass}
          aria-label={TEXTS.ADMIN_REORDER_UP_ARIA_1}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          type="submit"
          name="direction"
          value="down"
          disabled={pending || isLast}
          className={buttonClass}
          aria-label={TEXTS.ADMIN_REORDER_DOWN_ARIA_1}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
      {state.error ? (
        <p role="alert" className={`text-xs ${tone === 'light' ? 'text-rose-200' : 'text-rose-700'}`}>
          {TEXTS.ADMIN_REORDER_ERROR_1}
        </p>
      ) : null}
    </form>
  )
}
