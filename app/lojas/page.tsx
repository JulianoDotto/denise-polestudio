import Link from 'next/link'

import { getStoreSections } from '@/lib/db'

export default async function LojasPage() {
  const sections = await getStoreSections()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Lojas</h1>
      <p className="text-sm text-muted-foreground">
        Escolha a loja que deseja visitar. A seção sexshop exige confirmação de maioridade.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`/lojas/${section.slug}`}
            className="flex flex-col gap-4 rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
          >
            <img
              src={section.bannerUrl || '/images/placeholder.svg'}
              alt={section.title}
              className="h-40 w-full rounded-2xl object-cover"
            />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">{section.title}</h2>
                {section.isAdult ? (
                  <p className="text-xs text-muted-foreground">Conteúdo +18</p>
                ) : null}
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ver</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
