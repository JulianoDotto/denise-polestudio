export const CLASS_COVER_MAX_BYTES = 2 * 1024 * 1024

export const CLASS_COVER_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

type ClassCoverError = 'imageType' | 'imageSize' | 'imageData'

export function validateClassCoverFile(
  file: Pick<File, 'size' | 'type'>,
): ClassCoverError | null {
  if (
    !CLASS_COVER_ACCEPTED_TYPES.includes(
      file.type as (typeof CLASS_COVER_ACCEPTED_TYPES)[number],
    )
  ) {
    return 'imageType'
  }

  if (file.size > CLASS_COVER_MAX_BYTES) {
    return 'imageSize'
  }

  return null
}

export function validateClassCoverUrl(value: string | null): ClassCoverError | null {
  if (!value || !value.startsWith('data:')) return null

  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value)
  if (!match) return 'imageData'

  const [, mimeType, encoded] = match
  if (
    !CLASS_COVER_ACCEPTED_TYPES.includes(
      mimeType as (typeof CLASS_COVER_ACCEPTED_TYPES)[number],
    )
  ) {
    return 'imageType'
  }

  const padding = encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0
  const decodedBytes = (encoded.length * 3) / 4 - padding
  return decodedBytes > CLASS_COVER_MAX_BYTES ? 'imageSize' : null
}
