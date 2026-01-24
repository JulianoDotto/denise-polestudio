import Link from 'next/link'

import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [
    userCount,
    categoryCount,
    productCount,
    activeCount,
    inactiveCount,
    classCount,
    ebookCount,
    eventCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.storeSection.count(),
    prisma.item.count({ where: { type: 'PRODUCT' } }),
    prisma.item.count({ where: { type: 'PRODUCT', isActive: true } }),
    prisma.item.count({ where: { type: 'PRODUCT', isActive: false } }),
    prisma.item.count({ where: { type: 'CLASS' } }),
    prisma.item.count({ where: { type: 'EBOOK' } }),
    prisma.item.count({ where: { type: 'EVENT' } }),
  ])

  const latestProducts = await prisma.item.findMany({
    where: { type: 'PRODUCT' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { storeSection: true },
  })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão operacional do catálogo e usuários.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Produtos
          </p>
          <p className="mt-2 text-2xl font-semibold">{productCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Ativos
          </p>
          <p className="mt-2 text-2xl font-semibold">{activeCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Inativos
          </p>
          <p className="mt-2 text-2xl font-semibold">{inactiveCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Categorias
          </p>
          <p className="mt-2 text-2xl font-semibold">{categoryCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Usuários
          </p>
          <p className="mt-2 text-2xl font-semibold">{userCount}</p>
        </div>
        <div className="rounded-2xl border bg-muted/20 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Aulas / Ebooks / Eventos
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {classCount + ebookCount + eventCount}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="text-sm font-semibold">Últimos produtos</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {latestProducts.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.coverUrl || '/images/placeholder.svg'}
                  alt={item.title}
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.storeSection?.title || 'Sem categoria'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <h2 className="text-sm font-semibold">Atalhos rápidos</h2>
          <div className="mt-3 grid gap-2">
            <Link
              href="/admin/products/new"
              className="rounded-2xl border px-3 py-2 text-sm hover:bg-muted"
            >
              Novo produto
            </Link>
            <Link
              href="/admin/categories/new"
              className="rounded-2xl border px-3 py-2 text-sm hover:bg-muted"
            >
              Nova categoria
            </Link>
            <Link
              href="/admin/aulas/new"
              className="rounded-2xl border px-3 py-2 text-sm hover:bg-muted"
            >
              Nova aula
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
