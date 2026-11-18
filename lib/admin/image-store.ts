import { del, put } from '@vercel/blob'
import { buildImagePath, canRemoveBlob } from './image-file'
import type { ImageStore } from './image-flow'

const environment = () => process.env.VERCEL_ENV ?? process.env.NODE_ENV

export const blobImageStore: ImageStore = {
  async upload(folder, image) {
    const blob = await put(buildImagePath(folder, image.extension, environment()), Buffer.from(image.bytes), {
      access: 'public',
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000,
      contentType: image.contentType,
    })
    return blob.url
  },
  async remove(url) {
    if (!canRemoveBlob(url, environment())) return
    await del(url)
  },
}
