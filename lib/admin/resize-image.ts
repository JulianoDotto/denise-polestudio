import { fitWithin, IMAGE_QUALITY, IMAGE_UPLOAD_MAX_BYTES } from './image-file'

export class ImageTooLargeError extends Error {
  constructor() {
    super('Image is too large')
    this.name = 'ImageTooLargeError'
  }
}

const EXTENSIONS: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg' }

function toBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, IMAGE_QUALITY))
}

export async function resizeImageFile(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    const { width, height } = fitWithin(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas is not available')

    context.drawImage(bitmap, 0, 0, width, height)
    let blob = await toBlob(canvas, 'image/webp')
    if (blob?.type !== 'image/webp') {
      // Browsers without WebP encoding fall back to PNG, so redraw on white and use JPEG.
      context.fillStyle = '#fff'
      context.fillRect(0, 0, width, height)
      context.drawImage(bitmap, 0, 0, width, height)
      blob = await toBlob(canvas, 'image/jpeg')
    }
    if (!blob) throw new Error('Image could not be encoded')
    if (blob.size > IMAGE_UPLOAD_MAX_BYTES) throw new ImageTooLargeError()

    const base = file.name.replace(/\.[^./\\]+$/, '') || 'foto'
    return new File([blob], `${base}.${EXTENSIONS[blob.type] ?? 'jpg'}`, { type: blob.type })
  } finally {
    bitmap.close()
  }
}
