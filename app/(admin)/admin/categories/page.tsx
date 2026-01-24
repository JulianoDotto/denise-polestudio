import Link from 'next/link'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import StatusBadge from '@/components/admin/StatusBadge'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteCategory, toggleCategoryStatus } from '@/lib/admin/actions'

const PAGE_SIZE = 10

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  const pageParam = typeof sp.page === 'string' ? Number(sp.page) : 1
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam

  const where: Prisma.StoreSectionWhereInput | undefined = q
    ? {
        OR: [
          { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { slug: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : undefined

  const [categories, total] = await Promise.all([
    prisma.storeSection.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { _count: { select: { items: true } } },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.storeSection.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const success = sp.success === '1'
  const deleted = sp.deleted === '1'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Categorias</h1>
          <p className="text-sm text-muted-foreground">{total} categoria(s)</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Nova categoria
        </Link>
      </div>

      <form className="flex flex-col gap-3 md:flex-row md:items-center" method="get">
        <input
          type="text"
          name="q"
          placeholder="Buscar categoria..."
          defaultValue={q}
          className="w-full rounded-full border px-4 py-2 text-sm md:max-w-sm"
        />
        <button
          type="submit"
          className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em]"
        >
          Buscar
        </button>
      </form>

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Operação realizada com sucesso.
        </div>
      ) : null}
      {deleted ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Categoria removida.
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Nome</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Slug</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Produtos</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Status</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <span>{category.title}</span>
                    {category.isAdult ? (
                      <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white">
                        +18
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                <td className="px-4 py-3">{category._count.items}</td>
                <td className="px-4 py-3">
                  <StatusBadge active={category.isActive} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Editar
                    </Link>
                    <form action={toggleCategoryStatus}>
                      <input type="hidden" name="id" value={category.id} />
                      <input type="hidden" name="next" value={String(!category.isActive)} />
                      <button
                        type="submit"
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {category.isActive ? 'Desativar' : 'Ativar'}
                      </button>
                    </form>
                    <DeleteButton action={deleteCategory} id={category.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1
            const params = new URLSearchParams()
            if (q) params.set('q', q)
            params.set('page', String(pageNumber))
            return (
              <Link
                key={pageNumber}
                href={`/admin/categories?${params.toString()}`}
                className={`rounded-full border px-3 py-1 ${
                  pageNumber === page ? 'bg-muted' : ''
                }`}
              >
                {pageNumber}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
