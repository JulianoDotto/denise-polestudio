const MAX_PRICE_CENTS = 2147483647
const PRICE_PATTERN = /^(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?$/

export function parsePriceToCents(value: string): number | null | 'invalid' {
  const cleaned = value.replace(/R\$/gi, '').replace(/\s+/g, '')
  if (!cleaned) return null

  const match = PRICE_PATTERN.exec(cleaned)
  if (!match) return 'invalid'

  const reais = Number(match[1].replace(/\./g, ''))
  const cents = Number((match[2] ?? '').padEnd(2, '0') || '0')
  const total = reais * 100 + cents
  return Number.isSafeInteger(total) && total <= MAX_PRICE_CENTS ? total : 'invalid'
}

export function parseStorePostDetails(
  form: FormData,
):
  | { data: { description: string | null; priceCents: number | null } }
  | { error: 'price' } {
  const description = String(form.get('description') || '').trim() || null
  const priceCents = parsePriceToCents(String(form.get('price') || ''))
  if (priceCents === 'invalid') return { error: 'price' }
  return { data: { description, priceCents } }
}
