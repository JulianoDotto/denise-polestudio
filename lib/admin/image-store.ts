import { del, put } from '@vercel/blob'
import { buildImagePath } from './image-file'
import type { ImageStore } from './image-flow'

export const blobImageStore: ImageStore = {
  async upload(folder, image) {
    const blob = await put(buildImagePath(folder, image.extension, process.env.NODE_ENV), Buffer.from(image.bytes), {
      access: 'public',
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000,
      contentType: image.contentType,
    })
    return blob.url
  },
  async remove(url) {
    await del(url)
  },
}
