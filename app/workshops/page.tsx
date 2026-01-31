import { ItemType } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { getItemsByType } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'

export default async function WorkshopsPage() {
  const phone = getWhatsAppPhone()
  const workshops = await getItemsByType(ItemType.WORKSHOP)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Workshops</h1>
      <p className="text-sm text-muted-foreground">
        Encontros intensivos para aprofundar técnicas, explorar temas específicos e viver
        experiências únicas.
      </p>

      <div className="grid gap-4">
        {workshops.map((workshop) => {
          const message =
            workshop.whatsappTextTemplate ||
            `Olá, quero informações sobre o workshop ${workshop.title}.`
          const url = phone ? buildWhatsAppUrl(phone, message) : ''

          return (
            <div key={workshop.id} className="flex flex-col gap-4 rounded-3xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{workshop.title}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Workshop
                </span>
              </div>
              {workshop.coverUrl ? (
                <img
                  src={workshop.coverUrl}
                  alt={workshop.title}
                  className="h-40 w-full rounded-2xl object-cover"
                />
              ) : null}
              <p className="text-sm text-muted-foreground">{workshop.description}</p>
              {url ? (
                <Button asChild>
                  <a href={url} target="_blank" rel="noreferrer">
                    QUERO PARTICIPAR
                  </a>
                </Button>
              ) : (
                <Button disabled>QUERO PARTICIPAR</Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
