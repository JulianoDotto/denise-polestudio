const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatPrice(priceCents?: number | null): string | null {
  if (priceCents === null || priceCents === undefined) return null
  return priceFormatter.format(priceCents / 100)
}
