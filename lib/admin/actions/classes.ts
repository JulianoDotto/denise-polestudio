'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createItemWithUniqueSlug } from '@/lib/admin/create-item'
import { parseCheckbox } from '@/lib/admin/form-values'
import { readImageField } from '@/lib/admin/image-file'
import { ImageUploadError, persistWithImage, removeStoredImage } from '@/lib/admin/image-flow'
import { blobImageStore } from '@/lib/admin/image-store'
import { parseClassUpdate } from '@/lib/admin/item-updates'
import { slugify } from '@/lib/admin/slug'

export async function createClassInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const slug = slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))

  if (!title) {
    return { success: false, error: 'title' }
  }

  const upload = await readImageField(formData, 'coverFile')
  if ('error' in upload) return { success: false, error: upload.error }

  try {
    await persistWithImage(blobImageStore, {
      folder: 'aulas',
      image: upload.image,
      persist: (newUrl) =>
        createItemWithUniqueSlug(
          {
            title,
            description,
            coverUrl: newUrl,
            isActive,
            type: 'CLASS',
          },
          slug,
        ),
    })
  } catch (error) {
    if (error instanceof ImageUploadError) return { success: false, error: 'imageUpload' }
    console.error('Failed to create class', error)
    return { success: false, error: 'persistence' }
  }

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

  const upload = await readImageField(formData, 'coverFile')
  if ('error' in upload) return { success: false, error: upload.error }

  try {
    const previous = upload.image
      ? await prisma.item.findUnique({ where: { id }, select: { coverUrl: true } })
      : null
    await persistWithImage(blobImageStore, {
      folder: 'aulas',
      image: upload.image,
      previousUrl: previous?.coverUrl,
      persist: (newUrl) =>
        prisma.item.update({
          where: { id },
          data: newUrl ? { ...result.data, coverUrl: newUrl } : result.data,
        }),
    })
  } catch (error) {
    if (error instanceof ImageUploadError) return { success: false, error: 'imageUpload' }
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

  let deleted: { coverUrl: string | null }
  try {
    deleted = await prisma.item.delete({ where: { id }, select: { coverUrl: true } })
  } catch (error) {
    console.error('Failed to delete item', error)
    return { success: false, error: 'delete' }
  }

  await removeStoredImage(blobImageStore, deleted.coverUrl)
  revalidatePath('/aulas')
  return { success: true }
}
