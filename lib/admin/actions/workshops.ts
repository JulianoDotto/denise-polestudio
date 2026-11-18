'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createItemWithUniqueSlug } from '@/lib/admin/create-item'
import { parseCheckbox } from '@/lib/admin/form-values'
import { parseWorkshopUpdate } from '@/lib/admin/item-updates'
import {
  persistWorkshopCreation,
  WorkshopRequestConflictError,
} from '@/lib/admin/workshop-persistence'

export async function createWorkshopInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const isActive = parseCheckbox(formData.get('isActive'))
  const requestId = String(formData.get('requestId') || '').trim()

  if (!title) {
    return { success: false, error: 'title', requestId: '' }
  }
  if (!requestId || requestId.length > 100) {
    return { success: false, error: 'request', requestId: '' }
  }

  try {
    await persistWorkshopCreation(
      {
        findByRequestId: async (id) => {
          const item = await prisma.item.findUnique({ where: { id } })
          if (!item || item.type !== 'WORKSHOP') return null
          return {
            id: item.id,
            requestId: item.id,
            title: item.title,
            description: item.description,
            isActive: item.isActive,
          }
        },
        create: async (creation) => {
          const item = await createItemWithUniqueSlug(
            {
              id: creation.requestId,
              title: creation.title,
              description: creation.description,
              isActive: creation.isActive,
              type: 'WORKSHOP',
            },
            creation.title,
          )
          return { ...creation, id: item.id }
        },
      },
      { requestId, title, description, isActive },
    )
  } catch (error) {
    return {
      success: false,
      error: error instanceof WorkshopRequestConflictError ? 'request' : 'create',
      requestId: '',
    }
  }

  revalidatePath('/')
  revalidatePath('/workshops')
  return { success: true, error: '', requestId }
}

export async function updateWorkshopInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

  const result = parseWorkshopUpdate(formData)
  if ('error' in result) return { success: false, error: result.error }

  try {
    await prisma.item.update({ where: { id }, data: result.data })
  } catch {
    return { success: false, error: 'update' }
  }

  revalidatePath('/workshops')
  return { success: true }
}

export async function deleteWorkshopInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

  try {
    await prisma.item.delete({ where: { id } })
  } catch {
    return { success: false, error: 'delete' }
  }

  revalidatePath('/workshops')
  return { success: true }
}
