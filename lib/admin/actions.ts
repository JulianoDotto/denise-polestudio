'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { hash } from 'bcryptjs'
import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
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
    redirect('/admin/products/new?error=1')
  }

  const galleryUrls = parseLines(formData.get('galleryUrls'))
  const images = buildImageList(coverUrl, galleryUrls)
  if (!coverUrl && images.length > 0) {
    coverUrl = images[0]
  }

  const item = await prisma.item.create({
    data: {
      title,
      slug,
      description,
      priceCents,
      isActive,
      storeSectionId,
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
  })

  revalidatePath('/admin')
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  redirect(`/admin/products?success=1&id=${item.id}`)
}

export async function updateProduct(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/products')

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
      storeSectionId,
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

  revalidatePath('/admin')
  revalidatePath('/admin/products')
  redirect('/admin/products?success=1')
}

export async function toggleProductStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/admin/products')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/products')
  redirect('/admin/products?success=1')
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/products')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/admin/products')
  redirect('/admin/products?deleted=1')
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

  if (!title) redirect('/admin/aulas/new?error=1')

  await prisma.item.create({
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

  revalidatePath('/admin')
  revalidatePath('/admin/aulas')
  redirect('/admin/aulas?success=1')
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

  await prisma.item.create({
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

export async function createDigitalProductInline(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim() || null
  const hotmartUrl = String(formData.get('hotmartUrl') || '').trim() || null
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

  await prisma.item.create({
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

export async function updateClass(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/aulas')

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

  revalidatePath('/admin')
  revalidatePath('/admin/aulas')
  redirect('/admin/aulas?success=1')
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
  if (!id) redirect('/admin/aulas')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/aulas')
  redirect('/admin/aulas?success=1')
}

export async function deleteClass(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/aulas')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/admin')
  revalidatePath('/admin/aulas')
  redirect('/admin/aulas?deleted=1')
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
  const hotmartUrl = String(formData.get('hotmartUrl') || '').trim() || null
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

  if (!title) redirect('/admin/workshops/new?error=1')

  await prisma.item.create({
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

  revalidatePath('/admin')
  revalidatePath('/admin/workshops')
  redirect('/admin/workshops?success=1')
}

export async function updateWorkshop(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/workshops')

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

  revalidatePath('/admin')
  revalidatePath('/admin/workshops')
  redirect('/admin/workshops?success=1')
}

export async function toggleWorkshopStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/admin/workshops')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/workshops')
  redirect('/admin/workshops?success=1')
}

export async function deleteWorkshop(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/workshops')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/admin/workshops')
  redirect('/admin/workshops?deleted=1')
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

  if (!title || !digitalUrl) redirect('/admin/produtos-digitais/new?error=1')

  await prisma.item.create({
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

  revalidatePath('/admin')
  revalidatePath('/admin/produtos-digitais')
  redirect('/admin/produtos-digitais?success=1')
}

export async function updateEbook(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/produtos-digitais')

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
    redirect(`/admin/produtos-digitais/${id}/edit?error=1`)
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

  revalidatePath('/admin')
  revalidatePath('/admin/produtos-digitais')
  redirect('/admin/produtos-digitais?success=1')
}

export async function toggleEbookStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/admin/produtos-digitais')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/produtos-digitais')
  redirect('/admin/produtos-digitais?success=1')
}

export async function deleteEbook(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/produtos-digitais')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/admin')
  revalidatePath('/admin/produtos-digitais')
  redirect('/admin/produtos-digitais?deleted=1')
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
      revalidatePath('/admin/eventos')
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

  if (!title) redirect('/admin/eventos/new?error=1')

  await prisma.item.create({
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

  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  redirect('/admin/eventos?success=1')
}

export async function updateEvent(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/eventos')

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

  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  redirect('/admin/eventos?success=1')
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
  revalidatePath('/admin/eventos')
  return { success: true }
}

export async function toggleEventStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/admin/eventos')

  await prisma.item.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  redirect('/admin/eventos?success=1')
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
  revalidatePath('/admin/eventos')
  return { success: true }
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/eventos')

  await prisma.item.delete({ where: { id } })

  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  redirect('/admin/eventos?deleted=1')
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

  if (!title) redirect('/admin/categories/new?error=1')

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

  revalidatePath('/admin')
  revalidatePath('/admin/categories')
  redirect('/admin/categories?success=1')
}

export async function updateCategory(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/categories')

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

  revalidatePath('/admin')
  revalidatePath('/admin/categories')
  redirect('/admin/categories?success=1')
}

export async function toggleCategoryStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/admin/categories')

  await prisma.storeSection.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/categories')
  redirect('/admin/categories?success=1')
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/categories')

  await prisma.storeSection.delete({ where: { id } })

  revalidatePath('/admin')
  revalidatePath('/admin/categories')
  redirect('/admin/categories?deleted=1')
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const email = String(formData.get('email') || '').trim().toLowerCase()
  const name = String(formData.get('name') || '').trim() || null
  const role = String(formData.get('role') || 'USER')
  const isActive = parseCheckbox(formData.get('isActive'))
  const password = String(formData.get('password') || '').trim()

  if (!email || !password) redirect('/admin/users/new?error=1')

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

  revalidatePath('/admin')
  revalidatePath('/admin/users')
  redirect('/admin/users?success=1')
}

export async function updateUser(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  if (!id) redirect('/admin/users')

  const email = String(formData.get('email') || '').trim().toLowerCase()
  const name = String(formData.get('name') || '').trim() || null
  const role = String(formData.get('role') || 'USER')
  const isActive = parseCheckbox(formData.get('isActive'))
  const password = String(formData.get('password') || '').trim()

  const session = await getServerSession(authOptions)
  const isSelf = session?.user?.id === id
  const primaryEmail = (process.env.ADMIN_EMAIL || '').toLowerCase()

  if (primaryEmail && email === primaryEmail && role !== 'ADMIN') {
    redirect('/admin/users?error=primary')
  }

  if (isSelf && role !== 'ADMIN') {
    redirect('/admin/users?error=self')
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

  revalidatePath('/admin')
  revalidatePath('/admin/users')
  redirect('/admin/users?success=1')
}

export async function toggleUserStatus(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'true') === 'true'
  if (!id) redirect('/admin/users')

  const session = await getServerSession(authOptions)
  if (session?.user?.id === id && !next) {
    redirect('/admin/users?error=self')
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) redirect('/admin/users')

  const primaryEmail = (process.env.ADMIN_EMAIL || '').toLowerCase()
  if (primaryEmail && user.email.toLowerCase() === primaryEmail && !next) {
    redirect('/admin/users?error=primary')
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: next },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/users')
  redirect('/admin/users?success=1')
}

export async function toggleUserRole(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '')
  const next = String(formData.get('next') || 'USER')
  if (!id) redirect('/admin/users')

  const session = await getServerSession(authOptions)
  if (session?.user?.id === id && next !== 'ADMIN') {
    redirect('/admin/users?error=self')
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) redirect('/admin/users')

  const primaryEmail = (process.env.ADMIN_EMAIL || '').toLowerCase()
  if (primaryEmail && user.email.toLowerCase() === primaryEmail && next !== 'ADMIN') {
    redirect('/admin/users?error=primary')
  }

  await prisma.user.update({
    where: { id },
    data: { role: next === 'ADMIN' ? 'ADMIN' : 'USER' },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/users')
  redirect('/admin/users?success=1')
}
