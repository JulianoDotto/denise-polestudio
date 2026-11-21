import type { ItemType } from '@prisma/client'

import { prisma } from '@/lib/prisma'

// New entries go to the end so they never disturb an order the admin arranged.
export async function nextItemOrder(types: ItemType[]) {
  const result = await prisma.item.aggregate({
    where: { type: { in: types } },
    _max: { order: true },
  })
  return (result._max.order ?? -1) + 1
}

export async function nextStoreSectionOrder() {
  const result = await prisma.storeSection.aggregate({ _max: { order: true } })
  return (result._max.order ?? -1) + 1
}
