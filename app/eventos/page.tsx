import Link from 'next/link'

import { ItemType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { formatDateShort } from '@/lib/format'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

function splitEvent(description?: string | null) {
  if (!description) return { date: '', title: '' }
  const parts = description.split(' - ')
  if (parts.length >= 2) {
    return { date: parts[0], title: parts.slice(1).join(' - ') }
  }
  return { date: '', title: description }
}

export default async function EventosPage() {
  const events = await prisma.item.findMany({
    where: { type: ItemType.EVENT, isActive: true },
    orderBy: [{ eventDate: 'asc' }, { createdAt: 'desc' }],
  })
  const phone = getWhatsAppPhone()
  const contactUrl = phone
    ? buildWhatsAppUrl(phone, TEXTS.EVENTOS_WHATSAPP_MESSAGE_1)
    : ''
  const eventTypes = [
    TEXTS.EVENTOS_TYPE_1,
    TEXTS.EVENTOS_TYPE_2,
    TEXTS.EVENTOS_TYPE_3,
    TEXTS.EVENTOS_TYPE_4,
  ]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">{TEXTS.EVENTOS_PAGE_TITLE_1}</h1>

      <div className="flex flex-col gap-6 rounded-3xl border bg-white p-6">
        <img
          src={IMAGES.EVENTOS_BANNER_1}
          alt={TEXTS.EVENTOS_BANNER_ALT_1}
          className="h-48 w-full rounded-3xl object-cover"
        />
        <p className="text-sm text-muted-foreground">
          {TEXTS.EVENTOS_DESCRIPTION_1}
        </p>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p className="text-xs uppercase tracking-[0.2em]">
            {TEXTS.EVENTOS_TYPES_TITLE_1}
          </p>
          <ul className="grid gap-1">
            {eventTypes.map((type) => (
              <li key={type} className="rounded-2xl border px-4 py-2 text-sm">
                {type}
              </li>
            ))}
          </ul>
        </div>
        {contactUrl ? (
          <Link
            href={contactUrl}
            target="_blank"
            className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
          >
            {TEXTS.EVENTOS_CONTACT_BUTTON_1}
          </Link>
        ) : (
          <span className="rounded-full border px-4 py-2 text-center text-sm text-muted-foreground">
            {TEXTS.EVENTOS_WHATSAPP_MISSING_1}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">{TEXTS.EVENTOS_SECTION_UPCOMING_1}</h2>
        <div className="flex flex-col gap-3">
          {events.map((event) => {
            const { date, title } = splitEvent(event.description || '')
            const dateLabel =
              formatDateShort(event.eventDate) || date || TEXTS.EVENTOS_DATE_FALLBACK_1
            return (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-2xl border bg-white p-4"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {dateLabel}
                  </p>
                  <p className="text-sm font-semibold">{event.title}</p>
                </div>
                <span className="text-xs text-muted-foreground">{title}</span>
              </div>
            )
          })}
        </div>
        {contactUrl ? (
          <Link
            href={contactUrl}
            target="_blank"
            className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
          >
            {TEXTS.EVENTOS_CONTACT_BUTTON_2}
          </Link>
        ) : (
          <span className="rounded-full border px-4 py-2 text-center text-sm text-muted-foreground">
            {TEXTS.EVENTOS_WHATSAPP_MISSING_1}
          </span>
        )}
      </div>
    </div>
  )
}
