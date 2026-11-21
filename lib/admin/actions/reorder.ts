'use server'

import { ItemType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/lib/auth/requireAdmin'
import { moveVisible, parseMoveDirection } from '@/lib/admin/reorder'
import { ITEM_ORDER_BY } from '@/lib/db'
import { activeFeedPostWhere, compareStoreSections } from '@/lib/feed-groups'
import { prisma } from '@/lib/prisma'

export type ReorderState = { error?: string }

const ITEM_LISTS = {
  class: { types: [ItemType.CLASS], path: '/aulas' },
  digitalProduct: { types: [ItemType.EBOOK, ItemType.VIDEO], path: '/produtos-digitais' },
} as const

export async function moveItem(
  _prevState: ReorderState,
  formData: FormData,
): Promise<ReorderState> {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  const direction = parseMoveDirection(formData.get('direction'))
  const listKey = String(formData.get('list') || '')
  if (!direction || !(listKey in ITEM_LISTS)) return { error: 'move' }
  const list = ITEM_LISTS[listKey as keyof typeof ITEM_LISTS]

  try {
    const items = await prisma.item.findMany({
      where: { type: { in: [...list.types] } },
      orderBy: [...ITEM_ORDER_BY],
      select: { id: true, isActive: true },
    })
    const next = moveVisible(
      items.map((item) => item.id),
      items.filter((item) => item.isActive).map((item) => item.id),
      id,
      direction,
    )
    if (!next) return { error: 'move' }

    await prisma.$transaction(
      next.map((itemId, order) =>
        prisma.item.update({ where: { id: itemId }, data: { order } }),
      ),
    )
  } catch (error) {
    console.error('Failed to reorder items', error)
    return { error: 'persistence' }
  }

  revalidatePath(list.path)
  return {}
}

export async function moveStoreSection(
  _prevState: ReorderState,
  formData: FormData,
): Promise<ReorderState> {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  const direction = parseMoveDirection(formData.get('direction'))
  if (!direction) return { error: 'move' }

  try {
    const [sections, posts] = await Promise.all([
      prisma.storeSection.findMany({ select: { id: true, title: true, order: true } }),
      prisma.storePost.findMany({
        where: { ...activeFeedPostWhere(new Date()), storeSectionId: { not: null } },
        select: { storeSectionId: true },
      }),
    ])
    const shown = new Set(posts.map((post) => post.storeSectionId))
    const sorted = [...sections].sort(compareStoreSections)
    const next = moveVisible(
      sorted.map((section) => section.id),
      sorted.filter((section) => shown.has(section.id)).map((section) => section.id),
      id,
      direction,
    )
    if (!next) return { error: 'move' }

    await prisma.$transaction(
      next.map((sectionId, order) =>
        prisma.storeSection.update({ where: { id: sectionId }, data: { order } }),
      ),
    )
  } catch (error) {
    console.error('Failed to reorder store sections', error)
    return { error: 'persistence' }
  }

  revalidatePath('/loja')
  return {}
}
