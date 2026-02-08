import { getServerSession } from 'next-auth'
import { ItemType } from '@prisma/client'

import ActionButton from '@/components/site/ActionButton'
import DigitalProductAdminModal from '@/components/site/DigitalProductAdminModal'
import PageHero from '@/components/site/PageHero'
import PageSection from '@/components/site/PageSection'
import { getItemsByTypes } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { authOptions } from '@/lib/auth/authOptions'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export default async function EbooksPage() {
  const items = await getItemsByTypes([ItemType.EBOOK, ItemType.VIDEO])
  const phone = getWhatsAppPhone()
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="flex flex-col gap-10 pb-12 text-zinc-900">
      <PageHero
        imageUrl={IMAGES.PRODUTOS_DIGITAIS_HERO_1}
        title={TEXTS.PRODUTOS_DIGITAIS_HERO_TITLE_1}
        eyebrow={TEXTS.PRODUTOS_DIGITAIS_HERO_EYEBROW_1}
      />

      <PageSection
        title={TEXTS.PRODUTOS_DIGITAIS_SECTION_TITLE_1}
        paragraphs={[TEXTS.PRODUTOS_DIGITAIS_SECTION_P1_1, TEXTS.PRODUTOS_DIGITAIS_SECTION_P2_1]}
        fontTone="light"
      />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
        {items.map((item) => {
          const isVideo = item.type === ItemType.VIDEO
          const badge = isVideo
            ? TEXTS.PRODUTOS_DIGITAIS_BADGE_VIDEO_1
            : TEXTS.PRODUTOS_DIGITAIS_BADGE_EBOOK_1
          const message = TEXTS.PRODUTOS_DIGITAIS_WHATSAPP_MESSAGE_1.replace(
            '{title}',
            item.title,
          )
          const fallbackUrl = phone ? buildWhatsAppUrl(phone, message) : ''
          const targetUrl = item.hotmartUrl || fallbackUrl

          return (
            <div key={item.id} className="relative flex flex-col gap-4 rounded-3xl border bg-stone-950 p-6">
              <span className="w-fit rounded-full bg-[#FDFDFD] border px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-600">
                {badge}
              </span>
              <h2 className="text-lg font-semibold text-zinc-400">{item.title}</h2>
              <p className="text-sm text-muted-foreground text-zinc-300">
                {item.description || TEXTS.PRODUTOS_DIGITAIS_DESCRIPTION_1}
              </p>
              {targetUrl ? (
                <ActionButton href={targetUrl} target="_blank" tone="light" size="sm">
                  {TEXTS.PRODUTOS_DIGITAIS_CARD_BUTTON_1}
                </ActionButton>
              ) : (
                <span className="rounded-full border px-4 py-2 text-center text-sm text-muted-foreground">
                  {TEXTS.PRODUTOS_DIGITAIS_LINK_MISSING_1}
                </span>
              )}
            </div>
          )
        })}
      </section>

      {isAdmin ? (
        <div className="flex justify-center px-4">
          <DigitalProductAdminModal />
        </div>
      ) : null}
    </div>
  )
}
