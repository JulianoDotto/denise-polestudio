import { getServerSession } from 'next-auth'

import { ItemType } from '@prisma/client'
import ActionButton from '@/components/site/ActionButton'
import EventAdminModal from '@/components/site/EventAdminModal'
import PageHero from '@/components/site/PageHero'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/authOptions'
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
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'
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
    <div className="flex flex-col gap-10 pb-12 text-zinc-900 bg-[#FDFDFD]">
      <PageHero
        imageUrl={IMAGES.EVENTOS_BANNER_1}
        title={TEXTS.EVENTOS_PAGE_TITLE_1}
        eyebrow={TEXTS.EVENTOS_TYPES_TITLE_1}
      />

      <section className="mx-auto w-full max-w-5xl px-4">
        <h2 className="text-xl uppercase tracking-[0.35em] text-zinc-500">
          {TEXTS.EVENTOS_TYPES_TITLE_1}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-zinc-700">
          {TEXTS.EVENTOS_DESCRIPTION_1}
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-700">
          {TEXTS.EVENTOS_SECTION_P2_1}
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {eventTypes.map((type) => (
            <div
              key={type}
              className="rounded-full border border-[#3a1a26]/20 bg-white px-4 py-2 text-sm text-zinc-700"
            >
              {type}
            </div>
          ))}
        </div>
        <div className="mt-6">
          {contactUrl ? (
            <ActionButton
              href={contactUrl}
              target="_blank"
              size="lg"
              className="w-full max-w-md uppercase tracking-[0.2em] shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
            >
              {TEXTS.EVENTOS_CONTACT_BUTTON_1}
            </ActionButton>
          ) : (
            <span className="inline-flex rounded-full border px-4 py-2 text-sm text-muted-foreground">
              {TEXTS.EVENTOS_WHATSAPP_MISSING_1}
            </span>
          )}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold">{TEXTS.EVENTOS_SECTION_UPCOMING_1}</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {events.length} agenda
          </span>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event, index) => {
              const { date, title } = splitEvent(event.description || '')
              const dateLabel =
                formatDateShort(event.eventDate) || date || TEXTS.EVENTOS_DATE_FALLBACK_1
              const details = title || event.description || TEXTS.EVENTOS_CARD_DESCRIPTION_FALLBACK_1
              const typeLabel = eventTypes[index % eventTypes.length]
              const cardMessage = event.whatsappTextTemplate
                ? event.whatsappTextTemplate
                : TEXTS.EVENTOS_WHATSAPP_ITEM_MESSAGE_1.replace('{title}', event.title)
              const eventContactUrl = phone ? buildWhatsAppUrl(phone, cardMessage) : ''

              return (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-[2rem] border border-[#3a1a26]/20 bg-white shadow-[0_20px_45px_-35px_rgba(27,6,11,0.55)]"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-stone-950">
                    <img
                      src={event.coverUrl || IMAGES.EVENTOS_BANNER_1}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                      <span className="rounded-full border border-white/35 bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">
                        {dateLabel}
                      </span>
                      {index === 0 ? (
                        <span className="rounded-full border border-white/35 bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">
                          {TEXTS.EVENTOS_NEXT_BADGE_1}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 p-6">
                    <span className="w-fit rounded-full border border-[#3a1a26]/25 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-600">
                      {typeLabel || TEXTS.EVENTOS_CARD_BADGE_1}
                    </span>
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-600">{details}</p>
                    {eventContactUrl ? (
                      <ActionButton
                        href={eventContactUrl}
                        target="_blank"
                        size="sm"
                        className="w-full uppercase tracking-[0.2em]"
                      >
                        {TEXTS.EVENTOS_CARD_BUTTON_1}
                      </ActionButton>
                    ) : (
                      <span className="rounded-full border px-4 py-2 text-center text-sm text-muted-foreground">
                        {TEXTS.EVENTOS_WHATSAPP_MISSING_1}
                      </span>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[#3a1a26]/30 bg-white/80 p-8 text-center">
            <h3 className="text-lg font-semibold text-zinc-800">{TEXTS.EVENTOS_EMPTY_TITLE_1}</h3>
            <p className="mt-2 text-sm text-zinc-600">{TEXTS.EVENTOS_EMPTY_DESCRIPTION_1}</p>
            {contactUrl ? (
              <ActionButton
                href={contactUrl}
                target="_blank"
                size="sm"
                className="mt-5 uppercase tracking-[0.2em]"
              >
                {TEXTS.EVENTOS_CONTACT_BUTTON_2}
              </ActionButton>
            ) : null}
          </div>
        )}

        {isAdmin ? (
          <div className="flex justify-center">
            <EventAdminModal />
          </div>
        ) : null}
      </section>
    </div>
  )
}
