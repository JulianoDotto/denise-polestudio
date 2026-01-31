import { ItemType } from '@prisma/client'
import { getItemsByType } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'

export default async function AulasPage() {
  const aulas = await getItemsByType(ItemType.CLASS)
  const phone = getWhatsAppPhone()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Aulas</h1>
      <div className="grid gap-4">
        {aulas.map((aula) => {
          const baseMessage =
            aula.whatsappTextTemplate || `Olá, quero agendar a aula ${aula.title}.`
          const onlineUrl = phone
            ? buildWhatsAppUrl(phone, `${baseMessage} (Aula online)`)
            : ''
          const presentialUrl = phone
            ? buildWhatsAppUrl(phone, `${baseMessage} (Aula presencial)`)
            : ''

          return (
            <div key={aula.id} className="flex flex-col gap-4 rounded-3xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{aula.title}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Aula
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {aula.description || 'Aula personalizada para sua evolução e bem-estar.'}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {onlineUrl ? (
                  <Button asChild>
                    <a href={onlineUrl} target="_blank" rel="noreferrer">
                      AGENDAR ONLINE
                    </a>
                  </Button>
                ) : (
                  <Button disabled>AGENDAR ONLINE</Button>
                )}
                {presentialUrl ? (
                  <Button asChild variant="outline">
                    <a href={presentialUrl} target="_blank" rel="noreferrer">
                      AGENDAR PRESENCIAL
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    AGENDAR PRESENCIAL
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
