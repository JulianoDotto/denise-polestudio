'use client'

import type { ItemType } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useCartStore } from './cart-store'

export type AddToCartItem = {
  id: string
  title: string
  priceCents?: number | null
  type: ItemType
  sectionTitle?: string | null
}

export default function AddToCartButton({
  item,
  label = 'COMPRAR',
}: {
  item: AddToCartItem
  label?: string
}) {
  const { add, openCart } = useCartStore()

  const handleClick = () => {
    add(item, 1)
    openCart()
  }

  return (
    <Button className="w-full" onClick={handleClick}>
      {label}
    </Button>
  )
}
