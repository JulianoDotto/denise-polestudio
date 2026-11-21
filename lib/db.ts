import { ItemType } from '@prisma/client'
import { prisma } from './prisma'

// Stable order: ties on `order` always break the same way, so the page and the
// reorder action agree on who is next to whom.
export const ITEM_ORDER_BY = [
  { order: 'asc' },
  { createdAt: 'asc' },
  { id: 'asc' },
] as const satisfies { [key: string]: 'asc' | 'desc' }[]

export async function getItemsByType(type: ItemType) {
  return prisma.item.findMany({
    where: { type, isActive: true },
    orderBy: [...ITEM_ORDER_BY],
  })
}

export async function getItemsByTypes(types: ItemType[]) {
  return prisma.item.findMany({
    where: { type: { in: types }, isActive: true },
    orderBy: [...ITEM_ORDER_BY],
  })
}
