import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { updateUser } from '@/lib/admin/actions'

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar usuário</h1>
        <p className="text-sm text-muted-foreground">Atualize permissões e status.</p>
      </div>

      <form action={updateUser} className="grid gap-4 rounded-3xl border bg-white p-5">
        <input type="hidden" name="id" value={user.id} />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nome</span>
          <input
            name="name"
            defaultValue={user.name || ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</span>
          <input
            type="email"
            name="email"
            defaultValue={user.email}
            required
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</span>
          <select
            name="role"
            defaultValue={user.role}
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={user.isActive} className="h-4 w-4" />
          <span>Usuário ativo</span>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nova senha</span>
          <input
            type="password"
            name="password"
            placeholder="Deixe em branco para manter"
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  )
}
