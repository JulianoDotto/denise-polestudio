'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { EVENT_TYPES } from '@/hardcoded/event-types'
import { TEXTS } from '@/hardcoded/texts'
import {
  getEventTypeSwipeDirection,
  moveEventTypeIndex,
} from '@/lib/event-types-carousel'

export default function EventTypesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const activeEvent = EVENT_TYPES[activeIndex]

  function move(direction: -1 | 1) {
    setActiveIndex((current) => moveEventTypeIndex(current, direction, EVENT_TYPES.length))
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0]
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const start = touchStart.current
    const touch = event.changedTouches[0]
    touchStart.current = null

    if (!start || !touch) return

    const direction = getEventTypeSwipeDirection(
      start.x,
      start.y,
      touch.clientX,
      touch.clientY,
    )
    if (direction) move(direction)
  }

  return (
    <div
      className="mt-6 rounded-[2rem] border border-[#3a1a26]/20 bg-white p-6 shadow-[0_20px_45px_-35px_rgba(27,6,11,0.55)] sm:p-8"
      role="region"
      aria-roledescription="carrossel"
      aria-label={TEXTS.EVENTOS_TYPES_CAROUSEL_LABEL_1}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchStart.current = null
      }}
    >
      <div aria-live="polite" aria-atomic="true" style={{ minHeight: '22rem' }}>
        <article
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} de ${EVENT_TYPES.length}`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(EVENT_TYPES.length).padStart(2, '0')}
          </p>
          <h3 className="mt-5 font-display text-2xl uppercase tracking-[0.2em] text-zinc-800 sm:text-3xl">
            {activeEvent.title}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-zinc-700">
            {activeEvent.description}
          </p>
        </article>
      </div>

      <div
        className="mt-6 flex items-center justify-between gap-4 border-t border-[#3a1a26]/10"
        style={{ paddingTop: 'inherit' }}
      >
        <button
          type="button"
          onClick={() => move(-1)}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#3a1a26]/30 text-zinc-700 transition hover:bg-[#3a1a26]/5"
          style={{ width: '2.75rem', height: '2.75rem' }}
          aria-label={TEXTS.EVENTOS_TYPES_PREV_ARIA_1}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex gap-2" aria-hidden="true">
          {EVENT_TYPES.map((event, index) => (
            <span
              key={event.title}
              className={`h-2 w-2 rounded-full ${
                index === activeIndex ? 'bg-[#3a1a26]' : 'bg-[#3a1a26]/20'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => move(1)}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#3a1a26]/30 text-zinc-700 transition hover:bg-[#3a1a26]/5"
          style={{ width: '2.75rem', height: '2.75rem' }}
          aria-label={TEXTS.EVENTOS_TYPES_NEXT_ARIA_1}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
