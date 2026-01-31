import Link from 'next/link'
import { getServerSession } from 'next-auth'

import AgeGateModal from '@/components/site/AgeGateModal'
import StorePostFormShell from '@/components/site/StorePostFormShell'
import StorePostImageField from '@/components/site/StorePostImageField'
import StorePostDurationFields from '@/components/site/StorePostDurationFields'
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

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <AgeGateModal />
      <h1 className="text-2xl font-semibold">Loja</h1>

      {isAdmin ? (
        <StorePostFormShell>
          {searchParams?.error === 'title' ? (
            <p className="text-sm text-red-500">Informe um título para a publicação.</p>
          ) : null}
          {searchParams?.error === 'expiresAt' ? (
            <p className="text-sm text-red-500">
              Defina uma data de duração ou marque como publicação fixa.
            </p>
          ) : null}
          {searchParams?.success ? (
            <p className="text-sm text-emerald-600">Publicação criada com sucesso.</p>
          ) : null}
          <form action={createStorePost} className="grid gap-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Título
              </span>
              <input
                name="title"
                className="w-full rounded-2xl border px-4 py-2 text-sm"
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
        </StorePostFormShell>
      ) : null}

      <div className="flex flex-col gap-6 rounded-3xl border bg-white p-6">
        <img
          src="/images/placeholder.svg"
          alt="Produtos Denise Garcia"
          className="h-48 w-full rounded-3xl object-cover"
        />
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Produtos selecionados pela Denise, focados em bem-estar, sensualidade e
            autocuidado. Tudo pensado para complementar sua jornada nas aulas e experiências.
          </p>
          {contactUrl ? (
            <Link
              href={contactUrl}
              target="_blank"
              className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              COMPRAR PELO WHATSAPP
            </Link>
          ) : (
            <span className="rounded-full border px-4 py-2 text-center text-sm text-muted-foreground">
              Configure o WhatsApp para contato
            </span>
          )}
        </div>
      </div>

      {posts.length > 0 ? (
        <section className="grid gap-4 rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Novidades</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Feed
            </span>
          </div>
          <div className="grid gap-4">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col gap-3 rounded-2xl border p-4">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                ) : null}
                <h3 className="text-sm font-semibold">{post.title}</h3>
                {post.isPinned ? (
                  <span className="text-xs text-muted-foreground">Publicação fixa</span>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

    </div>
  )
}
