import Link from 'next/link'

import CartButton from '@/components/cart/CartButton'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export default async function Header() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Link
            href="/lojas"
            className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
          >
            Menu
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
            >
              Admin
            </Link>
          ) : null}
          {user ? (
            <Link
              href="/logout"
              className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
            >
              Sair
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
            >
              Entrar
            </Link>
          )}
        </div>
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.4em]">
          Denise
        </Link>
        <CartButton />
      </div>
    </header>
  )
}
