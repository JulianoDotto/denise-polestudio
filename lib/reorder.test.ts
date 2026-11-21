import assert from 'node:assert/strict'
import test from 'node:test'

import { moveVisible, parseMoveDirection } from './admin/reorder'

test('swaps with the neighbor when everything is visible', () => {
  assert.deepEqual(moveVisible(['a', 'b', 'c'], ['a', 'b', 'c'], 'c', 'up'), ['a', 'c', 'b'])
  assert.deepEqual(moveVisible(['a', 'b', 'c'], ['a', 'b', 'c'], 'a', 'down'), ['b', 'a', 'c'])
})

test('skips hidden entries between visible neighbors', () => {
  assert.deepEqual(moveVisible(['a', 'h', 'b'], ['a', 'b'], 'b', 'up'), ['b', 'h', 'a'])
  assert.deepEqual(
    moveVisible(['h1', 'a', 'h2', 'b', 'c'], ['a', 'b', 'c'], 'a', 'down'),
    ['h1', 'b', 'h2', 'a', 'c'],
  )
})

test('returns null for unknown id or edges', () => {
  assert.equal(moveVisible(['a', 'b'], ['a', 'b'], 'a', 'up'), null)
  assert.equal(moveVisible(['a', 'b'], ['a', 'b'], 'b', 'down'), null)
  assert.equal(moveVisible(['a', 'h'], ['a'], 'h', 'up'), null)
  assert.equal(moveVisible(['a', 'b'], ['a', 'b'], 'x', 'up'), null)
})

test('parses only up and down', () => {
  assert.equal(parseMoveDirection('up'), 'up')
  assert.equal(parseMoveDirection('down'), 'down')
  assert.equal(parseMoveDirection('left'), null)
  assert.equal(parseMoveDirection(null), null)
})
