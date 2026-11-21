import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { ItemType } from '@prisma/client'

import ActionButton from '@/components/site/ActionButton'
import GlowCard from '@/components/site/GlowCard'
import ContentDeleteButton from '@/components/admin/ContentDeleteButton'
import ContentFormModal from '@/components/admin/ContentFormModal'
import PageHero from '@/components/site/PageHero'
import PageIntro from '@/components/site/PageIntro'
import { getItemsByTypes } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { authOptions } from '@/lib/auth/authOptions'
import { normalizeExternalUrl } from '@/lib/externalUrl'
import { TEXTS } from '@/hardcoded/texts'

export const metadata: Metadata = {
  title: TEXTS.META_PRODUTOS_DIGITAIS_TITLE_1,
  description: TEXTS.META_PRODUTOS_DIGITAIS_DESCRIPTION_1,
}

export default async function EbooksPage() {
  const items = await getItemsByTypes([ItemType.EBOOK, ItemType.VIDEO])
  const phone = getWhatsAppPhone()
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="flex flex-col gap-3 pb-3">
      <PageHero
        title={TEXTS.PRODUTOS_DIGITAIS_HERO_TITLE_1}
        eyebrow={TEXTS.PRODUTOS_DIGITAIS_HERO_EYEBROW_1} index={3} total={5} />
      <div className="mx-3 rounded-[28px] bg-areia text-zinc-900 flex flex-col gap-10 pb-12 pt-10">

      <PageIntro
        eyebrow={TEXTS.PRODUTOS_DIGITAIS_SECTION_TITLE_1}
        headline={TEXTS.PRODUTOS_DIGITAIS_INTRO_HEADLINE_1}
        paragraphs={[TEXTS.PRODUTOS_DIGITAIS_SECTION_P1_1, TEXTS.PRODUTOS_DIGITAIS_SECTION_P2_1]}
      />

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 sm:grid-cols-2">
        {items.map((item, index) => {
          const isVideo = item.type === ItemType.VIDEO
          const badge = isVideo
            ? TEXTS.PRODUTOS_DIGITAIS_BADGE_VIDEO_1
            : TEXTS.PRODUTOS_DIGITAIS_BADGE_EBOOK_1
          const message = TEXTS.PRODUTOS_DIGITAIS_WHATSAPP_MESSAGE_1.replace(
            '{title}',
            item.title,
          )
          const fallbackUrl = phone ? buildWhatsAppUrl(phone, message) : ''
          const targetUrl = item.hotmartUrl
            ? normalizeExternalUrl(item.hotmartUrl)
            : fallbackUrl

          return (
            <GlowCard
              key={item.id}
              index={index}
              eyebrow={badge}
              title={item.title}
              description={item.description || TEXTS.PRODUTOS_DIGITAIS_DESCRIPTION_1}
              adminControls={
                isAdmin ? (
                  <>
                    <ContentFormModal
                      kind="digitalProduct"
                      mode="edit"
                      values={{
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        hotmartUrl: item.hotmartUrl,
                        type: item.type as 'EBOOK' | 'VIDEO',
                      }}
                      tone="light"
                    />
                    <ContentDeleteButton
                      kind="digitalProduct"
                      id={item.id}
                      title={item.title}
                      tone="light"
                    />
                  </>
                ) : undefined
              }
              action={
                targetUrl ? (
                  <ActionButton
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    tone="light"
                    size="md"
                    className="w-full"
                  >
                    {TEXTS.PRODUTOS_DIGITAIS_CARD_BUTTON_1}
                  </ActionButton>
                ) : (
                  <span className="block rounded-full border border-marfim/20 px-4 py-3 text-center text-sm text-marfim/60">
                    {TEXTS.PRODUTOS_DIGITAIS_LINK_MISSING_1}
                  </span>
                )
              }
            />
          )
        })}
      </section>

      {isAdmin ? (
        <div className="flex justify-center px-4">
          <ContentFormModal kind="digitalProduct" mode="create" />
        </div>
      ) : null}
      </div>
    </div>
  )
}
