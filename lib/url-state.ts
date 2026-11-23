// Sets or removes one query param and returns the new query string ('' when empty).
export function withSearchParam(search: string, key: string, value: string | null): string {
  const params = new URLSearchParams(search)
  if (value === null) params.delete(key)
  else params.set(key, value)
  const query = params.toString()
  return query ? `?${query}` : ''
}

// The Vercel Blob host for a store id like "store_AbC123", used to preconnect to the photos.
export function getBlobOrigin(storeId: string | undefined): string | null {
  const match = storeId?.match(/^store_([A-Za-z0-9]+)$/)
  if (!match) return null
  return `https://${match[1].toLowerCase()}.public.blob.vercel-storage.com`
}
