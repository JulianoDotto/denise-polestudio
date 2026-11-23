import type { Metadata } from 'next'
import { ItemType } from '@prisma/client'
import { getServerSession } from 'next-auth'

import ActionButton from '@/components/site/ActionButton'
import ContentDeleteButton from '@/components/admin/ContentDeleteButton'
import ContentFormModal from '@/components/admin/ContentFormModal'
import WorkshopCreateModal from '@/components/admin/WorkshopCreateModal'
import GlowCard from '@/components/site/GlowCard'
import PageHero from '@/components/site/PageHero'
import PageIntro from '@/components/site/PageIntro'
import { authOptions } from '@/lib/auth/authOptions'
import { getItemsByType } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { TEXTS } from '@/hardcoded/texts'

export const metadata: Metadata = {
  title: TEXTS.META_WORKSHOPS_TITLE_1,
  description: TEXTS.META_WORKSHOPS_DESCRIPTION_1,
  alternates: { canonical: '/workshops' },
}

export default async function WorkshopsPage() {
  const phone = getWhatsAppPhone()
  const workshops = await getItemsByType(ItemType.WORKSHOP)
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="flex flex-col gap-3 pb-3">
      <PageHero
        title={TEXTS.WORKSHOPS_PAGE_TITLE_1}
        eyebrow={TEXTS.WORKSHOPS_HERO_EYEBROW_1} index={5} total={5} />
      <div className="mx-3 rounded-[28px] bg-areia text-zinc-900 flex flex-col gap-10 pb-12 pt-10">

      <PageIntro
        eyebrow={TEXTS.WORKSHOPS_SECTION_TITLE_1}
        headline={TEXTS.WORKSHOPS_INTRO_HEADLINE_1}
        paragraphs={[TEXTS.WORKSHOPS_PAGE_DESCRIPTION_1]}
      />

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 sm:grid-cols-2">
        {workshops.map((workshop, index) => {
          const message =
            workshop.whatsappTextTemplate ||
            TEXTS.WORKSHOPS_WHATSAPP_TEMPLATE_1.replace('{title}', workshop.title)
          const url = phone ? buildWhatsAppUrl(phone, message) : ''

          return (
            <GlowCard
              key={workshop.id}
              index={index}
              eyebrow={TEXTS.WORKSHOPS_BADGE_1}
              title={workshop.title}
              description={workshop.description ?? ''}
              media={
                workshop.coverUrl ? (
                  <img
                    src={workshop.coverUrl}
                    alt={workshop.title}
                    loading={index < 2 ? undefined : 'lazy'}
                    decoding="async"
                    className="h-48 w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : undefined
              }
              adminControls={
                isAdmin ? (
                  <>
                    <ContentFormModal
                      kind="workshop"
                      mode="edit"
                      values={{
                        id: workshop.id,
                        title: workshop.title,
                        description: workshop.description,
                      }}
                      tone="light"
                    />
                    <ContentDeleteButton
                      kind="workshop"
                      id={workshop.id}
                      title={workshop.title}
                      tone="light"
                    />
                  </>
                ) : undefined
              }
              action={
                url ? (
                  <ActionButton
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tone="light"
                    size="md"
                    className="w-full"
                  >
                    {TEXTS.WORKSHOPS_BUTTON_1}
                  </ActionButton>
                ) : (
                  <ActionButton disabled tone="light" size="md" className="w-full">
                    {TEXTS.WORKSHOPS_BUTTON_1}
                  </ActionButton>
                )
              }
            />
          )
        })}
      </section>

      {isAdmin ? (
        <div className="flex justify-center px-4">
          <WorkshopCreateModal />
        </div>
      ) : null}
      </div>
    </div>
  )
}
