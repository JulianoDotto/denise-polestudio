import { notFound } from 'next/navigation'

import { ItemType } from '@prisma/client'
import AddToCartButton from '@/components/cart/AddToCartButton'
import { getItemBySlug } from '@/lib/db'
import { formatPrice } from '@/lib/format'

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await getItemBySlug(slug)

  if (!item || item.type !== ItemType.PRODUCT) return notFound()

  const imageUrl = item.images[0]?.url || item.coverUrl || '/images/placeholder.svg'

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-6">
        <img
          src={imageUrl}
          alt={item.images[0]?.alt || item.title}
          className="h-72 w-full rounded-3xl object-cover"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{item.title}</h1>
          {item.priceCents !== null && item.priceCents !== undefined ? (
            <p className="text-sm text-muted-foreground">{formatPrice(item.priceCents)}</p>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {item.description || 'Descrição detalhada do produto.'}
        </p>
        <AddToCartButton
          item={{
            id: item.id,
            title: item.title,
            priceCents: item.priceCents,
            type: ItemType.PRODUCT,
            sectionTitle: item.storeSection?.title || null,
          }}
        />
      </div>
    </div>
  )
}
