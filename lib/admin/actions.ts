'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { hash } from 'bcryptjs'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { normalizeExternalUrl } from '@/lib/externalUrl'
import { slugify } from './slug'

function parseCheckbox(value: FormDataEntryValue | null) {
  return value === 'on'
}

function parseNumber(value: FormDataEntryValue | null) {
  if (value === null) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function parseLines(value: FormDataEntryValue | null) {
  if (!value) return []
  return value
    .toString()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseDate(value: FormDataEntryValue | null) {
  if (!value) return null
  const input = value.toString().trim()
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (Number.isNaN(date.getTime())) return null
  return date
}

function parseDateTime(value: FormDataEntryValue | null) {
  if (!value) return null
  const date = new Date(value.toString())
  if (Number.isNaN(date.getTime())) return null
  return date
}

function buildImageList(coverUrl: string | null, galleryUrls: string[]) {
  const urls = [coverUrl, ...galleryUrls].filter(Boolean) as string[]
  const seen = new Set<string>()
  return urls.filter((url) => {
    if (seen.has(url)) return false
    seen.add(url)
    return true
  })
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

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const priceCents = parseNumber(formData.get('priceCents'))
  const isActive = parseCheckbox(formData.get('isActive'))
  const storeSectionId = String(formData.get('storeSectionId') || '').trim() || null
  let coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  if (!title) {
    redirect('/loja/new?error=1')
  }

  const galleryUrls = parseLines(formData.get('galleryUrls'))
  const images = buildImageList(coverUrl, galleryUrls)
  if (!coverUrl && images.length > 0) {
    coverUrl = images[0]
  }

  const item = await createItemWithUniqueSlug(
    {
      title,
      description,
      priceCents,
      isActive,
      storeSection: storeSectionId ? { connect: { id: storeSectionId } } : undefined,
      coverUrl,
      whatsappTextTemplate,
      type: 'PRODUCT',
      images: {
        create: images.map((url, index) => ({
          url,
          alt: title,
          order: index,
        })),
      },
    },
    slug,
  )

  revalidatePath('/')
  revalidatePath('/')
  revalidatePath('/loja')
  redirect(`/loja?success=1&id=${item.id}`)
}

export async function updateProduct(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/loja')

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const priceCents = parseNumber(formData.get('priceCents'))
  const isActive = parseCheckbox(formData.get('isActive'))
  const storeSectionId = String(formData.get('storeSectionId') || '').trim() || null
  let coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  const galleryUrls = parseLines(formData.get('galleryUrls'))
  const images = buildImageList(coverUrl, galleryUrls)
  if (!coverUrl && images.length > 0) {
    coverUrl = images[0]
  }

  await prisma.item.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      priceCents,
      isActive,
      storeSection: storeSectionId ? { connect: { id: storeSectionId } } : undefined,
      coverUrl,
      whatsappTextTemplate,
      type: 'PRODUCT',
      images: {
        deleteMany: {},
        create: images.map((url, index) => ({
          url,
          alt: title,
          order: index,
        })),
      },
    },
  })

  revalidatePath('/')
  revalidatePath('/loja')
  redirect('/loja?success=1')
}

export async function toggleProductStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/loja')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/')
  revalidatePath('/loja')
  redirect('/loja?success=1')
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/loja')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/loja')
  redirect('/loja?deleted=1')
}

export async function createClass(formData: FormData) {
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

  if (!title) redirect('/aulas/new?error=1')

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

  revalidatePath('/')
  revalidatePath('/aulas')
  redirect('/aulas?success=1')
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

export async function updateClass(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/aulas')

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

  await prisma.item.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      coverUrl,
      isActive,
      hotmartUrl,
      scheduleOnlineUrl,
      schedulePresentialUrl,
      whatsappTextTemplate,
      type: 'CLASS',
    },
  })

  revalidatePath('/')
  revalidatePath('/aulas')
  redirect('/aulas?success=1')
}

export async function updateClassInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

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

  await prisma.item.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      coverUrl,
      isActive,
      hotmartUrl,
      scheduleOnlineUrl,
      schedulePresentialUrl,
      whatsappTextTemplate,
      type: 'CLASS',
    },
  })

  revalidatePath('/aulas')
  return { success: true }
}

export async function toggleClassStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/aulas')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/')
  revalidatePath('/aulas')
  redirect('/aulas?success=1')
}

export async function deleteClass(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/aulas')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/')
  revalidatePath('/aulas')
  redirect('/aulas?deleted=1')
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

  await prisma.item.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      hotmartUrl,
      isActive,
      type,
    },
  })

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

