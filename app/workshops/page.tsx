import { ItemType } from '@prisma/client'
import { getServerSession } from 'next-auth'

import { Button } from '@/components/ui/button'
import ContentDeleteButton from '@/components/admin/ContentDeleteButton'
import ContentFormModal from '@/components/admin/ContentFormModal'
import WorkshopCreateModal from '@/components/admin/WorkshopCreateModal'
import { authOptions } from '@/lib/auth/authOptions'
import { getItemsByType } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { TEXTS } from '@/hardcoded/texts'

export default async function WorkshopsPage() {
  const phone = getWhatsAppPhone()
  const workshops = await getItemsByType(ItemType.WORKSHOP)
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

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
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-zinc-900">{workshop.title}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {TEXTS.WORKSHOPS_BADGE_1}
                  </span>
                  {isAdmin ? (
                    <>
                      <ContentFormModal
                        kind="workshop"
                        mode="edit"
                        values={{
                          id: workshop.id,
                          title: workshop.title,
                          description: workshop.description,
                        }}
                      />
                      <ContentDeleteButton
                        kind="workshop"
                        id={workshop.id}
                        title={workshop.title}
                      />
                    </>
                  ) : null}
                </div>
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

      {isAdmin ? (
        <div className="flex justify-center">
          <WorkshopCreateModal />
        </div>
      ) : null}
    </div>
  )
}
