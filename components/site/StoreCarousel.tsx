'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'

import { deleteStorePost } from '@/lib/admin/actions'
import { TEXTS } from '@/hardcoded/texts'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

type StoreCarouselItem = {
  id: string
  title: string
  imageUrl: string
}

export default function StoreCarousel({
  items,
  isAdmin = false,
}: {
  items: StoreCarouselItem[]
  isAdmin?: boolean
}) {
  if (items.length === 0) return null

  const slides = items

  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)

  function goToSlide(nextIndex: number) {
    const total = slides.length
    const normalized = (nextIndex + total) % total
    setActiveIndex(normalized)
  }

  const activeSlide = slides[activeIndex]
  const canDelete = isAdmin && items.length > 0

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null
    touchDeltaX.current = 0
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return
    touchDeltaX.current = (event.touches[0]?.clientX ?? 0) - touchStartX.current
  }

  function handleTouchEnd() {
    if (touchStartX.current === null) return
    const threshold = 40
    if (touchDeltaX.current > threshold) {
      goToSlide(activeIndex - 1)
    } else if (touchDeltaX.current < -threshold) {
      goToSlide(activeIndex + 1)
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  return (
    <div className="grid gap-4">
      <div
        className="relative overflow-hidden rounded-[32px] bg-stone-950"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={activeSlide.imageUrl}
          alt={activeSlide.title}
          className="h-[380px] w-full object-cover md:h-[460px]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {canDelete ? (
          <div className="absolute right-4 top-4">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-stone-950/60 text-zinc-300 transition hover:border-white hover:bg-stone-950/80"
                  aria-label={TEXTS.STORE_CAROUSEL_DELETE_ARIA_1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm rounded-3xl border bg-white p-6">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-zinc-900">
                    {TEXTS.STORE_CAROUSEL_DELETE_TITLE_1}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-zinc-600">
                    {TEXTS.STORE_CAROUSEL_DELETE_DESCRIPTION_1}
                  </DialogDescription>
                </DialogHeader>
                <form action={deleteStorePost} className="mt-4 flex gap-3">
                  <input type="hidden" name="id" value={activeSlide.id} />
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-zinc-300"
                  >
                    {TEXTS.STORE_CAROUSEL_DELETE_CONFIRM_1}
                  </button>
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="flex-1 rounded-full border px-4 py-2 text-sm text-zinc-700"
                    >
                      {TEXTS.STORE_CAROUSEL_DELETE_CANCEL_1}
                    </button>
                  </DialogClose>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : null}
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
          <div className="max-w-[70%] text-zinc-300">
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-300/70">
              {TEXTS.STORE_CAROUSEL_FEED_LABEL_1}
            </p>
            <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.2em]">
              {activeSlide.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToSlide(activeIndex - 1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-zinc-300 transition hover:border-white hover:bg-white/10"
              aria-label={TEXTS.STORE_CAROUSEL_PREV_ARIA_1}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex + 1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-zinc-300 transition hover:border-white hover:bg-white/10"
              aria-label={TEXTS.STORE_CAROUSEL_NEXT_ARIA_1}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-zinc-300/60">
        <span>
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(slides.length).padStart(2, '0')}
        </span>
        <div className="flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === activeIndex ? 'bg-white' : 'bg-white/30'
              }`}
              aria-label={`${TEXTS.STORE_CAROUSEL_GOTO_PREFIX_1} ${slide.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
