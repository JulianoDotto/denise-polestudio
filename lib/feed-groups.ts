export type FeedPostForGrouping = {
  id: string
  title: string
  imageUrl: string | null
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
  }>
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
    })
    groups.set(group.id, group)
  }

  return Array.from(groups.values())
    .sort((left, right) =>
      left.order - right.order || left.title.localeCompare(right.title, 'pt-BR'),
    )
    .map((group) => ({
      id: group.id,
      title: group.title,
      items: group.items,
    }))
}
