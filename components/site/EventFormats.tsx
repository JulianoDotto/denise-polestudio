import { Plus } from 'lucide-react'

import ActionButton from '@/components/site/ActionButton'
import { EVENT_TYPES } from '@/hardcoded/event-types'
import { TEXTS } from '@/hardcoded/texts'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

type EventFormatsProps = {
  phone: string | null | undefined
}

// The kinds of event Denise brings to a client's party, as an open list on a dark band.
// Every title is visible at once; a tap opens the details and the WhatsApp request.
export default function EventFormats({ phone }: EventFormatsProps) {
  return (
    <section className="px-3">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-tinta text-marfim">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-vinho opacity-70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-96 w-96 rounded-full bg-vinho/40 blur-3xl"
      />

      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-marfim/60">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
          {TEXTS.EVENTOS_FORMATS_EYEBROW_1}
        </p>
        <h2 className="mt-5 font-display text-[2.1rem] leading-[1.08] tracking-[0.005em] text-marfim sm:text-5xl">
          {TEXTS.EVENTOS_FORMATS_TITLE_1}
        </h2>
        <div aria-hidden="true" className="mt-6 h-px w-12 bg-marfim/30" />
        <p className="mt-6 max-w-xl text-base leading-relaxed text-marfim/70">
          {TEXTS.EVENTOS_FORMATS_TEXT_1}
        </p>

        <ul className="mt-10 border-t border-marfim/10">
          {EVENT_TYPES.map((format, index) => {
            const requestUrl = phone
              ? buildWhatsAppUrl(phone, TEXTS.EVENTOS_FORMAT_WHATSAPP_1.replace('{title}', format.title))
              : ''
            return (
              <li key={format.title} className="border-b border-marfim/10">
                <details className="group" name="event-format">
                  <summary className="flex min-h-[72px] cursor-pointer list-none items-center gap-4 py-4 focus-visible:outline-none [&::-webkit-details-marker]:hidden sm:gap-6">
                    <span aria-hidden="true" className="w-7 shrink-0 text-[11px] tracking-[0.32em] text-marfim/45 sm:w-10">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1 font-display text-[15px] min-[360px]:text-lg uppercase leading-tight tracking-[0.05em] min-[360px]:tracking-[0.12em] text-marfim transition-colors duration-300 group-open:text-[#e3b3be] group-hover:text-marfim/80 group-focus-visible:underline group-focus-visible:underline-offset-8 sm:text-2xl">
                      {format.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-marfim/30 transition duration-300 ease-out group-hover:border-marfim group-open:rotate-45 group-open:border-marfim group-open:bg-marfim group-open:text-tinta motion-reduce:transition-none"
                    >
                      <Plus className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                  </summary>
                  <div className="pb-7 pl-11 pr-2 sm:pl-16 sm:pr-16">
                    <p className="max-w-2xl text-[15px] leading-relaxed text-marfim/75">{format.description}</p>
                    {requestUrl ? (
                      <ActionButton href={requestUrl} target="_blank" size="sm" tone="light" className="mt-6">
                        {TEXTS.EVENTOS_FORMAT_BUTTON_1}
                      </ActionButton>
                    ) : null}
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      </div>
      </div>
    </section>
  )
}
