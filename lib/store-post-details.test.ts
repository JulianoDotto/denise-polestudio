import assert from 'node:assert/strict'
import test from 'node:test'

import { parsePriceToCents, parseStorePostDetails } from './admin/store-post-details'

test('parses Brazilian price formats into cents', () => {
  assert.equal(parsePriceToCents('25'), 2500)
  assert.equal(parsePriceToCents('25,00'), 2500)
  assert.equal(parsePriceToCents('25,5'), 2550)
  assert.equal(parsePriceToCents('R$ 67,00'), 6700)
  assert.equal(parsePriceToCents('1.234,56'), 123456)
  assert.equal(parsePriceToCents('0,99'), 99)
})

test('empty price means no price', () => {
  assert.equal(parsePriceToCents(''), null)
  assert.equal(parsePriceToCents('   '), null)
})

test('rejects values that are not a price', () => {
  for (const value of ['abc', '-5', '10,999', '1,2,3', '12.34', '1.23,45']) {
    assert.equal(parsePriceToCents(value), 'invalid', value)
  }
})

test('rejects prices above the 32-bit cents limit', () => {
  assert.equal(parsePriceToCents('21474836,47'), 2147483647)
  assert.equal(parsePriceToCents('21474836,48'), 'invalid')
})

test('store post details trim the description and keep line breaks', () => {
  const form = new FormData()
  form.set('description', '  Linha 1\nLinha 2  ')
  form.set('price', '15,00')
  assert.deepEqual(parseStorePostDetails(form), {
    data: { description: 'Linha 1\nLinha 2', priceCents: 1500 },
  })
})

test('blank details become null and an invalid price is an error', () => {
  const blank = new FormData()
  assert.deepEqual(parseStorePostDetails(blank), { data: { description: null, priceCents: null } })
  const invalid = new FormData()
  invalid.set('price', 'abc')
  assert.deepEqual(parseStorePostDetails(invalid), { error: 'price' })
})
