import Link from 'next/link'

import { ItemType } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { formatDateShort } from '@/lib/format'

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
    ? buildWhatsAppUrl(phone, 'Olá, quero informações sobre os próximos eventos.')
    : ''
  const eventTypes = [
    'Eventos corporativos',
    'Aulas especiais para grupos',
    'Experiências sensoriais',
    'Apresentações e performances',
  ]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Eventos</h1>

      <div className="flex flex-col gap-6 rounded-3xl border bg-white p-6">
        <img
          src="/images/placeholder.svg"
          alt="Banner de eventos"
          className="h-48 w-full rounded-3xl object-cover"
        />
        <p className="text-sm text-muted-foreground">
          Eventos exclusivos com foco em dança, sensualidade e conexão. Entre em contato para
          receber detalhes completos.
        </p>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p className="text-xs uppercase tracking-[0.2em]">Tipos de eventos</p>
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
            ENTRAR EM CONTATO
          </Link>
        ) : (
          <span className="rounded-full border px-4 py-2 text-center text-sm text-muted-foreground">
            Configure o WhatsApp para contato
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Próximos eventos</h2>
        <div className="flex flex-col gap-3">
          {events.map((event) => {
            const { date, title } = splitEvent(event.description || '')
            const dateLabel = formatDateShort(event.eventDate) || date || 'EM BREVE'
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
            FALAR NO WHATSAPP
          </Link>
        ) : (
          <span className="rounded-full border px-4 py-2 text-center text-sm text-muted-foreground">
            Configure o WhatsApp para contato
          </span>
        )}
      </div>
    </div>
  )
}
