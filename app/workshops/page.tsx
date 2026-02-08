import { ItemType } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { getItemsByType } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { TEXTS } from '@/hardcoded/texts'

export default async function WorkshopsPage() {
  const phone = getWhatsAppPhone()
  const workshops = await getItemsByType(ItemType.WORKSHOP)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">{TEXTS.WORKSHOPS_PAGE_TITLE_1}</h1>
      <p className="text-sm text-muted-foreground">
        {TEXTS.WORKSHOPS_PAGE_DESCRIPTION_1}
      </p>

      <div className="grid gap-4">
        {workshops.map((workshop) => {
          const message =
            workshop.whatsappTextTemplate ||
            TEXTS.WORKSHOPS_WHATSAPP_TEMPLATE_1.replace('{title}', workshop.title)
          const url = phone ? buildWhatsAppUrl(phone, message) : ''

          return (
            <div key={workshop.id} className="flex flex-col gap-4 rounded-3xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{workshop.title}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {TEXTS.WORKSHOPS_BADGE_1}
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
                    {TEXTS.WORKSHOPS_BUTTON_1}
                  </a>
                </Button>
              ) : (
                <Button disabled>{TEXTS.WORKSHOPS_BUTTON_1}</Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