export async function createWorkshop(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  if (!title) redirect('/workshops/new?error=1')

  await createItemWithUniqueSlug(
    {
      title,
      description,
      coverUrl,
      isActive,
      whatsappTextTemplate,
      type: 'WORKSHOP',
    },
    slug,
  )

  revalidatePath('/')
  revalidatePath('/workshops')
  redirect('/workshops?success=1')
}

export async function updateWorkshop(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/workshops')

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  await prisma.item.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      coverUrl,
      isActive,
      whatsappTextTemplate,
      type: 'WORKSHOP',
    },
  })

  revalidatePath('/')
  revalidatePath('/workshops')
  redirect('/workshops?success=1')
}

export async function toggleWorkshopStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/workshops')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/')
  revalidatePath('/workshops')
  redirect('/workshops?success=1')
}

export async function deleteWorkshop(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/workshops')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/workshops')
  redirect('/workshops?deleted=1')
}

export async function createEbook(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const priceCents = parseNumber(formData.get('priceCents'))
  const digitalUrl = String(formData.get('digitalUrl') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  if (!title || !digitalUrl) redirect('/produtos-digitais/new?error=1')

  await createItemWithUniqueSlug(
    {
      title,
      description,
      coverUrl,
      priceCents,
      isActive,
      hotmartUrl: digitalUrl,
      whatsappTextTemplate,
      type: 'EBOOK',
    },
    slug,
  )

  revalidatePath('/')
  revalidatePath('/produtos-digitais')
  redirect('/produtos-digitais?success=1')
}

export async function updateEbook(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/produtos-digitais')

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const priceCents = parseNumber(formData.get('priceCents'))
  const digitalUrl = String(formData.get('digitalUrl') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  if (!title || !digitalUrl) {
    redirect(`/produtos-digitais/${id}/edit?error=1`)
  }

  await prisma.item.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      coverUrl,
      priceCents,
      isActive,
      hotmartUrl: digitalUrl,
      whatsappTextTemplate,
      type: 'EBOOK',
    },
  })

  revalidatePath('/')
  revalidatePath('/produtos-digitais')
  redirect('/produtos-digitais?success=1')
}

export async function toggleEbookStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/produtos-digitais')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/')
  revalidatePath('/produtos-digitais')
  redirect('/produtos-digitais?success=1')
}

export async function deleteEbook(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/produtos-digitais')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/')
  revalidatePath('/produtos-digitais')
  redirect('/produtos-digitais?deleted=1')
}

export async function createEventInline(
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
          coverUrl,
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

export async function createEvent(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const eventDate = parseDate(formData.get('eventDate'))
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  if (!title) redirect('/eventos/new?error=1')

  await createItemWithUniqueSlug(
    {
      title,
      description,
      coverUrl,
      eventDate,
      isActive,
      whatsappTextTemplate,
      type: 'EVENT',
    },
    slug,
  )

  revalidatePath('/')
  revalidatePath('/eventos')
  redirect('/eventos?success=1')
}

export async function updateEvent(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/eventos')

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const eventDate = parseDate(formData.get('eventDate'))
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  await prisma.item.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      coverUrl,
      eventDate,
      isActive,
      whatsappTextTemplate,
      type: 'EVENT',
    },
  })

  revalidatePath('/')
  revalidatePath('/eventos')
  redirect('/eventos?success=1')
}

export async function updateEventInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) return { success: false, error: 'id' }

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim() || null
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const isActive = parseCheckbox(formData.get('isActive'))
  const eventDate = parseDate(formData.get('eventDate'))
  const whatsappTextTemplate =
    String(formData.get('whatsappTextTemplate') || '').trim() || null

  if (!title) {
    return { success: false, error: 'title' }
  }

  try {
    await prisma.item.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        coverUrl,
        eventDate,
        isActive,
        whatsappTextTemplate,
        type: 'EVENT',
      },
    })
  } catch (error) {
    const prismaError = error as { code?: string }
    if (prismaError.code === 'P2002') {
      return { success: false, error: 'slug' }
    }
    throw error
  }

  revalidatePath('/eventos')
  revalidatePath('/eventos')
  return { success: true }
}

export async function toggleEventStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/eventos')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/')
  revalidatePath('/eventos')
  redirect('/eventos?success=1')
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

export async function deleteEvent(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/eventos')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/')
  revalidatePath('/eventos')
  redirect('/eventos?deleted=1')
}

