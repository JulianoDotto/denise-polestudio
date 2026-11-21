export type FeedPostForGrouping = {
  id: string
  title: string
  imageUrl: string | null
  description: string | null
  priceCents: number | null
  storeSection: {
    id: string
    title: string
    order: number
  } | null
}

export type FeedCategoryGroup = {
  id: string
  title: string
  items: Array<{
    id: string
    title: string
    imageUrl: string
    description: string | null
    priceCents: number | null
  }>
}

// Shared by the store page and the reorder action so both agree on who is a neighbor.
export function compareStoreSections(
  left: { order: number; title: string },
  right: { order: number; title: string },
) {
  return left.order - right.order || left.title.localeCompare(right.title, 'pt-BR')
}

// Posts the store shows: pinned ones, or ones that have not expired yet.
export function activeFeedPostWhere(now: Date) {
  return {
    OR: [{ isPinned: true }, { expiresAt: { gt: now } }],
  }
}

export function groupFeedPostsByCategory(
  posts: FeedPostForGrouping[],
  fallbackImageUrl: string,
): FeedCategoryGroup[] {
  const groups = new Map<string, FeedCategoryGroup & { order: number }>()

  for (const post of posts) {
    if (!post.storeSection) continue

    const group = groups.get(post.storeSection.id) ?? {
      id: post.storeSection.id,
      title: post.storeSection.title,
      order: post.storeSection.order,
      items: [],
    }

    group.items.push({
      id: post.id,
      title: post.title,
      imageUrl: post.imageUrl || fallbackImageUrl,
      description: post.description,
      priceCents: post.priceCents,
    })
    groups.set(group.id, group)
  }

  return Array.from(groups.values())
    .sort(compareStoreSections)
    .map((group) => ({
      id: group.id,
      title: group.title,
      items: group.items,
    }))
}
