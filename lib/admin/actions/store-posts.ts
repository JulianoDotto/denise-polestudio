'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { parseFeedCategory } from '@/lib/admin/feed-category'
import {
  persistFeedPostWithCategory,
  FeedCategoryDuplicateError,
  FeedCategoryNotFoundError,
} from '@/lib/admin/feed-persistence'
import { parseCheckbox, parseDateTime } from '@/lib/admin/form-values'
import { parseStorePostDetails } from '@/lib/admin/store-post-details'

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
