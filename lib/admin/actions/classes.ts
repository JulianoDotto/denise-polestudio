'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { validateClassCoverUrl } from '@/lib/admin/class-cover'
import { createItemWithUniqueSlug } from '@/lib/admin/create-item'
import { parseCheckbox } from '@/lib/admin/form-values'
import { parseClassUpdate } from '@/lib/admin/item-updates'
import { slugify } from '@/lib/admin/slug'

export async function createClassInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const hotmartUrl = String(formData.get('hotmartUrl') || '').trim() || null
  const scheduleOnlineUrl =
    String(formData.get('scheduleOnlineUrl') || '').trim() || null
  const schedulePresentialUrl =
    String(formData.get('schedulePresentialUrl') || '').trim() || null
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  if (!title) {
    return { success: false, error: 'title' }
  }

  await createItemWithUniqueSlug(
    {
      title,
      description,
      coverUrl,
      isActive,
      hotmartUrl,
      scheduleOnlineUrl,
      schedulePresentialUrl,
      whatsappTextTemplate,
      type: 'CLASS',
    },
    slug,
  )

  revalidatePath('/aulas')
  return { success: true }
}

export async function updateClassInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

  const result = parseClassUpdate(formData)
  if ('error' in result) return { success: false, error: result.error }

  const coverError = validateClassCoverUrl(result.data.coverUrl)
  if (coverError) return { success: false, error: coverError }

  try {
    await prisma.item.update({ where: { id }, data: result.data })
  } catch (error) {
    console.error('Failed to update class', error)
    return { success: false, error: 'persistence' }
  }

  revalidatePath('/aulas')
  return { success: true }
}

export async function deleteClassInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

  await prisma.item.delete({ where: { id } })

  revalidatePath('/aulas')
  return { success: true }
}
