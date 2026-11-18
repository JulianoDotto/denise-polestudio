import { isBlobUrl, type ParsedImage } from './image-file'

export type ImageFolder = 'aulas' | 'loja'

export type ImageStore = {
  upload(folder: ImageFolder, image: ParsedImage): Promise<string>
  remove(url: string): Promise<void>
}

export class ImageUploadError extends Error {
  constructor(options?: { cause?: unknown }) {
    super('Image upload failed', options)
    this.name = 'ImageUploadError'
  }
}

async function removeQuietly(store: ImageStore, url: string) {
  try {
    await store.remove(url)
  } catch (error) {
    console.error('Failed to remove image from storage', url, error)
  }
}

export async function removeStoredImage(store: ImageStore, url: string | null | undefined) {
  if (!url || !isBlobUrl(url)) return
  await removeQuietly(store, url)
}

export async function persistWithImage<T>(
  store: ImageStore,
  input: {
    folder: ImageFolder
    image: ParsedImage | null
    previousUrl?: string | null
    persist(newUrl: string | null): Promise<T>
  },
): Promise<T> {
  if (!input.image) return input.persist(null)

  let newUrl: string
  try {
    newUrl = await store.upload(input.folder, input.image)
  } catch (error) {
    throw new ImageUploadError({ cause: error })
  }

  let result: T
  try {
    result = await input.persist(newUrl)
  } catch (error) {
    await removeQuietly(store, newUrl)
    throw error
  }

  await removeStoredImage(store, input.previousUrl)
  return result
}
