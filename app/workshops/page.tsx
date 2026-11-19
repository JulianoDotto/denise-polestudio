import { ItemType } from '@prisma/client'
import { getServerSession } from 'next-auth'

import ActionButton from '@/components/site/ActionButton'
import ContentDeleteButton from '@/components/admin/ContentDeleteButton'
import ContentFormModal from '@/components/admin/ContentFormModal'
import WorkshopCreateModal from '@/components/admin/WorkshopCreateModal'
import GlowCard from '@/components/site/GlowCard'
import PageHero from '@/components/site/PageHero'
import PageSection from '@/components/site/PageSection'
import { authOptions } from '@/lib/auth/authOptions'
import { getItemsByType } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export default async function WorkshopsPage() {
  const phone = getWhatsAppPhone()
  const workshops = await getItemsByType(ItemType.WORKSHOP)
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="flex flex-col gap-10 bg-areia pb-12 text-zinc-900">
      <PageHero
        imageUrl={IMAGES.WORKSHOPS_HERO_1}
        title={TEXTS.WORKSHOPS_PAGE_TITLE_1}
        eyebrow={TEXTS.WORKSHOPS_HERO_EYEBROW_1}
      />

      <PageSection
        title={TEXTS.WORKSHOPS_SECTION_TITLE_1}
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
  )
}
