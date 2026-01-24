import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ItemType } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { getItemBySlug } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'

export default async function AulaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await getItemBySlug(slug)
  if (!item || item.type !== ItemType.CLASS) return notFound()

  const imageUrl = item.coverUrl || item.images[0]?.url || '/images/placeholder.svg'
  const phone = getWhatsAppPhone()
  const baseMessage =
    item.whatsappTextTemplate || `Olá, quero agendar a aula ${item.title}.`

  const onlineMessage = `${baseMessage} (Aula online)`
  const presentialMessage = `${baseMessage} (Aula presencial)`

  const onlineUrl = phone ? buildWhatsAppUrl(phone, onlineMessage) : ''
  const presentialUrl = phone ? buildWhatsAppUrl(phone, presentialMessage) : ''

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-6">
        <img
          src={imageUrl}
          alt={item.title}
          className="h-72 w-full rounded-3xl object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{item.title}</h1>
          <p className="text-sm text-muted-foreground">
            {item.description || 'Descrição detalhada da aula.'}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border bg-white p-5">
            <h2 className="text-base font-semibold">Sobre a aula</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.description || 'Descrição detalhada da aula.'}
            </p>
          </div>
          <div className="rounded-3xl border bg-white p-5">
            <h2 className="text-base font-semibold">Como funciona</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Aulas presenciais ou online, com acompanhamento personalizado e foco na sua evolução.
            </p>
          </div>
          <div className="rounded-3xl border bg-white p-5">
            <h2 className="text-base font-semibold">Informações adicionais</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre em contato para horários, níveis disponíveis e valores promocionais.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {item.hotmartUrl ? (
            <Button asChild>
              <Link href={item.hotmartUrl} target="_blank">
                HOTMART
              </Link>
            </Button>
          ) : null}

          {onlineUrl ? (
            <Button asChild variant="outline">
              <Link href={onlineUrl} target="_blank">
                AGENDAR AULA ONLINE
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              AGENDAR AULA ONLINE
            </Button>
          )}

          {presentialUrl ? (
            <Button asChild variant="outline">
              <Link href={presentialUrl} target="_blank">
                AGENDAR AULA PRESENCIAL
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              AGENDAR AULA PRESENCIAL
            </Button>
          )}

          {!phone ? (
            <p className="text-xs text-muted-foreground">
              Configure o WhatsApp em `.env` para ativar os botões.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
