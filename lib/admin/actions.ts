'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { normalizeExternalUrl } from '@/lib/externalUrl'
import { validateClassCoverUrl } from '@/lib/admin/class-cover'
import {
  persistWorkshopCreation,
  WorkshopRequestConflictError,
} from '@/lib/admin/workshop-persistence'
import { slugify } from './slug'
import {
  parseClassUpdate,
  parseDate,
  parseDigitalProductUpdate,
  parseEventUpdate,
  parseWorkshopUpdate,
} from './item-updates'
import { parseFeedCategory } from './feed-category'
import { parseStorePostDetails } from './store-post-details'
import {
  persistFeedPostWithCategory,
  FeedCategoryDuplicateError,
  FeedCategoryNotFoundError,
} from './feed-persistence'

function parseCheckbox(value: FormDataEntryValue | null) {
  return value === 'on'
}

function parseDateTime(value: FormDataEntryValue | null) {
  if (!value) return null
  const date = new Date(value.toString())
  if (Number.isNaN(date.getTime())) return null
  return date
}

function isSlugUniqueConstraintError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const prismaError = error as {
    code?: string
    meta?: { target?: string | string[] }
  }
  if (prismaError.code !== 'P2002') return false

  const target = prismaError.meta?.target
  if (Array.isArray(target)) return target.includes('slug')
  if (typeof target === 'string') {
    return target.includes('slug') || target.includes('Item_slug_key')
  }

  // Fallback defensivo: neste fluxo lidamos apenas com criação de Item com slug único.
  return true
}

async function createItemWithUniqueSlug(
  data: Omit<Prisma.ItemCreateInput, 'slug'>,
  slugBase: string,
) {
  const baseSlug = slugify(slugBase) || `item-${Date.now()}`
  const maxAttempts = 20

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`

    try {
      return await prisma.item.create({
        data: {
          ...data,
          slug,
        },
      })
    } catch (error) {
      if (!isSlugUniqueConstraintError(error)) {
        throw error
      }
    }
  }

  throw new Error('Nao foi possivel gerar um slug unico para o item.')
}

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

export async function createDigitalProductInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const hotmartUrl =
    normalizeExternalUrl(String(formData.get('hotmartUrl') || '')) || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
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
    },
    slug,
  )

  revalidatePath('/produtos-digitais')
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

  await prisma.item.delete({ where: { id } })

  revalidatePath('/produtos-digitais')
  return { success: true }
}

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

export async function createEventInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const eventDate = parseDate(formData.get('eventDate'))
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  if (!title) {
    return { success: false, error: 'title' }
  }

  const baseSlug = slugify(slug) || `evento-${Date.now()}`
  const maxAttempts = 20

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const currentSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`
    try {
      await prisma.item.create({
        data: {
          title,
          description,
          eventDate,
          isActive,
          whatsappTextTemplate,
          type: 'EVENT',
          slug: currentSlug,
        },
      })
      revalidatePath('/eventos')
      revalidatePath('/eventos')
      return { success: true }
    } catch (error) {
      const prismaError = error as { code?: string }
      if (prismaError.code !== 'P2002') {
        throw error
      }
    }
  }

  return { success: false, error: 'slug' }
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

  await prisma.item.delete({ where: { id } })

  revalidatePath('/eventos')
  revalidatePath('/eventos')
  return { success: true }
}

export async function createStorePost(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const imageUrl = String(formData.get('imageUrl') || '').trim() || null
  const isPinned = parseCheckbox(formData.get('isPinned'))
  const expiresAt = isPinned ? null : parseDateTime(formData.get('expiresAt'))
  const category = parseFeedCategory(
    formData.get('storeSectionId'),
    formData.get('newCategoryName'),
  )

  if (!title) {
    redirect('/loja?error=title')
  }

  if (!isPinned && !expiresAt) {
    redirect('/loja?error=expiresAt')
  }
  if ('error' in category) {
    redirect(`/loja?error=${category.error}`)
  }
  const details = parseStorePostDetails(formData)
  if ('error' in details) {
    redirect(`/loja?error=${details.error}`)
  }

  try {
    await persistFeedPostWithCategory(
      {
        createFeedPost: async (data) => {
          await prisma.storePost.create({
            data: {
              title: data.title,
              imageUrl: data.imageUrl,
              isPinned: data.isPinned,
              expiresAt: data.expiresAt,
              description: data.description,
              priceCents: data.priceCents,
              storeSection:
                data.category.type === 'existing'
                  ? { connect: { id: data.category.id } }
                  : data.category.type === 'new'
                    ? {
                        create: {
                          title: data.category.title,
                          slug: data.category.slug,
                        },
                      }
                    : undefined,
            },
          })
        },
        isUniqueViolation: (error) =>
          error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002',
        isMissingRelation: (error) =>
          error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025',
      },
      { title, imageUrl, isPinned, expiresAt, category, ...details.data },
    )
  } catch (error) {
    if (error instanceof FeedCategoryNotFoundError) {
      redirect('/loja?error=category')
    }
    if (error instanceof FeedCategoryDuplicateError) {
      redirect('/loja?error=categoryDuplicate')
    }
    redirect('/loja?error=persistence')
  }

  revalidatePath('/loja')
  redirect('/loja?success=1')
}

export async function deleteStorePost(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/loja')

  await prisma.storePost.delete({ where: { id } })

  revalidatePath('/loja')
  redirect('/loja?deleted=1')
}

