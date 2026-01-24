'use client'

import { useMemo } from 'react'
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from './cart-store'
import { buildCartMessage, buildWhatsAppUrl, getWhatsAppPhone } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/format'

export default function CartSheet() {
  const {
    items,
    isOpen,
    closeCart,
    openCart,
    inc,
    dec,
    remove,
  } = useCartStore()

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.priceCents !== null && item.priceCents !== undefined) {
        return sum + item.priceCents * item.quantity
      }
      return sum
    }, 0)
  }, [items])

  const phone = getWhatsAppPhone()

  const handleCheckout = () => {
    if (!items.length || !phone) return
    const message = buildCartMessage(items)
    const url = buildWhatsAppUrl(phone, message)
    window.location.href = url
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Menu Carrinho
          </SheetTitle>
        </SheetHeader>
        <Separator />

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Seu carrinho está vazio.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border p-4"
              >
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  {item.sectionTitle ? (
                    <p className="text-xs text-muted-foreground">{item.sectionTitle}</p>
                  ) : null}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => dec(item.id)}>
                      <Minus />
                    </Button>
                    <span className="min-w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => inc(item.id)}>
                      <Plus />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.priceCents !== null && item.priceCents !== undefined ? (
                      <span className="text-sm font-semibold">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    ) : null}
                    <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Separator />
        {items.length > 0 && total > 0 ? (
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={closeCart}>
            Fechar Carrinho
          </Button>
          <Button onClick={handleCheckout} disabled={!items.length || !phone}>
            Finalizar no WhatsApp
          </Button>
          {!phone ? (
            <p className="text-xs text-muted-foreground">
              Configure o WhatsApp em `.env` para ativar o botão.
            </p>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
