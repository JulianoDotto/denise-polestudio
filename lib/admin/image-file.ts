// Pure image rules. Browser code imports from here, so nothing server-only may be imported.

export const IMAGE_UPLOAD_MAX_BYTES = 3 * 1024 * 1024
export const IMAGE_MAX_DIMENSION = 1600
export const IMAGE_QUALITY = 0.82

export type ImageError = 'imageType' | 'imageSize'

export type ParsedImage = {
  bytes: Uint8Array
  contentType: 'image/jpeg' | 'image/png' | 'image/webp'
  extension: 'jpg' | 'png' | 'webp'
}

function startsWith(bytes: Uint8Array, signature: number[], offset = 0) {
  return bytes.length >= offset + signature.length && signature.every((value, i) => bytes[offset + i] === value)
}

export function parseImageBytes(bytes: Uint8Array): ParsedImage | { error: ImageError } {
  let detected: Pick<ParsedImage, 'contentType' | 'extension'> | null = null

  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    detected = { contentType: 'image/jpeg', extension: 'jpg' }
  } else if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    detected = { contentType: 'image/png', extension: 'png' }
  } else if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    detected = { contentType: 'image/webp', extension: 'webp' }
  }

  if (!detected) return { error: 'imageType' }
  if (bytes.length > IMAGE_UPLOAD_MAX_BYTES) return { error: 'imageSize' }
  return { bytes, ...detected }
}

export async function readImageField(
  form: FormData,
  name: string,
): Promise<{ image: ParsedImage | null } | { error: ImageError }> {
  const value = form.get(name)
  if (!(value instanceof File) || value.size === 0) return { image: null }

  const result = parseImageBytes(new Uint8Array(await value.arrayBuffer()))
  if ('error' in result) return result
  return { image: result }
}

export function fitWithin(width: number, height: number, max = IMAGE_MAX_DIMENSION) {
  const longest = Math.max(width, height)
  if (longest <= max) return { width, height }
  const scale = max / longest
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export function isBlobUrl(value: string | null | undefined) {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com')
  } catch {
    return false
  }
}

export function buildImagePath(folder: 'aulas' | 'loja', extension: string, nodeEnv: string | undefined) {
  const base = `${folder}/foto.${extension}`
  return nodeEnv === 'production' ? base : `dev/${base}`
}
