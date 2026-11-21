import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'

import AgeGateModal from '@/components/site/AgeGateModal'
import AdminModal from '@/components/admin/AdminModal'
import ActionButton from '@/components/site/ActionButton'
import PageHero from '@/components/site/PageHero'
import PageIntro from '@/components/site/PageIntro'
import ImageUploadField from '@/components/admin/ImageUploadField'
import StorePostSubmitButton from '@/components/admin/StorePostSubmitButton'
import StorePostDurationFields from '@/components/admin/StorePostDurationFields'
import StoreProductRow from '@/components/site/StoreProductRow'
import FeedCategoryField from '@/components/admin/FeedCategoryField'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'
import { createStorePost } from '@/lib/admin/actions/store-posts'
import { authOptions } from '@/lib/auth/authOptions'
import { prisma } from '@/lib/prisma'
import { buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { groupFeedPostsByCategory } from '@/lib/feed-groups'

export const metadata: Metadata = {
  title: TEXTS.META_LOJA_TITLE_1,
  description: TEXTS.META_LOJA_DESCRIPTION_1,
}

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
    include: {
      storeSection: {
        select: { id: true, title: true, order: true },
      },
    },
  })
  let categories: { id: string; title: string }[] = []
  let categoriesError = false
  if (isAdmin) {
    try {
      categories = await prisma.storeSection.findMany({
        orderBy: { title: 'asc' },
        select: { id: true, title: true },
      })
    } catch {
      categoriesError = true
    }
  }
  const feedGroups = groupFeedPostsByCategory(posts, IMAGES.SITE_FALLBACK_1)

  return (
    <div className="flex flex-col gap-10 pb-12 text-zinc-900 bg-areia">
      <AgeGateModal />

      <PageHero
        title={TEXTS.LOJA_HERO_TITLE_1}
        eyebrow={TEXTS.LOJA_HERO_EYEBROW_1}
      />

      <PageIntro
        eyebrow={TEXTS.LOJA_SECTION_TITLE_1}
        headline={TEXTS.LOJA_INTRO_HEADLINE_1}
        paragraphs={[TEXTS.LOJA_SECTION_P1_1]}
      >
        <ul className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-vinho/80">
          {TEXTS.LOJA_PAYMENT_FACTS_1.split('|').map((fact) => (
            <li key={fact} className="rounded-full border border-vinho/20 px-3 py-1.5">
              {fact}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-zinc-600">{TEXTS.LOJA_INTRO_HELP_1}</p>
        {contactUrl ? (
          <ActionButton href={contactUrl} target="_blank" size="md" className="mt-4">
            {TEXTS.LOJA_WHATSAPP_BUTTON_1}
          </ActionButton>
        ) : null}
      </PageIntro>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pt-4">
        {feedGroups.map((group) => (
          <StoreProductRow
            key={group.id}
            title={group.title}
            items={group.items}
            whatsappPhone={phone}
            isAdmin={isAdmin}
          />
        ))}
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
                price: TEXTS.LOJA_ADMIN_ERROR_PRICE_1,
                categoryName: 'Informe um nome válido para a nova categoria.',
                categoryDuplicate: 'Já existe uma categoria com esse nome.',
                category: 'A categoria selecionada não está mais disponível.',
                categoryLoad: 'Não foi possível carregar as categorias existentes.',
                imageType: TEXTS.AULAS_ADMIN_ERROR_IMAGE_TYPE_1,
                imageSize: TEXTS.AULAS_ADMIN_ERROR_IMAGE_SIZE_1,
                imageUpload: TEXTS.ADMIN_ERROR_IMAGE_UPLOAD_1,
                persistence: 'Não foi possível publicar no feed. Tente novamente.',
              }}
              successMessage={TEXTS.LOJA_ADMIN_SUCCESS_1}
              trigger={
                <ActionButton
                  type="button"
                  size="lg"
                  className="w-full max-w-md"
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
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    {TEXTS.LOJA_ADMIN_LABEL_DESCRIPTION_1}
                  </span>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
                    placeholder={TEXTS.LOJA_ADMIN_PLACEHOLDER_DESCRIPTION_1}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    {TEXTS.LOJA_ADMIN_LABEL_PRICE_1}
                  </span>
                  <input
                    name="price"
                    inputMode="decimal"
                    className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-300"
                    placeholder={TEXTS.LOJA_ADMIN_PLACEHOLDER_PRICE_1}
                  />
                </label>
                <FeedCategoryField categories={categories} />
                {categoriesError ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                    Não foi possível carregar as categorias existentes.
                  </p>
                ) : null}
                <ImageUploadField
                  name="imageFile"
                  label={TEXTS.STORE_IMAGE_FIELD_LABEL_1}
                  previewLabel={TEXTS.STORE_IMAGE_FIELD_PREVIEW_LABEL_1}
                  emptyLabel={TEXTS.STORE_IMAGE_FIELD_EMPTY_1}
                  previewAlt={TEXTS.STORE_IMAGE_FIELD_PREVIEW_ALT_1}
                  fallbackUrl={IMAGES.SITE_FALLBACK_1}
                />
                <StorePostDurationFields />
                <StorePostSubmitButton />
              </form>
            </AdminModal>
          </div>
        ) : null}
      </section>

    </div>
  )
}
