import { getServerSession } from 'next-auth'
import { ItemType } from '@prisma/client'

import ActionButton from '@/components/site/ActionButton'
import AulasAdminModal from '@/components/site/AulasAdminModal'
import AulasDeleteButton from '@/components/site/AulasDeleteButton'
import AulasEditModal from '@/components/site/AulasEditModal'
import { getItemsByType } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { authOptions } from '@/lib/auth/authOptions'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export default async function AulasPage() {
  const aulas = await getItemsByType(ItemType.CLASS)
  const phone = getWhatsAppPhone()
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="pb-12">
      <h1 className="px-6 text-3xl text-center my-8">{TEXTS.AULAS_PAGE_TITLE_1}</h1>
      <div className="flex flex-col gap-10">
        {aulas.map((aula) => {
          const message = aula.whatsappTextTemplate
            ? aula.whatsappTextTemplate
            : TEXTS.AULAS_WHATSAPP_REQUEST_1.replace('{title}', aula.title)
          const contactUrl = phone ? buildWhatsAppUrl(phone, message) : ''

          return (
            <section key={aula.id} className="w-full">
              <div className="relative h-64 w-full overflow-hidden bg-black sm:h-80">
                <img
                  src={aula.coverUrl || IMAGES.AULAS_COVER_FALLBACK_1}
                  alt={aula.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/35" />
              </div>
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-semibold">{aula.title}</h2>
                  {isAdmin ? (
                    <div className="flex items-center gap-2">
                      <AulasEditModal
                        id={aula.id}
                        title={aula.title}
                        description={aula.description}
                        coverUrl={aula.coverUrl}
                      />
                      <AulasDeleteButton id={aula.id} title={aula.title} />
                    </div>
                  ) : null}
                </div>
                <p className="text-base text-muted-foreground text-white">
                  {aula.description || TEXTS.AULAS_DEFAULT_DESC_1}
                </p>
                {contactUrl && (
                  <ActionButton href={contactUrl} tone="light" target="_blank" size="lg">
                    {TEXTS.AULAS_CARD_BUTTON_1}
                  </ActionButton>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {isAdmin ? (
        <div className="flex justify-center px-6">
          <AulasAdminModal />
        </div>
      ) : null}
    </div>
  )
}
