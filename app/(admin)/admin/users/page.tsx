import Link from 'next/link'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import StatusBadge from '@/components/admin/StatusBadge'
import { toggleUserRole, toggleUserStatus } from '@/lib/admin/actions'

const PAGE_SIZE = 10

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const q = typeof sp.q === 'string' ? sp.q : ''
  const pageParam = typeof sp.page === 'string' ? Number(sp.page) : 1
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
  const error = typeof sp.error === 'string' ? sp.error : ''

  const where: Prisma.UserWhereInput | undefined = q
    ? {
        OR: [
          { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : undefined

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const success = sp.success === '1'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-sm text-muted-foreground">{total} usuário(s)</p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Novo usuário
        </Link>
      </div>

      <form className="flex flex-col gap-3 md:flex-row md:items-center" method="get">
        <input
          type="text"
          name="q"
          placeholder="Buscar usuário..."
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
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error === 'primary'
            ? 'Não é permitido alterar o admin principal.'
            : 'Não é permitido remover seu próprio acesso.'}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Nome</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Email</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Role</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Status</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.2em]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3 font-medium">{user.name || '-'}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge active={user.isActive} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      Editar
                    </Link>
                    <form action={toggleUserRole}>
                      <input type="hidden" name="id" value={user.id} />
                      <input
                        type="hidden"
                        name="next"
                        value={user.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                      />
                      <button
                        type="submit"
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {user.role === 'ADMIN' ? 'Virar USER' : 'Virar ADMIN'}
                      </button>
                    </form>
                    <form action={toggleUserStatus}>
                      <input type="hidden" name="id" value={user.id} />
                      <input type="hidden" name="next" value={String(!user.isActive)} />
                      <button
                        type="submit"
                        className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {user.isActive ? 'Bloquear' : 'Ativar'}
                      </button>
                    </form>
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
                href={`/admin/users?${params.toString()}`}
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
