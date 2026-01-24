import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { updateClass } from '@/lib/admin/actions'
import AdminTabs from '@/components/admin/AdminTabs'
import ImageUrlField from '@/components/admin/ImageUrlField'

export default async function EditClassPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await prisma.item.findUnique({ where: { id } })
  if (!item || item.type !== 'CLASS') return notFound()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar aula</h1>
        <p className="text-sm text-muted-foreground">Atualize os dados da aula.</p>
      </div>

      <form action={updateClass} className="grid gap-6">
        <input type="hidden" name="id" value={item.id} />
        <AdminTabs
          defaultValue="info"
          tabs={[
            {
              value: 'info',
              label: 'Informações',
              content: (
                <section className="rounded-3xl border bg-white p-5">
                  <h2 className="text-base font-semibold">Informações</h2>
                  <div className="mt-4 grid gap-4">
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nome</span>
                      <input name="title" defaultValue={item.title} required className="w-full rounded-2xl border px-4 py-2 text-sm" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Descrição</span>
                      <textarea name="description" defaultValue={item.description || ''} className="min-h-[140px] w-full rounded-2xl border px-4 py-2 text-sm" />
                    </label>
                    <ImageUrlField name="coverUrl" label="Imagem (URL)" defaultValue={item.coverUrl || ''} />
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isActive" defaultChecked={item.isActive} className="h-4 w-4" />
                      <span>Aula ativa</span>
                    </label>
                  </div>
                </section>
              ),
            },
            {
              value: 'links',
              label: 'Links',
              content: (
                <section className="rounded-3xl border bg-white p-5">
                  <h2 className="text-base font-semibold">Links</h2>
                  <div className="mt-4 grid gap-4">
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hotmart URL</span>
                      <input name="hotmartUrl" defaultValue={item.hotmartUrl || ''} className="w-full rounded-2xl border px-4 py-2 text-sm" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Agenda online URL</span>
                      <input name="scheduleOnlineUrl" defaultValue={item.scheduleOnlineUrl || ''} className="w-full rounded-2xl border px-4 py-2 text-sm" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Agenda presencial URL</span>
                      <input name="schedulePresentialUrl" defaultValue={item.schedulePresentialUrl || ''} className="w-full rounded-2xl border px-4 py-2 text-sm" />
                    </label>
                  </div>
                </section>
              ),
            },
            {
              value: 'seo',
              label: 'SEO',
              content: (
                <section className="rounded-3xl border bg-white p-5">
                  <h2 className="text-base font-semibold">SEO</h2>
                  <div className="mt-4 grid gap-4">
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Slug</span>
                      <input name="slug" defaultValue={item.slug} className="w-full rounded-2xl border px-4 py-2 text-sm" />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mensagem WhatsApp</span>
                      <textarea name="whatsappTextTemplate" defaultValue={item.whatsappTextTemplate || ''} className="min-h-[80px] w-full rounded-2xl border px-4 py-2 text-sm" />
                    </label>
                  </div>
                </section>
              ),
            },
          ]}
        />

        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground">
          Salvar alterações
        </button>
      </form>
    </div>
  )
}
