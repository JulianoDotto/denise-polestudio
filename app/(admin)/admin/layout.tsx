import Link from 'next/link'

import { requireAdmin } from '@/lib/auth/requireAdmin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-sm font-semibold uppercase tracking-[0.3em]">
            Admin
          </Link>
          <Link href="/logout" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Sair
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-6 md:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-2 rounded-3xl border bg-background p-4 text-sm">
          <Link href="/admin" className="rounded-2xl px-3 py-2 hover:bg-muted">
            Dashboard
          </Link>
          <div className="mt-2 border-t pt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Catálogo
          </div>
          <Link href="/admin/aulas" className="rounded-2xl px-3 py-2 hover:bg-muted">
            Aulas
          </Link>
          <Link
            href="/admin/workshops"
            className="rounded-2xl px-3 py-2 hover:bg-muted"
          >
            Workshops
          </Link>
          <Link
            href="/admin/produtos-digitais"
            className="rounded-2xl px-3 py-2 hover:bg-muted"
          >
            Produtos digitais
          </Link>
          <Link href="/admin/eventos" className="rounded-2xl px-3 py-2 hover:bg-muted">
            Eventos
          </Link>
          <div className="mt-2 border-t pt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Usuários
          </div>
          <Link href="/admin/users" className="rounded-2xl px-3 py-2 hover:bg-muted">
            Gestão de usuários
          </Link>
        </aside>

        <section className="rounded-3xl border bg-background p-6">{children}</section>
      </div>
    </div>
  )
}
