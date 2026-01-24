import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { updateCategory } from '@/lib/admin/actions'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await prisma.storeSection.findUnique({ where: { id } })
  if (!category) return notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar categoria</h1>
        <p className="text-sm text-muted-foreground">Atualize os dados da categoria.</p>
      </div>

      <form action={updateCategory} className="grid gap-4 rounded-3xl border bg-white p-5">
        <input type="hidden" name="id" value={category.id} />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nome</span>
          <input
            name="title"
            defaultValue={category.title}
            required
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Slug</span>
          <input
            name="slug"
            defaultValue={category.slug}
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Banner URL</span>
          <input
            name="bannerUrl"
            defaultValue={category.bannerUrl || ''}
            className="w-full rounded-2xl border px-4 py-2 text-sm"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={category.isActive} className="h-4 w-4" />
            <span>Categoria ativa</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isAdult" defaultChecked={category.isAdult} className="h-4 w-4" />
            <span>Conteúdo +18</span>
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ordem de exibição</span>
          <input
            name="order"
            type="number"
            defaultValue={category.order}
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
