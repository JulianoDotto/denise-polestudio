import { ItemType } from '@prisma/client'
import { prisma } from './prisma'

export async function getItemsByType(type: ItemType) {
  return prisma.item.findMany({
    where: { type, isActive: true },
    orderBy: { order: 'asc' },
  })
}

export async function getItemsByTypes(types: ItemType[]) {
  return prisma.item.findMany({
    where: { type: { in: types }, isActive: true },
    orderBy: { order: 'asc' },
  })
}
