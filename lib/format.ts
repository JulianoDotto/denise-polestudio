export function formatPrice(priceCents?: number | null) {
  if (priceCents === null || priceCents === undefined) return null
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceCents / 100)
}

export function formatDateShort(date?: Date | string | null) {
  if (!date) return null
  const value = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(value.getTime())) return null
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value)
}
