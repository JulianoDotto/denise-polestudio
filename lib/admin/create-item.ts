import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { slugify } from './slug'

export class SlugGenerationError extends Error {
  constructor() {
    super('Nao foi possivel gerar um slug unico para o item.')
    this.name = 'SlugGenerationError'
  }
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

export async function createItemWithUniqueSlug(
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

  throw new SlugGenerationError()
}
