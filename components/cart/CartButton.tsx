'use client'

import { ShoppingBag } from 'lucide-react'

import { useCartStore } from './cart-store'
import { Button } from '@/components/ui/button'

export default function CartButton() {
  const { items, openCart } = useCartStore()
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Button variant="outline" size="sm" onClick={openCart}>
      <ShoppingBag />
      <span className="text-xs font-semibold">{count}</span>
    </Button>
  )
}
