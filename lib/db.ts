import { ItemType } from '@prisma/client'
import { prisma } from './prisma'

export async function getStoreSections() {
  return prisma.storeSection.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })
}

export async function getStoreSectionBySlug(slug: string) {
  return prisma.storeSection.findFirst({
    where: { slug, isActive: true },
  })
}

export async function getItemsBySection(slug: string) {
  return prisma.item.findMany({
    where: {
      storeSection: { slug },
      type: ItemType.PRODUCT,
      isActive: true,
    },
    orderBy: { order: 'asc' },
  })
}

export async function getItemsByType(type: ItemType) {
  return prisma.item.findMany({
    where: { type, isActive: true },
    orderBy: { order: 'asc' },
  })
}

export async function getItemBySlug(slug: string) {
  if (!slug) return null
  return prisma.item.findFirst({
    where: { slug, isActive: true },
    include: { images: true, storeSection: true },
  })
}
