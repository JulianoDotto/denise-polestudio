import { slugify } from './slug'

export const NEW_FEED_CATEGORY_VALUE = '__new__'

export type FeedCategorySelection =
  | { type: 'none' }
  | { type: 'existing'; id: string }
  | { type: 'new'; title: string; slug: string }

export function parseFeedCategory(
  categoryValue: FormDataEntryValue | null,
  newCategoryName: FormDataEntryValue | null,
): FeedCategorySelection | { error: 'categoryName' } {
  const value = String(categoryValue || '').trim()
  if (value !== NEW_FEED_CATEGORY_VALUE) {
    return value ? { type: 'existing', id: value } : { type: 'none' }
  }

  const title = String(newCategoryName || '').trim()
  const slug = slugify(title)
  if (!title || !slug) return { error: 'categoryName' }
  return { type: 'new', title, slug }
}
