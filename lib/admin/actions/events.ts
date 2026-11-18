'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import {
  createItemWithUniqueSlug,
  SlugGenerationError,
} from '@/lib/admin/create-item'
import { parseCheckbox } from '@/lib/admin/form-values'
import { parseDate, parseEventUpdate } from '@/lib/admin/item-updates'
import { slugify } from '@/lib/admin/slug'

export async function createEventInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const slug = slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const eventDate = parseDate(formData.get('eventDate'))

  if (!title) {
    return { success: false, error: 'title' }
  }

  try {
    await createItemWithUniqueSlug(
      {
        title,
        description,
        eventDate,
        isActive,
        type: 'EVENT',
      },
      slug,
    )
  } catch (error) {
    if (error instanceof SlugGenerationError) {
      return { success: false, error: 'slug' }
    }
    throw error
  }

  revalidatePath('/eventos')
  return { success: true }
}

export async function updateEventInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

  const result = parseEventUpdate(formData)
  if ('error' in result) return { success: false, error: result.error }

  await prisma.item.update({ where: { id }, data: result.data })

  revalidatePath('/eventos')
  return { success: true }
}

export async function deleteEventInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

  try {
    await prisma.item.delete({ where: { id } })
  } catch (error) {
    console.error('Failed to delete item', error)
    return { success: false, error: 'delete' }
  }

  revalidatePath('/eventos')
  return { success: true }
}
