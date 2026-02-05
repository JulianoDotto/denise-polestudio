import Link from 'next/link'
import { getServerSession } from 'next-auth'

import AgeGateModal from '@/components/site/AgeGateModal'
import StorePostAdminModal from '@/components/site/StorePostAdminModal'
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
  searchParams?: LojaSearchParams
}) {
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
    <div className="flex flex-col gap-10 pb-12">
      <AgeGateModal />

      <section className="relative isolate h-[520px] overflow-hidden bg-black sm:h-[640px]">
        <img
          src={heroImage}
          alt="Loja Denise Garcia"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-14">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70">Coleção</p>
          <h1 className="mt-3 font-display text-4xl uppercase tracking-[0.35em] text-white sm:text-5xl">
            Loja
          </h1>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-3xl bg-white p-6 text-zinc-900 shadow-xl shadow-black/10 sm:p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
            Sobre a loja
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-700">
            Produtos selecionados pela Denise, focados em bem-estar, sensualidade e
            autocuidado. Tudo pensado para complementar sua jornada nas aulas e experiências.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-700">
            Se precisar de ajuda para escolher, fale direto pelo WhatsApp e receba
            recomendações personalizadas.
          </p>
          <div className="mt-6 flex justify-center">
            {contactUrl ? (
              <Link
                href={contactUrl}
                target="_blank"
                className="inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
              >
                Comprar pelo WhatsApp
              </Link>
            ) : (
              <span className="inline-flex rounded-full border px-5 py-2 text-sm text-zinc-600">
                Configure o WhatsApp para contato
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
        {carouselItems.length > 0 ? (
          <StoreCarousel items={carouselItems} isAdmin={isAdmin} />
        ) : null}
        {isAdmin ? (
          <div className="flex justify-center">
            <StorePostAdminModal
              error={searchParams?.error}
              success={Boolean(searchParams?.success)}
              initialOpen={Boolean(searchParams?.error || searchParams?.success)}
              trigger={
                <button
                  type="button"
                  className="w-full max-w-md rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
                >
                  Adicionar imagem ao carrossel
                </button>
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
                <button
                  type="submit"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Publicar
                </button>
              </form>
            </StorePostAdminModal>
          </div>
        ) : null}
      </section>

    </div>
  )
}
