import type { FeedCategorySelection } from './feed-category'

export class FeedCategoryNotFoundError extends Error {}
export class FeedCategoryDuplicateError extends Error {}

export type FeedPersistenceInput = {
  title: string
  imageUrl: string | null
  isPinned: boolean
  expiresAt: Date | null
  category: FeedCategorySelection
}

export type FeedTransaction = {
  createFeedPost(data: FeedPersistenceInput): Promise<void>
}

export type FeedPersistenceDependencies = {
  createFeedPost(data: FeedPersistenceInput): Promise<void>
  isUniqueViolation(error: unknown): boolean
  isMissingRelation(error: unknown): boolean
}

export async function persistFeedPostWithCategory(
  dependencies: FeedPersistenceDependencies,
  input: FeedPersistenceInput,
) {
  try {
    await dependencies.createFeedPost(input)
  } catch (error) {
    if (input.category.type === 'new' && dependencies.isUniqueViolation(error)) {
      throw new FeedCategoryDuplicateError()
    }
    if (input.category.type === 'existing' && dependencies.isMissingRelation(error)) {
      throw new FeedCategoryNotFoundError()
    }
    throw error
  }
}
