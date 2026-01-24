import type { CartItem } from '@/components/cart/cart-store'
import { formatPrice } from './format'

export function buildWhatsAppUrl(phoneE164: string, message: string) {
  const cleanPhone = phoneE164.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

export function getWhatsAppPhone() {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
    process.env.WHATSAPP_PHONE ||
    ''
  )
}

export function buildCartMessage(items: CartItem[]) {
  const lines: string[] = ['Olá! Quero finalizar meu pedido:']
  let total = 0
  let hasPrice = false

  items.forEach((item) => {
    const label = item.sectionTitle ? `${item.title} (${item.sectionTitle})` : item.title
    const price = item.priceCents ?? null
    if (price !== null && price !== undefined) {
      hasPrice = true
      total += price * item.quantity
    }
    const priceText = price !== null && price !== undefined ? ` - ${formatPrice(price)}` : ''
    lines.push(`• ${label} x${item.quantity}${priceText}`)
  })

  if (hasPrice) {
    lines.push(`Total: ${formatPrice(total)}`)
  }

  return lines.join('\n')
}

export function buildItemMessage(title: string, extra?: string) {
  const base = `Olá, quero comprar ${title}.`
  return extra ? `${base}\n${extra}` : base
}
