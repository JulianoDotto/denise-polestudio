import assert from 'node:assert/strict'
import test from 'node:test'

import { getPostgresConnectionString } from './postgres'

test('makes legacy verified SSL modes explicit', () => {
  for (const sslMode of ['prefer', 'require', 'verify-ca']) {
    const result = new URL(getPostgresConnectionString(
      `postgresql://user:password@database.example.com/app?sslmode=${sslMode}&channel_binding=require`,
    ))

    assert.equal(result.searchParams.get('sslmode'), 'verify-full')
    assert.equal(result.searchParams.get('channel_binding'), 'require')
  }
})

test('preserves explicit local and verified SSL policies', () => {
  for (const sslMode of ['disable', 'no-verify', 'verify-full']) {
    const result = new URL(getPostgresConnectionString(
      `postgresql://user:password@localhost/app?sslmode=${sslMode}`,
    ))

    assert.equal(result.searchParams.get('sslmode'), sslMode)
  }
})

test('preserves a connection URL without an SSL policy', () => {
  const result = new URL(
    getPostgresConnectionString('postgresql://user:password@localhost/app'),
  )

  assert.equal(result.searchParams.has('sslmode'), false)
})

test('rejects an invalid URL without including its value in the error', () => {
  const invalidUrl = 'not-a-url-with-secret'

  assert.throws(
    () => getPostgresConnectionString(invalidUrl),
    (error: Error) => {
      assert.equal(error.message, 'Invalid PostgreSQL connection URL')
      assert.equal(error.message.includes(invalidUrl), false)
      return true
    },
  )
})

test('rejects a URL with a non-PostgreSQL protocol', () => {
  assert.throws(
    () => getPostgresConnectionString('https://database.example.com/app'),
    { message: 'Invalid PostgreSQL connection URL' },
  )
})
