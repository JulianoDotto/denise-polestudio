import assert from 'node:assert/strict'
import test from 'node:test'

import { getPulseGeometry } from './click-pulse'

const rect = { left: 100, top: 50, width: 200, height: 48 }

test('the pulse starts where the pointer touched the button', () => {
  const pulse = getPulseGeometry(rect, 130, 60)
  assert.equal(pulse.x, 30)
  assert.equal(pulse.y, 10)
})

test('the pulse grows far enough to cover the farthest corner', () => {
  const pulse = getPulseGeometry(rect, 100, 50)
  assert.equal(pulse.size, Math.ceil(2 * Math.hypot(200, 48)))
})

test('a touch in the middle needs a smaller pulse than one at the edge', () => {
  const middle = getPulseGeometry(rect, 200, 74)
  const edge = getPulseGeometry(rect, 100, 74)
  assert.ok(middle.size < edge.size)
})

test('a point outside the button is kept inside it', () => {
  const pulse = getPulseGeometry(rect, 50, 500)
  assert.equal(pulse.x, 0)
  assert.equal(pulse.y, 48)
})
