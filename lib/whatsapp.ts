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

export function buildItemMessage(title: string, extra?: string) {
  const base = `Olá, quero comprar ${title}.`
  return extra ? `${base}\n${extra}` : base
}
