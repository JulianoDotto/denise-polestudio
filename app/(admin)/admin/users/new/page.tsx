import { createUser } from '@/lib/admin/actions'

export default async function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const hasError = sp.error === '1'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Novo usuário</h1>
        <p className="text-sm text-muted-foreground">Crie um usuário para o painel.</p>
      </div>

      {hasError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Preencha os campos obrigatórios.
        </div>
      ) : null}

      <form action={createUser} className="grid gap-4 rounded-3xl border bg-white p-5">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nome</span>
          <input name="name" className="w-full rounded-2xl border px-4 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Senha</span>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</span>
          <select name="role" className="w-full rounded-2xl border px-4 py-2 text-sm">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4" />
          <span>Usuário ativo</span>
        </label>
        <button
          type="submit"
          className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Salvar usuário
        </button>
      </form>
    </div>
  )
}
