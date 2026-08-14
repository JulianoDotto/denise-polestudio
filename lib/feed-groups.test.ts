import assert from 'node:assert/strict'
import test from 'node:test'

import { groupFeedPostsByCategory } from './feed-groups'

const categoryA = { id: 'a', title: 'Categoria A', order: 2 }
const categoryB = { id: 'b', title: 'Categoria B', order: 1 }

test('groups posts without mixing or duplicating category items', () => {
  const groups = groupFeedPostsByCategory([
    { id: 'a-1', title: 'A 1', imageUrl: '/a1.png', storeSection: categoryA },
    { id: 'b-1', title: 'B 1', imageUrl: '/b1.png', storeSection: categoryB },
    { id: 'a-2', title: 'A 2', imageUrl: '/a2.png', storeSection: categoryA },
  ], '/fallback.svg')

  assert.deepEqual(groups.map((group) => group.id), ['b', 'a'])
  assert.deepEqual(groups[0]?.items.map((item) => item.id), ['b-1'])
  assert.deepEqual(groups[1]?.items.map((item) => item.id), ['a-1', 'a-2'])
})

test('omits uncategorized legacy posts and does not create empty categories', () => {
  const groups = groupFeedPostsByCategory([
    { id: 'legacy', title: 'Legado', imageUrl: null, storeSection: null },
    { id: 'a-1', title: 'A 1', imageUrl: null, storeSection: categoryA },
  ], '/fallback.svg')

  assert.equal(groups.length, 1)
  assert.equal(groups[0]?.id, 'a')
  assert.equal(groups[0]?.items[0]?.imageUrl, '/fallback.svg')
})

test('returns an empty state when there are no categorized active posts', () => {
  assert.deepEqual(groupFeedPostsByCategory([], '/fallback.svg'), [])
  assert.deepEqual(groupFeedPostsByCategory([
    { id: 'legacy', title: 'Legado', imageUrl: null, storeSection: null },
  ], '/fallback.svg'), [])
})
