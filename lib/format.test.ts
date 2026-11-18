import assert from 'node:assert/strict'
import test from 'node:test'

import { formatPrice } from './format'

const text = (value: string | null) => value?.replace(/\u00a0/g, ' ')

test('formats cents as Brazilian reais', () => {
  assert.equal(text(formatPrice(2500)), 'R$ 25,00')
  assert.equal(text(formatPrice(123456)), 'R$ 1.234,56')
  assert.equal(formatPrice(null), null)
  assert.equal(formatPrice(undefined), null)
  assert.equal(text(formatPrice(0)), 'R$ 0,00')
})
