'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { normalizeExternalUrl } from '@/lib/externalUrl'
import { createItemWithUniqueSlug } from '@/lib/admin/create-item'
import { parseCheckbox } from '@/lib/admin/form-values'
import { parseDigitalProductUpdate } from '@/lib/admin/item-updates'
import { nextItemOrder } from '@/lib/admin/next-order'
import { slugify } from '@/lib/admin/slug'

export async function createDigitalProductInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const hotmartUrl =
    normalizeExternalUrl(String(formData.get('hotmartUrl') || '')) || null
  const slug = slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const type = String(formData.get('type') || '').trim()

  if (!title) {
    return { success: false, error: 'title' }
  }
  if (type !== 'EBOOK' && type !== 'VIDEO') {
    return { success: false, error: 'type' }
  }

  await createItemWithUniqueSlug(
    {
      title,
      description,
      hotmartUrl,
      isActive,
      type,
      order: await nextItemOrder(['EBOOK', 'VIDEO']),
    },
    slug,
  )

  revalidatePath('/produtos-digitais')
  return { success: true }
}

export async function updateDigitalProductInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

  const result = parseDigitalProductUpdate(formData)
  if ('error' in result) return { success: false, error: result.error }

  await prisma.item.update({ where: { id }, data: result.data })

  revalidatePath('/produtos-digitais')
  return { success: true }
}

export async function deleteDigitalProductInline(
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

  revalidatePath('/produtos-digitais')
  return { success: true }
}
