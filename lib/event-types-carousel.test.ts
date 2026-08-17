import assert from 'node:assert/strict'
import test from 'node:test'

import { EVENT_TYPES } from '../hardcoded/event-types'
import {
  getEventTypeSwipeDirection,
  moveEventTypeIndex,
} from './event-types-carousel'

test('keeps all official event types in their defined order', () => {
  assert.deepEqual(EVENT_TYPES.map(({ title }) => title), [
    'Chá de Lingerie',
    'Reunião de amigas',
    'Apresentações e Performances',
    'Pole Canto',
    'Palestras',
    'Vivência O despertar da Deusa',
  ])
  assert.equal(EVENT_TYPES.every(({ description }) => description.length > 0), true)
})

test('moves one item at a time and loops at both limits', () => {
  assert.equal(moveEventTypeIndex(0, 1, EVENT_TYPES.length), 1)
  assert.equal(moveEventTypeIndex(1, -1, EVENT_TYPES.length), 0)
  assert.equal(
    moveEventTypeIndex(0, -1, EVENT_TYPES.length),
    EVENT_TYPES.length - 1,
  )
  assert.equal(
    moveEventTypeIndex(EVENT_TYPES.length - 1, 1, EVENT_TYPES.length),
    0,
  )
})

test('recognizes horizontal swipes and ignores short or vertical gestures', () => {
  assert.equal(getEventTypeSwipeDirection(300, 100, 200, 105), 1)
  assert.equal(getEventTypeSwipeDirection(100, 100, 200, 105), -1)
  assert.equal(getEventTypeSwipeDirection(100, 100, 130, 102), null)
  assert.equal(getEventTypeSwipeDirection(100, 100, 160, 180), null)
})

test('handles an empty collection safely', () => {
  assert.equal(moveEventTypeIndex(0, 1, 0), 0)
})
