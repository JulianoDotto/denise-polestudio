import { createCategory } from '@/lib/admin/actions'

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const hasError = sp.error === '1'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Nova categoria</h1>
        <p className="text-sm text-muted-foreground">Organize o catálogo por categorias.</p>
      </div>

      {hasError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Preencha os campos obrigatórios.
        </div>
      ) : null}

      <form action={createCategory} className="grid gap-4 rounded-3xl border bg-white p-5">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nome</span>
          <input
            name="title"
            required
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Slug</span>
          <input
            name="slug"
            placeholder="gerado automaticamente"
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Banner URL</span>
          <input
            name="bannerUrl"
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4" />
            <span>Categoria ativa</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isAdult" className="h-4 w-4" />
            <span>Conteúdo +18</span>
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ordem de exibição</span>
          <input
            name="order"
            type="number"
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Salvar categoria
        </button>
      </form>
    </div>
  )
}
