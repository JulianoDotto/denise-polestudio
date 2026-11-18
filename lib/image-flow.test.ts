import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ImageUploadError, persistWithImage, removeStoredImage, type ImageStore } from './admin/image-flow'
import type { ParsedImage } from './admin/image-file'

const BLOB = 'https://a.public.blob.vercel-storage.com/aulas/antiga.webp'
const NEW_BLOB = 'https://a.public.blob.vercel-storage.com/aulas/nova.webp'
const image: ParsedImage = { bytes: new Uint8Array([1, 2, 3]), contentType: 'image/webp', extension: 'webp' }

function fakeStore(url = NEW_BLOB) {
  const uploads: string[] = []
  const removed: string[] = []
  const store: ImageStore & { uploads: string[]; removed: string[] } = {
    uploads,
    removed,
    async upload(folder) {
      uploads.push(folder)
      return url
    },
    async remove(target) {
      removed.push(target)
    },
  }
  return store
}

async function silenceConsoleError<T>(run: (calls: unknown[][]) => Promise<T>) {
  const original = console.error
  const calls: unknown[][] = []
  console.error = (...args: unknown[]) => {
    calls.push(args)
  }
  try {
    return await run(calls)
  } finally {
    console.error = original
  }
}

test('saves without touching the store when no image is sent', async () => {
  const store = fakeStore()
  const result = await persistWithImage(store, { folder: 'aulas', image: null, previousUrl: BLOB, persist: async (url) => url })
  assert.equal(result, null)
  assert.deepEqual(store.uploads, [])
  assert.deepEqual(store.removed, [])
})

test('uploads, saves and then removes the previous blob', async () => {
  const store = fakeStore()
  const steps: string[] = []
  const received: (string | null)[] = []
  await persistWithImage(store, {
    folder: 'aulas',
    image,
    previousUrl: BLOB,
    persist: async (url) => {
      received.push(url)
      steps.push(`removed:${store.removed.length}`)
    },
  })
  assert.deepEqual(steps, ['removed:0'])
  assert.deepEqual(received, [NEW_BLOB])
  assert.deepEqual(store.removed, [BLOB])
})

test('never removes a previous image stored elsewhere', async () => {
  for (const previousUrl of ['data:image/png;base64,AAAA', '/images/a.png', null]) {
    const store = fakeStore()
    await persistWithImage(store, { folder: 'aulas', image, previousUrl, persist: async () => {} })
    assert.deepEqual(store.removed, [])
  }
})

test('removes the new upload when saving fails and keeps the previous one', async () => {
  const store = fakeStore()
  const failure = new Error('db')
  await assert.rejects(
    persistWithImage(store, { folder: 'aulas', image, previousUrl: BLOB, persist: async () => { throw failure } }),
    (error) => error === failure,
  )
  assert.deepEqual(store.removed, [NEW_BLOB])
})

test('rethrows the save error even when removing the new upload fails', async () => {
  const store = fakeStore()
  store.remove = async () => { throw new Error('blob') }
  const failure = new Error('db')
  await silenceConsoleError(async (calls) => {
    await assert.rejects(
      persistWithImage(store, { folder: 'aulas', image, persist: async () => { throw failure } }),
      (error) => error === failure,
    )
    assert.equal(calls.length, 1)
  })
})

test('reports a failed upload without saving', async () => {
  const store = fakeStore()
  store.upload = async () => { throw new Error('blob') }
  let saved = false
  await assert.rejects(
    persistWithImage(store, { folder: 'aulas', image, persist: async () => { saved = true } }),
    ImageUploadError,
  )
  assert.equal(saved, false)
})

test('a failed cleanup does not undo a successful save', async () => {
  const store = fakeStore()
  store.remove = async () => { throw new Error('blob') }
  await silenceConsoleError(async (calls) => {
    assert.equal(await persistWithImage(store, { folder: 'aulas', image, previousUrl: BLOB, persist: async () => 'ok' }), 'ok')
    await removeStoredImage(store, BLOB)
    assert.equal(calls.length, 2)
  })
})

test('removeStoredImage ignores values that are not blob urls', async () => {
  const store = fakeStore()
  for (const value of [null, undefined, '', '/images/a.png', 'data:image/png;base64,AAAA']) {
    await removeStoredImage(store, value)
  }
  assert.deepEqual(store.removed, [])
  await removeStoredImage(store, BLOB)
  assert.deepEqual(store.removed, [BLOB])
})
