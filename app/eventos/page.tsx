import { getServerSession } from 'next-auth'

import { ItemType } from '@prisma/client'
import ActionButton from '@/components/site/ActionButton'
import EventAdminModal from '@/components/site/EventAdminModal'
import EventDeleteButton from '@/components/site/EventDeleteButton'
import EventEditModal from '@/components/site/EventEditModal'
import PageHero from '@/components/site/PageHero'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/authOptions'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

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
            {events.map((event) => {
              const { day, month, year } = getEventDateParts(event.eventDate)
              const details = event.description
              const cardMessage = event.whatsappTextTemplate
                ? event.whatsappTextTemplate
                : TEXTS.EVENTOS_WHATSAPP_ITEM_MESSAGE_1.replace('{title}', event.title)
              const eventContactUrl = phone ? buildWhatsAppUrl(phone, cardMessage) : ''
              const dateA11yLabel = event.eventDate
                ? new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'UTC',
                  }).format(event.eventDate)
                : TEXTS.EVENTOS_DATE_FALLBACK_1

              return (
                <article
                  key={event.id}
                  className="rounded-[2rem] border border-[#3a1a26]/20 bg-white p-6 shadow-[0_20px_45px_-35px_rgba(27,6,11,0.55)]"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-end gap-2">
                      {isAdmin ? (
                        <div className="flex items-center gap-2">
                          <EventEditModal
                            id={event.id}
                            title={event.title}
                            description={event.description}
                            coverUrl={event.coverUrl}
                            eventDate={
                              event.eventDate ? event.eventDate.toISOString().slice(0, 10) : ''
                            }
                            isActive={event.isActive}
                          />
                          <EventDeleteButton id={event.id} title={event.title} />
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-5">
                      <div
                        role="text"
                        aria-label={`Data do evento: ${dateA11yLabel}`}
                        className="grid w-[64px] shrink-0 grid-cols-12 gap-y-1"
                      >
                        {day.split('').map((char, idx) => (
                          <span
                            key={`day-${event.id}-${idx}`}
                            aria-hidden="true"
                            className="col-span-6 text-center text-4xl font-display tabular-nums text-zinc-900"
                          >
                            {char}
                          </span>
                        ))}
                        {month.split('').map((char, idx) => (
                          <span
                            key={`month-${event.id}-${idx}`}
                            aria-hidden="true"
                            className="col-span-4 font-bold text-center text-base font-display uppercase text-[#3a1a26]/80"
                          >
                            {char}
                          </span>
                        ))}
                        {year.split('').map((char, idx) => (
                          <span
                            key={`year-${event.id}-${idx}`}
                            aria-hidden="true"
                            className="col-span-3 text-center text-base font-display text-[#3a1a26]/80"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <p className="text-sm leading-relaxed text-zinc-600">{details}</p>
                      </div>
                    </div>

                    {eventContactUrl && (
                      <ActionButton
                        href={eventContactUrl}
                        target="_blank"
                        size="sm"
                        className="w-full uppercase tracking-[0.2em]"
                      >
                        {TEXTS.EVENTOS_CARD_BUTTON_1}
                      </ActionButton>
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
