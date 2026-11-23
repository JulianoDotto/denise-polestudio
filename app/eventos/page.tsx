import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'

import { ItemType } from '@prisma/client'
import ActionButton from '@/components/site/ActionButton'
import ContentDeleteButton from '@/components/admin/ContentDeleteButton'
import ContentFormModal from '@/components/admin/ContentFormModal'
import EmptyState from '@/components/site/EmptyState'
import EventFormats from '@/components/site/EventFormats'
import PageHero from '@/components/site/PageHero'
import PageIntro from '@/components/site/PageIntro'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/authOptions'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { TEXTS } from '@/hardcoded/texts'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  title: TEXTS.META_EVENTOS_TITLE_1,
  description: TEXTS.META_EVENTOS_DESCRIPTION_1,
  ...pageMetadata('/eventos'),
}

function getEventDateParts(date?: Date | null) {
  if (!date || Number.isNaN(date.getTime())) {
    return { day: '--', month: '---', year: '----' }
  }

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' })
    .format(date)
    .replace('.', '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, '-')
  const year = String(date.getUTCFullYear())
  return { day, month, year }
}

export default async function EventosPage() {
  const events = await prisma.item.findMany({
    where: { type: ItemType.EVENT, isActive: true },
    orderBy: [{ eventDate: 'asc' }, { createdAt: 'desc' }],
  })
  const phone = getWhatsAppPhone()
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'
  const contactUrl = phone ? buildWhatsAppUrl(phone, TEXTS.EVENTOS_WHATSAPP_MESSAGE_1) : ''

  return (
    <div className="flex flex-col gap-3 pb-3">
      <PageHero title={TEXTS.EVENTOS_PAGE_TITLE_1} eyebrow={TEXTS.EVENTOS_HERO_EYEBROW_1} index={4} total={5} />

      <div className="mx-3 rounded-[28px] bg-areia text-zinc-900 py-12 sm:py-16">
        <PageIntro
          eyebrow={TEXTS.EVENTOS_TYPES_TITLE_1}
          headline={TEXTS.EVENTOS_INTRO_HEADLINE_1}
          paragraphs={[TEXTS.EVENTOS_DESCRIPTION_1]}
        />
      </div>

      <EventFormats phone={phone} />

      <section className="mx-3 rounded-[28px] bg-areia text-zinc-900 px-4 pb-12 pt-12 sm:px-8 sm:pt-16">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-vinho/70">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
          {TEXTS.EVENTOS_AGENDA_EYEBROW_1}
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h2 className="font-display text-[2.1rem] leading-[1.08] tracking-[0.005em] text-vinho sm:text-5xl">
            {TEXTS.EVENTOS_SECTION_UPCOMING_1}
          </h2>
          <span className="text-[11px] uppercase tracking-[0.28em] text-vinho/60">
            {events.length === 1 ? '1 evento na agenda' : `${events.length} eventos na agenda`}
          </span>
        </div>
        <div aria-hidden="true" className="mt-6 h-px w-12 bg-vinho/30" />
        <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-700">{TEXTS.EVENTOS_SECTION_P2_1}</p>

        {events.length > 0 ? (
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {events.map((event) => {
              const { day, month, year } = getEventDateParts(event.eventDate)
              const cardMessage = event.whatsappTextTemplate
                ? event.whatsappTextTemplate
                : TEXTS.EVENTOS_WHATSAPP_ITEM_MESSAGE_1.replace('{title}', event.title)
              const eventContactUrl = phone ? buildWhatsAppUrl(phone, cardMessage) : ''
              const dateLabel = event.eventDate
                ? new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC',
                  }).format(event.eventDate)
                : TEXTS.EVENTOS_DATE_FALLBACK_1

              return (
                <li key={event.id}>
                  {/* Ticket: a wine date stub, a perforated seam and the event. */}
                  <article className="relative flex h-full overflow-hidden rounded-[24px] bg-white shadow-[0_24px_48px_-32px_rgba(90,26,42,0.55)] ring-1 ring-vinho/10">
                    <div className="flex w-[88px] shrink-0 flex-col items-center justify-center bg-[linear-gradient(165deg,#6e2235_0%,#5a1a2a_55%,#3a101c_100%)] px-2 py-6 text-marfim sm:w-28">
                      <p className="sr-only">{dateLabel}</p>
                      <span aria-hidden="true" className="font-display text-5xl leading-none tabular-nums">
                        {day}
                      </span>
                      <span aria-hidden="true" className="mt-2 text-xs uppercase tracking-[0.32em]">
                        {month}
                      </span>
                      <span aria-hidden="true" className="mt-1 text-[11px] tracking-[0.2em] text-marfim/60">
                        {year}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="absolute -top-2.5 left-[78px] h-5 w-5 rounded-full bg-areia sm:left-[102px]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-2.5 left-[78px] h-5 w-5 rounded-full bg-areia sm:left-[102px]"
                    />
                    <div className="flex min-w-0 flex-1 flex-col border-l border-dashed border-vinho/25 p-5 sm:p-6">
                      {isAdmin ? (
                        <div className="mb-3 flex items-center justify-end gap-2">
                          <ContentFormModal
                            kind="event"
                            mode="edit"
                            values={{
                              id: event.id,
                              title: event.title,
                              description: event.description,
                              eventDate: event.eventDate ? event.eventDate.toISOString().slice(0, 10) : '',
                            }}
                          />
                          <ContentDeleteButton kind="event" id={event.id} title={event.title} />
                        </div>
                      ) : null}
                      <h3 className="break-words font-display text-xl uppercase leading-tight tracking-[0.1em] text-vinho">
                        {event.title}
                      </h3>
                      {event.description ? (
                        <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
                          {event.description}
                        </p>
                      ) : (
                        <span className="flex-1" />
                      )}
                      {eventContactUrl ? (
                        <ActionButton href={eventContactUrl} target="_blank" size="sm" className="mt-5 w-full">
                          {TEXTS.EVENTOS_CARD_BUTTON_1}
                        </ActionButton>
                      ) : null}
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState
            className="mt-10"
            title={TEXTS.EVENTOS_EMPTY_TITLE_1}
            description={TEXTS.EVENTOS_EMPTY_DESCRIPTION_1}
            action={
              contactUrl ? (
                <ActionButton href={contactUrl} target="_blank" size="sm" className="w-full max-w-xs">
                  {TEXTS.EVENTOS_CONTACT_BUTTON_2}
                </ActionButton>
              ) : (
                <p className="text-sm text-zinc-500">{TEXTS.EVENTOS_WHATSAPP_MISSING_1}</p>
              )
            }
          />
        )}

        {events.length > 0 && contactUrl ? (
          <ActionButton
            href={contactUrl}
            target="_blank"
            size="lg"
            variant="outline"
            className="mt-8 w-full sm:w-auto"
          >
            {TEXTS.EVENTOS_CONTACT_BUTTON_1}
          </ActionButton>
        ) : null}

        {isAdmin ? (
          <div className="mt-8 flex justify-center">
            <ContentFormModal kind="event" mode="create" />
          </div>
        ) : null}
      </section>
    </div>
  )
}
