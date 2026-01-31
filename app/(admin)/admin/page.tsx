import Link from 'next/link'

import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [
    userCount,
    classCount,
    ebookCount,
    eventCount,
    workshopCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.item.count({ where: { type: 'CLASS' } }),
    prisma.item.count({ where: { type: 'EBOOK' } }),
    prisma.item.count({ where: { type: 'EVENT' } }),
    prisma.item.count({ where: { type: 'WORKSHOP' } }),
  ])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão operacional do catálogo e usuários.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Usuários
          </p>
          <p className="mt-2 text-2xl font-semibold">{userCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Aulas
          </p>
          <p className="mt-2 text-2xl font-semibold">{classCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Produtos digitais
          </p>
          <p className="mt-2 text-2xl font-semibold">{ebookCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Eventos
          </p>
          <p className="mt-2 text-2xl font-semibold">{eventCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Workshops
          </p>
          <p className="mt-2 text-2xl font-semibold">{workshopCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Atalhos rápidos</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <Link
            href="/admin/aulas/new"
            className="rounded-2xl border px-3 py-2 text-sm hover:bg-muted"
          >
            Nova aula
          </Link>
          <Link
            href="/admin/produtos-digitais/new"
            className="rounded-2xl border px-3 py-2 text-sm hover:bg-muted"
          >
            Novo produto digital
          </Link>
          <Link
            href="/admin/eventos/new"
            className="rounded-2xl border px-3 py-2 text-sm hover:bg-muted"
          >
            Novo evento
          </Link>
          <Link
            href="/admin/workshops/new"
            className="rounded-2xl border px-3 py-2 text-sm hover:bg-muted"
          >
            Novo workshop
          </Link>
        </div>
      </div>
    </div>
  )
}
