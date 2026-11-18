import assert from 'node:assert/strict'
import test from 'node:test'

import {
  IMAGE_UPLOAD_MAX_BYTES,
  buildImagePath,
  fitWithin,
  isBlobUrl,
  parseImageBytes,
  readImageField,
} from './admin/image-file'

const JPEG = [0xff, 0xd8, 0xff, 0xe0]
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const WEBP = [0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50]

function expectImage(header: number[]) {
  const result = parseImageBytes(new Uint8Array(header))
  if ('error' in result) assert.fail(`unexpected error: ${result.error}`)
  return result
}

test('recognises images by their bytes', () => {
  assert.equal(expectImage(JPEG).contentType, 'image/jpeg')
  assert.equal(expectImage(PNG).extension, 'png')
  assert.equal(expectImage(WEBP).contentType, 'image/webp')
})

test('rejects files that only pretend to be images', () => {
  assert.deepEqual(parseImageBytes(new TextEncoder().encode('GIF89a fake')), { error: 'imageType' })
  assert.deepEqual(parseImageBytes(new Uint8Array([0x52, 0x49, 0x46, 0x46])), { error: 'imageType' })
})

test('enforces the size limit', () => {
  const atLimit = new Uint8Array(IMAGE_UPLOAD_MAX_BYTES); atLimit.set(JPEG)
  const over = new Uint8Array(IMAGE_UPLOAD_MAX_BYTES + 1); over.set(JPEG)
  assert.ok(!('error' in parseImageBytes(atLimit)))
  assert.deepEqual(parseImageBytes(over), { error: 'imageSize' })
})

test('an empty file input means no new image', async () => {
  const form = new FormData()
  form.set('coverFile', new File([], ''))
  assert.deepEqual(await readImageField(form, 'coverFile'), { image: null })
  assert.deepEqual(await readImageField(new FormData(), 'coverFile'), { image: null })
})

test('fits the longest side and never enlarges', () => {
  assert.deepEqual(fitWithin(4000, 3000), { width: 1600, height: 1200 })
  assert.deepEqual(fitWithin(3000, 4000), { width: 1200, height: 1600 })
  assert.deepEqual(fitWithin(800, 600), { width: 800, height: 600 })
  assert.deepEqual(fitWithin(10000, 1), { width: 1600, height: 1 })
})

test('only recognises public blob urls', () => {
  assert.equal(isBlobUrl('https://abc.public.blob.vercel-storage.com/aulas/a.webp'), true)
  assert.equal(isBlobUrl('https://evil.com/abc.public.blob.vercel-storage.com'), false)
  assert.equal(isBlobUrl('data:image/png;base64,AAAA'), false)
  assert.equal(isBlobUrl('/images/a.png'), false)
  assert.equal(isBlobUrl(null), false)
})

test('keeps development files apart', () => {
  assert.equal(buildImagePath('aulas', 'webp', 'production'), 'aulas/foto.webp')
  assert.equal(buildImagePath('loja', 'jpg', 'development'), 'dev/loja/foto.jpg')
  assert.equal(buildImagePath('loja', 'jpg', undefined), 'dev/loja/foto.jpg')
})
