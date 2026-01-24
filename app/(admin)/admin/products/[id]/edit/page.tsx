import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { updateProduct } from '@/lib/admin/actions'
import AdminTabs from '@/components/admin/AdminTabs'
import ProductImagesFields from '@/components/admin/ProductImagesFields'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await prisma.item.findUnique({
    where: { id },
    include: { images: true },
  })

  if (!product || product.type !== 'PRODUCT') return notFound()

  const categories = await prisma.storeSection.findMany({
    orderBy: { title: 'asc' },
  })

  const galleryUrls = product.images
    .map((img) => img.url)
    .filter((url) => url !== product.coverUrl)
    .join('\n')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editar produto</h1>
        <p className="text-sm text-muted-foreground">Atualize os dados do produto.</p>
      </div>

      <form action={updateProduct} className="grid gap-6">
        <input type="hidden" name="id" value={product.id} />
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
                      <input
                        name="title"
                        defaultValue={product.title}
                        required
                        className="w-full rounded-2xl border px-4 py-2 text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Descrição</span>
                      <textarea
                        name="description"
                        defaultValue={product.description || ''}
                        className="min-h-[140px] w-full rounded-2xl border px-4 py-2 text-sm"
                      />
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Categoria</span>
                        <select
                          name="storeSectionId"
                          defaultValue={product.storeSectionId || ''}
                          className="w-full rounded-2xl border px-4 py-2 text-sm"
                        >
                          <option value="">Sem categoria</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2 text-sm">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preço (centavos)</span>
                        <input
                          name="priceCents"
                          type="number"
                          defaultValue={product.priceCents ?? undefined}
                          className="w-full rounded-2xl border px-4 py-2 text-sm"
                        />
                      </label>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="isActive" defaultChecked={product.isActive} className="h-4 w-4" />
                      <span>Produto ativo</span>
                    </label>
                  </div>
                </section>
              ),
            },
            {
              value: 'images',
              label: 'Imagens',
              content: (
                <section className="rounded-3xl border bg-white p-5">
                  <h2 className="text-base font-semibold">Imagens</h2>
                  <div className="mt-4">
                    <ProductImagesFields
                      defaultCoverUrl={product.coverUrl || ''}
                      defaultGalleryUrls={galleryUrls}
                    />
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
                      <input
                        name="slug"
                        defaultValue={product.slug}
                        className="w-full rounded-2xl border px-4 py-2 text-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mensagem WhatsApp</span>
                      <textarea
                        name="whatsappTextTemplate"
                        defaultValue={product.whatsappTextTemplate || ''}
                        className="min-h-[80px] w-full rounded-2xl border px-4 py-2 text-sm"
                      />
                    </label>
                  </div>
                </section>
              ),
            },
          ]}
        />

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
