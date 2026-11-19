import { getServerSession } from 'next-auth'
import { ItemType } from '@prisma/client'

import ActionButton from '@/components/site/ActionButton'
import ContentDeleteButton from '@/components/admin/ContentDeleteButton'
import ContentFormModal from '@/components/admin/ContentFormModal'
import PageHero from '@/components/site/PageHero'
import PageSection from '@/components/site/PageSection'
import { getItemsByTypes } from '@/lib/db'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { authOptions } from '@/lib/auth/authOptions'
import { normalizeExternalUrl } from '@/lib/externalUrl'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export default async function EbooksPage() {
  const items = await getItemsByTypes([ItemType.EBOOK, ItemType.VIDEO])
  const phone = getWhatsAppPhone()
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="flex flex-col gap-10 pb-12 text-zinc-900 bg-areia">
      <PageHero
        imageUrl={IMAGES.PRODUTOS_DIGITAIS_HERO_1}
        title={TEXTS.PRODUTOS_DIGITAIS_HERO_TITLE_1}
        eyebrow={TEXTS.PRODUTOS_DIGITAIS_HERO_EYEBROW_1}
      />

      <PageSection
        title={TEXTS.PRODUTOS_DIGITAIS_SECTION_TITLE_1}
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
            <article
              key={item.id}
              className="group relative isolate flex flex-col overflow-hidden rounded-[28px] bg-tinta p-7 text-marfim shadow-[0_24px_48px_-28px_rgba(90,26,42,0.6)] ring-1 ring-marfim/10 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_32px_64px_-28px_rgba(90,26,42,0.8)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-28 -top-28 -z-10 h-80 w-80 rounded-full bg-vinho opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-72 w-72 rounded-full bg-vinho/40 blur-3xl"
              />
              {isAdmin ? null : (
                <span
                  aria-hidden="true"
                  className="absolute right-7 top-5 font-display text-5xl leading-none text-marfim/10"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              {isAdmin ? (
                <div className="absolute right-4 top-4 flex items-center gap-2">
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
                </div>
              ) : null}
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-marfim/70">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#d4919f]" />
                {badge}
              </p>
              <h2 className="mt-5 font-display text-2xl uppercase leading-tight tracking-[0.12em] text-marfim">
                {item.title}
              </h2>
              <div
                aria-hidden="true"
                className="mt-5 h-px w-12 bg-marfim/30 transition-all duration-500 group-hover:w-20 motion-reduce:transition-none"
              />
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-marfim/75">
                {item.description || TEXTS.PRODUTOS_DIGITAIS_DESCRIPTION_1}
              </p>
              {targetUrl ? (
                <ActionButton
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  tone="light"
                  size="md"
                  className="mt-7 w-full"
                >
                  {TEXTS.PRODUTOS_DIGITAIS_CARD_BUTTON_1}
                </ActionButton>
              ) : (
                <span className="mt-7 rounded-full border border-marfim/20 px-4 py-3 text-center text-sm text-marfim/60">
                  {TEXTS.PRODUTOS_DIGITAIS_LINK_MISSING_1}
                </span>
              )}
            </article>
          )
        })}
      </section>

      {isAdmin ? (
        <div className="flex justify-center px-4">
          <ContentFormModal kind="digitalProduct" mode="create" />
        </div>
      ) : null}
    </div>
  )
}
