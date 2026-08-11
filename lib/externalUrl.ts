export function normalizeExternalUrl(value: string) {
  const url = value.trim()
  if (!url) return ''

  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}
