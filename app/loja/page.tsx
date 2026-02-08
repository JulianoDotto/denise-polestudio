import { getServerSession } from 'next-auth'

import AgeGateModal from '@/components/site/AgeGateModal'
import AdminModal from '@/components/site/AdminModal'
import ActionButton from '@/components/site/ActionButton'
import PageHero from '@/components/site/PageHero'
import PageSection from '@/components/site/PageSection'
import StorePostImageField from '@/components/site/StorePostImageField'
import StorePostDurationFields from '@/components/site/StorePostDurationFields'
import StoreCarousel from '@/components/site/StoreCarousel'
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
    ? buildWhatsAppUrl(phone, 'Olá, quero saber mais sobre os produtos da Denise.')
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
    imageUrl: post.imageUrl || '/images/placeholder.svg',
  }))
  const heroImage = '/images/placeholder.svg'

  return (
    <div className="flex flex-col gap-10 pb-12 text-zinc-900 bg-[#FDFDFD]">
      <AgeGateModal />

      <PageHero imageUrl={heroImage} title="Loja" eyebrow="Coleção" />

      <PageSection
        title="Sobre a loja"
        paragraphs={[
          'Produtos selecionados pela Denise, focados em bem-estar, sensualidade e autocuidado. Tudo pensado para complementar sua jornada nas aulas e experiências.',
          'Se precisar de ajuda para escolher, fale direto pelo WhatsApp e receba recomendações personalizadas.',
        ]}
      >
        {contactUrl && (
          <ActionButton
            href={contactUrl}
            target="_blank"
            size="lg"
            className="w-full max-w-md uppercase tracking-[0.2em] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 text-center"
          >
            Comprar pelo WhatsApp
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
              title="Publicar no feed"
              description="Use a publicação fixa para manter o post sem prazo."
              error={resolvedSearchParams?.error}
              success={Boolean(resolvedSearchParams?.success)}
              initialOpen={Boolean(
                resolvedSearchParams?.error || resolvedSearchParams?.success,
              )}
              errorMessages={{
                title: 'Informe um título para a publicação.',
                expiresAt: 'Defina uma data de duração ou marque como publicação fixa.',
              }}
              successMessage="Publicação criada com sucesso."
              trigger={
                <ActionButton
                  type="button"
                  size="lg"
                  className="w-full max-w-md uppercase tracking-[0.2em] shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
                >
                  + Adicionar
                </ActionButton>
              }
            >
              <form action={createStorePost} className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Título
                  </span>
                  <input
                    name="title"
                    className="w-full rounded-2xl border px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
                    placeholder="Título da publicação"
                  />
                </label>
                <StorePostImageField />
                <StorePostDurationFields />
                <ActionButton type="submit" size="sm" className="self-start">
                  Publicar
                </ActionButton>
              </form>
            </AdminModal>
          </div>
        ) : null}
      </section>

    </div>
  )
}
