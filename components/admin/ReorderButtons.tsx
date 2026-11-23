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
  const buttonClass = `inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-35 ${TONE_CLASSES[tone]}`

  // One form per arrow with the direction in a hidden field: React drops the
  // submit button's name when the form action is a function, so the server
  // never saw which arrow was tapped.
  const arrows = [
    { direction: 'up', disabled: isFirst, label: TEXTS.ADMIN_REORDER_UP_ARIA_1, Icon: ChevronUp },
    { direction: 'down', disabled: isLast, label: TEXTS.ADMIN_REORDER_DOWN_ARIA_1, Icon: ChevronDown },
  ] as const

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        {arrows.map(({ direction, disabled, label, Icon }) => (
          <form key={direction} action={formAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="direction" value={direction} />
            {target.kind === 'item' ? (
              <input type="hidden" name="list" value={target.list} />
            ) : null}
            <button
              type="submit"
              disabled={pending || disabled}
              className={buttonClass}
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </button>
          </form>
        ))}
      </div>
      {state.error ? (
        <p role="alert" className={`text-xs ${tone === 'light' ? 'text-rose-200' : 'text-rose-700'}`}>
          {TEXTS.ADMIN_REORDER_ERROR_1}
        </p>
      ) : null}
    </div>
  )
}
