import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import StatusBadge from '@/components/admin/StatusBadge'
import DeleteButton from '@/components/admin/DeleteButton'
import { deleteEvent, toggleEventStatus } from '@/lib/admin/actions'
import { formatDateShort } from '@/lib/format'

const PAGE_SIZE = 10

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  const pageParam = typeof sp.page === 'string' ? Number(sp.page) : 1
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const status = typeof sp.status === 'string' ? sp.status : 'all'
  const time = typeof sp.time === 'string' ? sp.time : 'all'

  const where: any = { type: 'EVENT' }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (status === 'active') where.isActive = true
  if (status === 'inactive') where.isActive = false
  if (time !== 'all') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    where.eventDate = time === 'upcoming' ? { gte: today } : { lt: today }
  }

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: [{ eventDate: 'asc' }, { createdAt: 'desc' }],
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.item.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const success = sp.success === '1'
  const deleted = sp.deleted === '1'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Eventos</h1>
          <p className="text-sm text-muted-foreground">{total} evento(s)</p>
        </div>
        <Link
          href="/admin/eventos/new"
          className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Novo evento
        </Link>
      </div>

      <form className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]" method="get">
        <input
          type="text"
          name="q"
          placeholder="Buscar evento..."
          defaultValue={q}
          className="rounded-full border px-4 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-full border px-4 py-2 text-sm"
        >
          <option value="all">Status: todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
        <select
          name="time"
          defaultValue={time}
          className="rounded-full border px-4 py-2 text-sm"
        >
          <option value="all">Todos os períodos</option>
          <option value="upcoming">Futuros</option>
          <option value="past">Passados</option>
        </select>
        <button
          type="submit"
          className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em]"
        >
          Filtrar
        </button>
      </form>

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Operação realizada com sucesso.
        </div>
      ) : null}
      {deleted ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Evento removido.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border bg-white p-4">
            <div className="flex gap-4">
              <img
                src={item.coverUrl || '/images/placeholder.svg'}
                alt={item.title}
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-semibold">{item.title}</h2>
                  <StatusBadge active={item.isActive} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateShort(item.eventDate) || item.description || 'Sem descrição'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/admin/eventos/${item.id}/edit`}
                className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]"
              >
                Editar
              </Link>
              <form action={toggleEventStatus}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="next" value={String(!item.isActive)} />
                <button
                  type="submit"
                  className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]"
                >
                  {item.isActive ? 'Desativar' : 'Ativar'}
                </button>
              </form>
              <DeleteButton action={deleteEvent} id={item.id} />
            </div>
          </div>
        ))}
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
            if (status) params.set('status', status)
            if (time) params.set('time', time)
            params.set('page', String(pageNumber))
            return (
              <Link
                key={pageNumber}
                href={`/admin/eventos?${params.toString()}`}
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
