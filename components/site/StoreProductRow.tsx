'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'

import ActionButton from '@/components/site/ActionButton'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TEXTS } from '@/hardcoded/texts'
import { deleteStorePost } from '@/lib/admin/actions/store-posts'
import { formatPrice } from '@/lib/format'
import { buildProductOrderMessage, formatProductCount } from '@/lib/store-product'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export type StoreProduct = {
  id: string
  title: string
  imageUrl: string
  description: string | null
  priceCents: number | null
}

type StoreProductRowProps = {
  title: string
  items: StoreProduct[]
  whatsappPhone: string
  isAdmin?: boolean
}

// Three cards fit side by side on wider screens, so arrows only help when there are more.
const VISIBLE_ON_DESKTOP = 3

const iconButtonClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-zinc-800 transition hover:border-vinho hover:text-vinho focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vinho'

export default function StoreProductRow({
  title,
  items,
  whatsappPhone,
  isAdmin = false,
}: StoreProductRowProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  if (items.length === 0) return null

  const openProduct = items.find((item) => item.id === openId) ?? null
  const showArrows = items.length > VISIBLE_ON_DESKTOP
  const orderUrl = (item: StoreProduct) =>
    whatsappPhone
      ? buildWhatsAppUrl(whatsappPhone, buildProductOrderMessage(item.title, item.priceCents))
      : ''

  function scrollRow(direction: 1 | -1) {
    const list = listRef.current
    if (!list) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.scrollBy({
      left: direction * list.clientWidth * 0.9,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="grid gap-1">
          <h2 className="font-display text-xl uppercase tracking-[0.3em] text-zinc-800 sm:text-2xl">
            {title}
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {formatProductCount(items.length)}
          </p>
        </div>
        {showArrows ? (
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollRow(-1)}
              className={iconButtonClass}
              aria-label={TEXTS.STORE_CAROUSEL_PREV_ARIA_1}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollRow(1)}
              className={iconButtonClass}
              aria-label={TEXTS.STORE_CAROUSEL_NEXT_ARIA_1}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>

      <ul
        ref={listRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => {
          const price = formatPrice(item.priceCents)
          const url = orderUrl(item)
          return (
            <li
              key={item.id}
              className="w-[72%] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)]"
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(14,11,11,0.06),0_14px_32px_-14px_rgba(90,26,42,0.28)] ring-1 ring-[#e8dfd3] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(14,11,11,0.06),0_22px_44px_-16px_rgba(90,26,42,0.38)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <button
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  className="block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-vinho"
                  aria-label={`${TEXTS.LOJA_PRODUCT_DETAILS_ARIA_1} ${item.title}`}
                >
                  <div className="aspect-square overflow-hidden border-b border-[#efe7dc] bg-white">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading={index < 2 ? undefined : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  <div className="grid gap-1 px-4 pt-4">
                    <h3 className="line-clamp-2 font-sans text-base font-medium leading-snug tracking-normal text-zinc-900">
                      {item.title}
                    </h3>
                    {price ? (
                      <p className="font-display text-lg tracking-[0.08em] text-vinho">{price}</p>
                    ) : null}
                  </div>
                </button>
                {url ? (
                  <div className="mt-auto p-4 pt-3">
                    <ActionButton href={url} target="_blank" rel="noopener noreferrer" size="sm" className="w-full px-3 tracking-[0.06em] sm:tracking-[0.06em]">
                      {TEXTS.LOJA_PRODUCT_ORDER_BUTTON_1}
                    </ActionButton>
                  </div>
                ) : (
                  <div className="pb-4" />
                )}
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-zinc-700 transition hover:border-rose-400 hover:text-rose-600"
                    aria-label={`${TEXTS.STORE_CAROUSEL_DELETE_ARIA_1}: ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </article>
            </li>
          )
        })}
      </ul>

      <Dialog open={openProduct !== null} onOpenChange={(open) => !open && setOpenId(null)}>
        {openProduct ? (
          <DialogContent className="max-w-lg rounded-3xl border bg-white p-0">
            <div className="bg-areia">
              <img
                src={openProduct.imageUrl}
                alt={openProduct.title}
                className="mx-auto max-h-[50vh] w-full object-contain p-6"
              />
            </div>
            <div className="grid gap-3 p-6">
              <DialogHeader className="text-left">
                <DialogTitle className="font-sans text-xl font-medium leading-snug tracking-normal text-zinc-900">
                  {openProduct.title}
                </DialogTitle>
              </DialogHeader>
              {formatPrice(openProduct.priceCents) ? (
                <p className="font-display text-xl tracking-[0.08em] text-zinc-900">
                  {formatPrice(openProduct.priceCents)}
                </p>
              ) : null}
              {openProduct.description ? (
                <DialogDescription className="whitespace-pre-line text-base leading-relaxed text-zinc-700">
                  {openProduct.description}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">{openProduct.title}</DialogDescription>
              )}
              {orderUrl(openProduct) ? (
                <ActionButton
                  href={orderUrl(openProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                  className="mt-2 w-full"
                >
                  {TEXTS.LOJA_PRODUCT_ORDER_BUTTON_1}
                </ActionButton>
              ) : null}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        {deleteId ? (
          <DialogContent className="max-w-sm rounded-3xl border bg-white p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-zinc-900">{TEXTS.STORE_CAROUSEL_DELETE_TITLE_1}</DialogTitle>
              <DialogDescription className="text-sm text-zinc-600">
                {TEXTS.STORE_CAROUSEL_DELETE_DESCRIPTION_1}
              </DialogDescription>
            </DialogHeader>
            <form action={deleteStorePost} className="mt-4 flex gap-3">
              <input type="hidden" name="id" value={deleteId} />
              <button
                type="submit"
                className="flex-1 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-zinc-100"
              >
                {TEXTS.STORE_CAROUSEL_DELETE_CONFIRM_1}
              </button>
              <DialogClose asChild>
                <button type="button" className="flex-1 rounded-full border px-4 py-2 text-sm text-zinc-700">
                  {TEXTS.STORE_CAROUSEL_DELETE_CANCEL_1}
                </button>
              </DialogClose>
            </form>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  )
}
