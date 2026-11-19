import { TEXTS } from '../hardcoded/texts'
import { formatPrice } from './format'

export function buildProductOrderMessage(title: string, priceCents: number | null) {
  const price = formatPrice(priceCents)
  return TEXTS.LOJA_PRODUCT_ORDER_MESSAGE_1.replace('{title}', title).replace(
    '{price}',
    price ? ` (${price})` : '',
  )
}

export function formatProductCount(count: number) {
  return `${count} ${count === 1 ? TEXTS.LOJA_PRODUCT_COUNT_ONE_1 : TEXTS.LOJA_PRODUCT_COUNT_MANY_1}`
}
