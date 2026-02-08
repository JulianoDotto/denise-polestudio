import Link from 'next/link'

import { ItemType } from '@prisma/client'
import { getItemsByType } from '@/lib/db'
import { formatPrice } from '@/lib/format'
import { buildItemMessage, buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export default async function EbooksPage() {
  const ebooks = await getItemsByType(ItemType.EBOOK)
  const phone = getWhatsAppPhone()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">{TEXTS.PRODUTOS_DIGITAIS_PAGE_TITLE_1}</h1>
      <p className="text-sm text-muted-foreground">
        {TEXTS.PRODUTOS_DIGITAIS_DESCRIPTION_1}
      </p>
      <div className="grid gap-6">
        {ebooks.map((ebook) => {
          const message = ebook.whatsappTextTemplate || buildItemMessage(ebook.title)
          const url = phone ? buildWhatsAppUrl(phone, message) : ''
          return (
            <div key={ebook.id} className="flex flex-col gap-4 rounded-3xl border bg-white p-5">
              <div className="flex gap-4">
                <img
                  src={ebook.coverUrl || IMAGES.PRODUTOS_DIGITAIS_PLACEHOLDER_1}
                  alt={ebook.title}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div className="flex flex-1 flex-col gap-1">
                  <h2 className="text-base font-semibold">{ebook.title}</h2>
                  {ebook.priceCents !== null && ebook.priceCents !== undefined ? (
                    <p className="text-xs text-muted-foreground">{formatPrice(ebook.priceCents)}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">{ebook.description}</p>
                </div>
              </div>
              {url ? (
                <Link
                  href={url}
                  target="_blank"
                  className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
                >
                  {TEXTS.PRODUTOS_DIGITAIS_BUTTON_BUY_1}
                </Link>
              ) : (
                <span className="rounded-full border px-4 py-2 text-center text-sm text-muted-foreground">
                  {TEXTS.PRODUTOS_DIGITAIS_WHATSAPP_MISSING_1}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
