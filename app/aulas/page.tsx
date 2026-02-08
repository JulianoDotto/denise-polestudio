import { ItemType } from '@prisma/client'
import { getItemsByType } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { TEXTS } from '@/hardcoded/texts'

export default async function AulasPage() {
  const aulas = await getItemsByType(ItemType.CLASS)
  const phone = getWhatsAppPhone()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">{TEXTS.AULAS_PAGE_TITLE_1}</h1>
      <div className="grid gap-4">
        {aulas.map((aula) => {
          const baseMessage =
            aula.whatsappTextTemplate ||
            TEXTS.AULAS_WHATSAPP_TEMPLATE_1.replace('{title}', aula.title)
          const onlineUrl = phone
            ? buildWhatsAppUrl(
                phone,
                `${baseMessage} (${TEXTS.AULAS_WHATSAPP_ONLINE_SUFFIX_1})`,
              )
            : ''
          const presentialUrl = phone
            ? buildWhatsAppUrl(
                phone,
                `${baseMessage} (${TEXTS.AULAS_WHATSAPP_PRESENTIAL_SUFFIX_1})`,
              )
            : ''

          return (
            <div key={aula.id} className="flex flex-col gap-4 rounded-3xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{aula.title}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {TEXTS.AULAS_BADGE_1}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {aula.description || TEXTS.AULAS_DEFAULT_DESC_1}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {onlineUrl ? (
                  <Button asChild>
                    <a href={onlineUrl} target="_blank" rel="noreferrer">
                      {TEXTS.AULAS_BUTTON_ONLINE_1}
                    </a>
                  </Button>
                ) : (
                  <Button disabled>{TEXTS.AULAS_BUTTON_ONLINE_1}</Button>
                )}
                {presentialUrl ? (
                  <Button asChild variant="outline">
                    <a href={presentialUrl} target="_blank" rel="noreferrer">
                      {TEXTS.AULAS_BUTTON_PRESENTIAL_1}
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    {TEXTS.AULAS_BUTTON_PRESENTIAL_1}
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
