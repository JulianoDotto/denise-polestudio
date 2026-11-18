import assert from 'node:assert/strict'
import test from 'node:test'
import { assertLocalDatabase } from './seed-guard'

test('allows local hosts', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    assert.doesNotThrow(() => assertLocalDatabase(`postgresql://u:p@${host}:5432/db`))
  }
})

test('rejects remote hosts', () => {
  assert.throws(() => assertLocalDatabase('postgresql://u:p@ep-x.sa-east-1.aws.neon.tech/db'))
})

test('rejects a malformed url', () => {
  assert.throws(() => assertLocalDatabase('nao-e-url'))
})

test('error messages never contain the connection string', () => {
  for (const url of ['postgresql://u:secret@ep-x.neon.tech/db', 'secret-nao-e-url']) {
    try {
      assertLocalDatabase(url)
      assert.fail('should have thrown')
    } catch (error) {
      const message = (error as Error).message
      assert.ok(!message.includes('secret'))
      assert.ok(!message.includes('neon.tech'))
    }
  }
})
