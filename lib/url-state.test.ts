import assert from 'node:assert/strict'
import test from 'node:test'

import { getBlobOrigin, withSearchParam } from './url-state'

test('a search param is added, keeping the others', () => {
  assert.equal(withSearchParam('?success=1', 'produto', 'abc'), '?success=1&produto=abc')
  assert.equal(withSearchParam('', 'produto', 'abc'), '?produto=abc')
})

test('a search param is replaced when it is already there', () => {
  assert.equal(withSearchParam('?produto=old', 'produto', 'new'), '?produto=new')
})

test('a null value removes the param, and an empty query has no question mark', () => {
  assert.equal(withSearchParam('?produto=abc&success=1', 'produto', null), '?success=1')
  assert.equal(withSearchParam('?produto=abc', 'produto', null), '')
})

test('the blob origin comes from the store id', () => {
  assert.equal(getBlobOrigin('store_AbC123'), 'https://abc123.public.blob.vercel-storage.com')
})

test('no store id means no blob origin', () => {
  assert.equal(getBlobOrigin(undefined), null)
  assert.equal(getBlobOrigin(''), null)
  assert.equal(getBlobOrigin('not-a-store'), null)
})
