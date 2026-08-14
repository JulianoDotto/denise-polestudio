import assert from 'node:assert/strict'
import test from 'node:test'

import { NEW_FEED_CATEGORY_VALUE, parseFeedCategory } from './admin/feed-category'
import {
  persistFeedPostWithCategory,
  FeedCategoryDuplicateError,
  FeedCategoryNotFoundError,
  type FeedPersistenceDependencies,
  type FeedPersistenceInput,
} from './admin/feed-persistence'

const feedInput: Omit<FeedPersistenceInput, 'category'> = {
  title: 'Publicação teste', imageUrl: null, isPinned: true, expiresAt: null,
}

function createHarness(options?: {
  existingCategory?: boolean
  duplicateCategory?: boolean
  feedFailure?: boolean
}) {
  const posts: FeedPersistenceInput[] = []
  const uniqueError = () => Object.assign(new Error('unique'), { code: 'P2002' })
  const missingError = () => Object.assign(new Error('missing'), { code: 'P2025' })
  const dependencies = {
    isUniqueViolation: (error: unknown) =>
      error instanceof Error && 'code' in error && error.code === 'P2002',
    isMissingRelation: (error: unknown) =>
      error instanceof Error && 'code' in error && error.code === 'P2025',
    createFeedPost: async (data: FeedPersistenceInput) => {
      if (data.category.type === 'existing' && !options?.existingCategory) {
        throw missingError()
      }
      if (data.category.type === 'new' && options?.duplicateCategory) {
        throw uniqueError()
      }
      if (options?.feedFailure) throw new Error('database unavailable')
      posts.push(data)
    },
  } satisfies FeedPersistenceDependencies
  return { posts, dependencies }
}

test('keeps category optional for legacy feed posts', () => {
  assert.deepEqual(parseFeedCategory('', ''), { type: 'none' })
})

test('selects an existing category without using a residual new name', () => {
  assert.deepEqual(parseFeedCategory('category-id', 'Nome residual'), {
    type: 'existing', id: 'category-id',
  })
})

test('normalizes and validates a new category name', () => {
  assert.deepEqual(parseFeedCategory(NEW_FEED_CATEGORY_VALUE, '  Moda Íntima  '), {
    type: 'new', title: 'Moda Íntima', slug: 'moda-intima',
  })
  assert.deepEqual(parseFeedCategory(NEW_FEED_CATEGORY_VALUE, '   '), {
    error: 'categoryName',
  })
})

test('associates an existing category with the feed post', async () => {
  const harness = createHarness({ existingCategory: true })
  await persistFeedPostWithCategory(harness.dependencies, {
    ...feedInput, category: { type: 'existing', id: 'existing-category' },
  })
  assert.deepEqual(harness.posts[0]?.category, {
    type: 'existing', id: 'existing-category',
  })
})

test('creates and associates a new category atomically', async () => {
  const harness = createHarness()
  await persistFeedPostWithCategory(harness.dependencies, {
    ...feedInput,
    category: { type: 'new', title: 'Nova categoria', slug: 'nova-categoria' },
  })
  assert.deepEqual(harness.posts[0]?.category, {
    type: 'new', title: 'Nova categoria', slug: 'nova-categoria',
  })
})

test('rolls back a new category when feed persistence fails', async () => {
  const harness = createHarness({ feedFailure: true })
  await assert.rejects(persistFeedPostWithCategory(harness.dependencies, {
    ...feedInput,
    category: { type: 'new', title: 'Nova categoria', slug: 'nova-categoria' },
  }))
  assert.equal(harness.posts.length, 0)
})

test('distinguishes missing and duplicate categories', async () => {
  const missing = createHarness()
  await assert.rejects(persistFeedPostWithCategory(missing.dependencies, {
    ...feedInput, category: { type: 'existing', id: 'removed' },
  }), FeedCategoryNotFoundError)

  const duplicate = createHarness({ duplicateCategory: true })
  await assert.rejects(persistFeedPostWithCategory(duplicate.dependencies, {
    ...feedInput, category: { type: 'new', title: 'Repetida', slug: 'repetida' },
  }), FeedCategoryDuplicateError)
})
