import assert from 'node:assert/strict'
import test from 'node:test'

import { buildProductOrderMessage, formatProductCount } from './store-product'

const plain = (value: string) => value.replace(/ /g, ' ')

test('the order message names the product and its price', () => {
  assert.equal(
    plain(buildProductOrderMessage('Hot Ball Xana Loka Dupla', 1500)),
    'Olá! Tenho interesse no produto “Hot Ball Xana Loka Dupla” (R$ 15,00).',
  )
})

test('the order message leaves the price out when the product has none', () => {
  assert.equal(
    buildProductOrderMessage('Gel Lis-In', null),
    'Olá! Tenho interesse no produto “Gel Lis-In”.',
  )
})

test('the product count agrees in number', () => {
  assert.equal(formatProductCount(1), '1 produto')
  assert.equal(formatProductCount(10), '10 produtos')
})
