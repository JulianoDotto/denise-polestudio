import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { ItemType } from '@prisma/client'

import ActionButton from '@/components/site/ActionButton'
import ContentDeleteButton from '@/components/admin/ContentDeleteButton'
import ContentFormModal from '@/components/admin/ContentFormModal'
import ReorderButtons from '@/components/admin/ReorderButtons'
import GlowCard from '@/components/site/GlowCard'
import PageHero from '@/components/site/PageHero'
import PageIntro from '@/components/site/PageIntro'
import { getItemsByType } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { authOptions } from '@/lib/auth/authOptions'
import { TEXTS } from '@/hardcoded/texts'

export const metadata: Metadata = {
  title: TEXTS.META_AULAS_TITLE_1,
  description: TEXTS.META_AULAS_DESCRIPTION_1,
  alternates: { canonical: '/aulas' },
}

export default async function AulasPage() {
  const aulas = await getItemsByType(ItemType.CLASS)
  const phone = getWhatsAppPhone()
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="flex flex-col gap-3 pb-3">
      <PageHero title={TEXTS.AULAS_PAGE_TITLE_1} index={1} total={5} />
      <div className="mx-3 rounded-[28px] bg-areia text-zinc-900 flex flex-col gap-10 pb-12 pt-10">

      <PageIntro
        eyebrow={TEXTS.AULAS_SECTION_TITLE_1}
        headline={TEXTS.AULAS_INTRO_HEADLINE_1}
        paragraphs={[TEXTS.AULAS_DEFAULT_DESC_1]}
      />

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 sm:grid-cols-2">
        {aulas.map((aula, index) => {
          const message = aula.whatsappTextTemplate
            ? aula.whatsappTextTemplate
            : TEXTS.AULAS_WHATSAPP_REQUEST_1.replace('{title}', aula.title)
          const contactUrl = phone ? buildWhatsAppUrl(phone, message) : ''

          return (
            <GlowCard
              key={aula.id}
              index={index}
              eyebrow={TEXTS.AULAS_CARD_EYEBROW_1}
              title={aula.title}
              description={aula.description || TEXTS.AULAS_DEFAULT_DESC_1}
              media={
                aula.coverUrl ? (
                  <img
                    src={aula.coverUrl}
                    alt={aula.title}
                    loading={index < 2 ? undefined : 'lazy'}
                    decoding="async"
                    className="block h-auto w-full transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : undefined
              }
              reorderControls={
                isAdmin ? (
                  <ReorderButtons
                    target={{ kind: 'item', list: 'class' }}
                    id={aula.id}
                    isFirst={index === 0}
                    isLast={index === aulas.length - 1}
                    tone="light"
                  />
                ) : undefined
              }
              adminControls={
                isAdmin ? (
                  <>
                    <ContentFormModal
                      kind="class"
                      mode="edit"
                      values={{
                        id: aula.id,
                        title: aula.title,
                        description: aula.description,
                        coverUrl: aula.coverUrl,
                      }}
                      tone="light"
                    />
                    <ContentDeleteButton kind="class" id={aula.id} title={aula.title} tone="light" />
                  </>
                ) : undefined
              }
              action={
                contactUrl ? (
                  <ActionButton href={contactUrl} tone="light" target="_blank" rel="noopener noreferrer" size="md" className="w-full">
                    {TEXTS.AULAS_CARD_BUTTON_1}
                  </ActionButton>
                ) : null
              }
            />
          )
        })}
      </section>

      {isAdmin ? (
        <div className="flex justify-center px-4">
          <ContentFormModal kind="class" mode="create" />
        </div>
      ) : null}
      </div>
    </div>
  )
}
