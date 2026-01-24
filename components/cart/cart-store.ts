'use client'

import type { ItemType } from '@prisma/client'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  title: string
  priceCents?: number | null
  quantity: number
  type: ItemType
  sectionTitle?: string | null
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  inc: (id: string) => void
  dec: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      add: (item, qty = 1) => {
        const items = [...get().items]
        const existing = items.find((entry) => entry.id === item.id)
        if (existing) {
          existing.quantity += qty
        } else {
          items.push({ ...item, quantity: qty })
        }
        set({ items })
      },
      inc: (id) => {
        const items = get().items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
        set({ items })
      },
      dec: (id) => {
        const items = get().items
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
        set({ items })
      },
      remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'denise-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
