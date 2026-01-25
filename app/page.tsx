import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const banners = [
  { label: 'Aulas', href: '/aulas' },
  { label: 'Ebooks', href: '/ebooks' },
  { label: 'Eventos', href: '/eventos' },
]

export default async function Home() {
  noStore()

  const [sections, latestProducts] = await Promise.all([
    prisma.storeSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 4,
      include: { _count: { select: { items: true } } },
    }),
    prisma.item.findMany({
      where: { type: 'PRODUCT', isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Bem-vinda ao Pole Studio</h1>
        <p className="text-sm text-muted-foreground">
          Descubra aulas, coleções e experiências pensadas para você.
        </p>
        <div className="flex flex-col gap-3">
          {banners.map((banner) => (
            <Link
              key={banner.label}
              href={banner.href}
              className="flex items-center justify-between rounded-3xl border bg-white px-6 py-5 text-sm font-semibold uppercase tracking-[0.2em] shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
            >
              {banner.label}
              <span className="text-xs text-muted-foreground">Ver</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold">Categorias em destaque</h2>
          <p className="text-sm text-muted-foreground">
            Explore nossas principais categorias.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/lojas/${section.slug}`}
              className="flex items-center justify-between rounded-3xl border bg-white px-5 py-4 text-sm font-semibold"
            >
              <div>
                <p className="uppercase tracking-[0.2em]">{section.title}</p>
                <p className="text-xs text-muted-foreground">
                  {section._count.items} produto(s)
                </p>
              </div>
              <span className="text-xs text-muted-foreground">Ver</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Produtos em destaque</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {latestProducts.map((product) => (
            <Link
              key={product.id}
              href={`/produtos/${product.slug}`}
              className="flex flex-col gap-3 rounded-3xl border bg-white p-4"
            >
              <img
                src={product.coverUrl || '/images/placeholder.svg'}
                alt={product.title}
                className="h-32 w-full rounded-2xl object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold">{product.title}</h3>
                <p className="text-xs text-muted-foreground">Uma seleção especial</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border bg-white p-6 md:grid-cols-[1fr_2fr]">
        <img
          src="/images/placeholder.svg"
          alt="Sobre Denise"
          className="h-52 w-full rounded-2xl object-cover"
        />
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Sobre Denise Garcia</h2>
          <p className="text-sm text-muted-foreground">
            Professora e bailarina com foco em empoderamento feminino, expressão corporal
            e bem-estar. O estúdio oferece experiências presenciais e online para todos
            os níveis.
          </p>
        </div>
      </section>

      <section className="grid gap-6">
        <h2 className="text-lg font-semibold">Estúdios</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((studio) => (
            <div key={studio} className="flex flex-col gap-3 rounded-3xl border bg-white p-6">
              <img
                src="/images/placeholder.svg"
                alt={`Estúdio ${studio}`}
                className="h-40 w-full rounded-2xl object-cover"
              />
              <h3 className="text-base font-semibold">Estúdio {studio}</h3>
              <p className="text-sm text-muted-foreground">
                Ambiente pensado para acolher e estimular sua evolução nas artes sensuais.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
