'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { parseFeedCategory } from '@/lib/admin/feed-category'
import { nextStoreSectionOrder } from '@/lib/admin/next-order'
import {
  persistFeedPostWithCategory,
  FeedCategoryDuplicateError,
  FeedCategoryNotFoundError,
} from '@/lib/admin/feed-persistence'
import { parseCheckbox, parseDateTime } from '@/lib/admin/form-values'
import { readImageField } from '@/lib/admin/image-file'
import { ImageUploadError, persistWithImage, removeStoredImage } from '@/lib/admin/image-flow'
import { blobImageStore } from '@/lib/admin/image-store'
import { parseStorePostDetails } from '@/lib/admin/store-post-details'

export async function createStorePost(formData: FormData) {
  await requireAdmin()

  const title = String(formData.get('title') || '').trim()
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

  const upload = await readImageField(formData, 'imageFile')
  if ('error' in upload) {
    redirect(`/loja?error=${upload.error}`)
  }

  try {
    await persistWithImage(blobImageStore, {
      folder: 'loja',
      image: upload.image,
      persist: (newUrl) =>
        persistFeedPostWithCategory(
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
                              order: await nextStoreSectionOrder(),
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
          {
            title,
            imageUrl: newUrl,
            isPinned,
            expiresAt,
            category,
            ...details.data,
          },
        ),
    })
  } catch (error) {
    if (error instanceof ImageUploadError) {
      redirect('/loja?error=imageUpload')
    }
    if (error instanceof FeedCategoryNotFoundError) {
      redirect('/loja?error=category')
    }
    if (error instanceof FeedCategoryDuplicateError) {
      redirect('/loja?error=categoryDuplicate')
    }
    console.error('Failed to save store post', error)
    redirect('/loja?error=persistence')
  }

  revalidatePath('/loja')
  redirect('/loja?success=1')
}

export async function deleteStorePost(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  if (!id) redirect('/loja')

  const deleted = await prisma.storePost.delete({
    where: { id },
    select: { imageUrl: true },
  })

  await removeStoredImage(blobImageStore, deleted.imageUrl)
  revalidatePath('/loja')
  redirect('/loja?deleted=1')
}