export async function createStorePost(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const imageUrl = String(formData.get('imageUrl') || '').trim() || null
  const isPinned = parseCheckbox(formData.get('isPinned'))
  const expiresAt = isPinned ? null : parseDateTime(formData.get('expiresAt'))

  if (!title) {
    redirect('/loja?error=title')
  }

  if (!isPinned && !expiresAt) {
    redirect('/loja?error=expiresAt')
  }

  await prisma.storePost.create({
    data: {
      title,
      imageUrl,
      isPinned,
      expiresAt,
    },
  })

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

export async function createCategory(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const bannerUrl = String(formData.get('bannerUrl') || '').trim() || null
  const isAdult = parseCheckbox(formData.get('isAdult'))
  const isActive = parseCheckbox(formData.get('isActive'))
  const order = parseNumber(formData.get('order')) ?? 0

  if (!title) redirect('//new?error=1')

  await prisma.storeSection.create({
    data: {
      title,
      slug,
      bannerUrl,
      isAdult,
      isActive,
      order,
    },
  })

  revalidatePath('/')
  revalidatePath('/')
  redirect('/?success=1')
}

export async function updateCategory(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/')

  const title = String(formData.get('title') || '').trim()
  const slugInput = String(formData.get('slug') || '').trim()
  const slug = slugInput || slugify(title)
  const bannerUrl = String(formData.get('bannerUrl') || '').trim() || null
  const isAdult = parseCheckbox(formData.get('isAdult'))
  const isActive = parseCheckbox(formData.get('isActive'))
  const order = parseNumber(formData.get('order')) ?? 0

  await prisma.storeSection.update({
    where: { id },
    data: {
      title,
      slug,
      bannerUrl,
      isAdult,
      isActive,
      order,
    },
  })

  revalidatePath('/')
  revalidatePath('/')
  redirect('/?success=1')
}

export async function toggleCategoryStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/')

  await prisma.storeSection.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/')
  revalidatePath('/')
  redirect('/?success=1')
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/')

  await prisma.storeSection.delete({ where: { id } })

  revalidatePath('/')
  revalidatePath('/')
  redirect('/?deleted=1')
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const email = String(formData.get('email') || '').trim().toLowerCase()
  const name = String(formData.get('name') || '').trim() || null
  const role = String(formData.get('role') || 'USER')
  const isActive = parseCheckbox(formData.get('isActive'))
  const password = String(formData.get('password') || '').trim()

  if (!email || !password) redirect('//new?error=1')

  const passwordHash = await hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      name,
      role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      isActive,
      passwordHash,
    },
  })

  revalidatePath('/')
  revalidatePath('/')
  redirect('/?success=1')
}

export async function updateUser(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/')

  const email = String(formData.get('email') || '').trim().toLowerCase()
  const name = String(formData.get('name') || '').trim() || null
  const role = String(formData.get('role') || 'USER')
  const isActive = parseCheckbox(formData.get('isActive'))
  const password = String(formData.get('password') || '').trim()

  const session = await getServerSession(authOptions)
  const isSelf = session?.user?.id === id
  const primaryEmail = (process.env.ADMIN_EMAIL || '').toLowerCase()

  if (primaryEmail && email === primaryEmail && role !== 'ADMIN') {
    redirect('/?error=primary')
  }

  if (isSelf && role !== 'ADMIN') {
    redirect('/?error=self')
  }

  const data: Prisma.UserUpdateInput = {
    email,
    name,
    role: role === 'ADMIN' ? 'ADMIN' : 'USER',
    isActive,
  }

  if (password) {
    data.passwordHash = await hash(password, 10)
  }

  await prisma.user.update({
    where: { id },
    data,
  })

  revalidatePath('/')
  revalidatePath('/')
  redirect('/?success=1')
}

export async function toggleUserStatus(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/')

  const session = await getServerSession(authOptions)
  if (session?.user?.id === id && !next) {
    redirect('/?error=self')
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) redirect('/')

  const primaryEmail = (process.env.ADMIN_EMAIL || '').toLowerCase()
  if (primaryEmail && user.email.toLowerCase() === primaryEmail && !next) {
    redirect('/?error=primary')
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/')
  revalidatePath('/')
  redirect('/?success=1')
}

export async function toggleUserRole(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'USER')
  if (!id) redirect('/')

  const session = await getServerSession(authOptions)
  if (session?.user?.id === id && next !== 'ADMIN') {
    redirect('/?error=self')
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) redirect('/')

  const primaryEmail = (process.env.ADMIN_EMAIL || '').toLowerCase()
  if (primaryEmail && user.email.toLowerCase() === primaryEmail && next !== 'ADMIN') {
    redirect('/?error=primary')
  }

  await prisma.user.update({
    where: { id },
    data: { role: next === 'ADMIN' ? 'ADMIN' : 'USER' },
  })

  revalidatePath('/')
  revalidatePath('/')
  redirect('/?success=1')
}
