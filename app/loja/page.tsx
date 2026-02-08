import { getServerSession } from 'next-auth'

import AgeGateModal from '@/components/site/AgeGateModal'
import AdminModal from '@/components/site/AdminModal'
import ActionButton from '@/components/site/ActionButton'
import PageHero from '@/components/site/PageHero'
import PageSection from '@/components/site/PageSection'
import StorePostImageField from '@/components/site/StorePostImageField'
import StorePostDurationFields from '@/components/site/StorePostDurationFields'
import StoreCarousel from '@/components/site/StoreCarousel'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'
import { createStorePost } from '@/lib/admin/actions'
import { authOptions } from '@/lib/auth/authOptions'
import { prisma } from '@/lib/prisma'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'

type LojaSearchParams = {
  error?: string
  success?: string
}

export default async function LojaPage({
  searchParams,
}: {
  searchParams?: Promise<LojaSearchParams> | LojaSearchParams
}) {
  const resolvedSearchParams = await searchParams
  const phone = getWhatsAppPhone()
  const contactUrl = phone
    ? buildWhatsAppUrl(phone, TEXTS.LOJA_WHATSAPP_MESSAGE_1)
    : ''
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'
  const now = new Date()
  const posts = await prisma.storePost.findMany({
    where: {
      OR: [
        { isPinned: true },
        { expiresAt: { gt: now } },
      ],
    },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' },
    ],
  })
  const carouselItems = posts.map((post) => ({
    id: post.id,
    title: post.title,
    imageUrl: post.imageUrl || IMAGES.SITE_PLACEHOLDER_1,
  }))
  const heroImage = IMAGES.LOJA_HERO_1

  return (
    <div className="flex flex-col gap-10 pb-12 text-zinc-900 bg-[#FDFDFD]">
      <AgeGateModal />

      <PageHero
        imageUrl={heroImage}
        title={TEXTS.LOJA_HERO_TITLE_1}
        eyebrow={TEXTS.LOJA_HERO_EYEBROW_1}
      />

      <PageSection
        title={TEXTS.LOJA_SECTION_TITLE_1}
        paragraphs={[
          TEXTS.LOJA_SECTION_P1_1,
          TEXTS.LOJA_SECTION_P2_1,
        ]}
      >
        {contactUrl && (
          <ActionButton
            href={contactUrl}
            target="_blank"
            size="lg"
            className="w-full max-w-md uppercase tracking-[0.2em] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 text-center"
          >
            {TEXTS.LOJA_WHATSAPP_BUTTON_1}
          </ActionButton>
        )}
      </PageSection>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
        {carouselItems.length > 0 ? (
          <StoreCarousel items={carouselItems} isAdmin={isAdmin} />
        ) : null}
        {isAdmin ? (
          <div className="flex justify-center">
            <AdminModal
              title={TEXTS.LOJA_ADMIN_TITLE_1}
              description={TEXTS.LOJA_ADMIN_DESCRIPTION_1}
              error={resolvedSearchParams?.error}
              success={Boolean(resolvedSearchParams?.success)}
              initialOpen={Boolean(
                resolvedSearchParams?.error || resolvedSearchParams?.success,
              )}
              errorMessages={{
                title: TEXTS.LOJA_ADMIN_ERROR_TITLE_1,
                expiresAt: TEXTS.LOJA_ADMIN_ERROR_EXPIRES_1,
              }}
              successMessage={TEXTS.LOJA_ADMIN_SUCCESS_1}
              trigger={
                <ActionButton
                  type="button"
                  size="lg"
                  className="w-full max-w-md uppercase tracking-[0.2em] shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
                >
                  {TEXTS.LOJA_ADMIN_TRIGGER_1}
                </ActionButton>
              }
            >
              <form action={createStorePost} className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    {TEXTS.LOJA_ADMIN_LABEL_TITLE_1}
                  </span>
                  <input
                    name="title"
                    className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
                    placeholder={TEXTS.LOJA_ADMIN_PLACEHOLDER_TITLE_1}
                  />
                </label>
                <StorePostImageField />
                <StorePostDurationFields />
                <ActionButton type="submit" size="sm" className="self-start">
                  {TEXTS.LOJA_ADMIN_SUBMIT_1}
                </ActionButton>
              </form>
            </AdminModal>
          </div>
        ) : null}
      </section>

    </div>
  )
}
