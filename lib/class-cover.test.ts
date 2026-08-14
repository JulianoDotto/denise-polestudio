import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CLASS_COVER_MAX_BYTES,
  validateClassCoverFile,
  validateClassCoverUrl,
} from './admin/class-cover'

test('accepts the supported image types within the configured limit', () => {
  assert.equal(validateClassCoverFile({ type: 'image/png', size: 1_928_832 }), null)
  assert.equal(validateClassCoverFile({ type: 'image/jpeg', size: 326_468 }), null)
  assert.equal(validateClassCoverFile({ type: 'image/webp', size: 10 }), null)
})

test('rejects unsupported image types and oversized files', () => {
  assert.equal(validateClassCoverFile({ type: 'image/gif', size: 10 }), 'imageType')
  assert.equal(
    validateClassCoverFile({ type: 'image/png', size: CLASS_COVER_MAX_BYTES + 1 }),
    'imageSize',
  )
})

test('validates data URLs on the server and preserves regular existing URLs', () => {
  assert.equal(validateClassCoverUrl('/images/existing.jpg'), null)
  assert.equal(validateClassCoverUrl('https://example.com/image.jpg'), null)
  assert.equal(validateClassCoverUrl('data:image/jpeg;base64,YQ=='), null)
  assert.equal(validateClassCoverUrl('data:image/gif;base64,YQ=='), 'imageType')
  assert.equal(validateClassCoverUrl('data:image/png;base64,not valid'), 'imageData')
})

test('rejects a data URL whose decoded payload exceeds the configured limit', () => {
  const oversized = 'A'.repeat(Math.ceil((CLASS_COVER_MAX_BYTES + 1) * 4 / 3))
  assert.equal(validateClassCoverUrl(`data:image/png;base64,${oversized}`), 'imageSize')
})
