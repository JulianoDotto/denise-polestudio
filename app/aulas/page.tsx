import Link from 'next/link'

import { ItemType } from '@prisma/client'
import { getItemsByType } from '@/lib/db'

export default async function AulasPage() {
  const aulas = await getItemsByType(ItemType.CLASS)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Aulas</h1>
      <div className="flex flex-col gap-4">
        {aulas.map((aula) => (
          <Link
            key={aula.id}
            href={`/aulas/${aula.slug}`}
            className="flex items-center justify-between rounded-3xl border bg-white px-6 py-5 text-sm font-semibold uppercase tracking-[0.2em] shadow-sm transition hover:-translate-y-0.5"
          >
            {aula.title}
            <span className="text-xs text-muted-foreground">Ver</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
