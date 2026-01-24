import { notFound } from 'next/navigation'

import { getItemsBySection, getStoreSectionBySlug } from '@/lib/db'
import AdultGate from '@/components/site/AdultGate'
import { formatPrice } from '@/lib/format'
import Link from 'next/link'

export default async function LojaSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const section = await getStoreSectionBySlug(slug)
  if (!section) return notFound()

  const items = await getItemsBySection(slug)

  const content = (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-4">
        <img
          src={section.bannerUrl || '/images/placeholder.svg'}
          alt={section.title}
          className="h-48 w-full rounded-3xl object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{section.title}</h1>
          {section.isAdult ? (
            <p className="text-xs text-muted-foreground">Conteúdo +18</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/produtos/${item.slug}`}
            className="flex flex-col gap-4 rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
          >
            <img
              src={item.coverUrl || '/images/placeholder.svg'}
              alt={item.title}
              className="h-40 w-full rounded-2xl object-cover"
            />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">{item.title}</h2>
                {item.priceCents !== null && item.priceCents !== undefined ? (
                  <p className="text-xs text-muted-foreground">{formatPrice(item.priceCents)}</p>
                ) : null}
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ver</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  if (section.isAdult) {
    return <AdultGate redirectHref="/lojas/pole-dance">{content}</AdultGate>
  }

  return content
}
