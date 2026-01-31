import Link from 'next/link'

const banners = [
  { label: 'Loja', href: '/loja' },
  { label: 'Produtos digitais', href: '/produtos-digitais' },
  { label: 'Aulas', href: '/aulas' },
  { label: 'Workshops', href: '/workshops' },
  { label: 'Eventos', href: '/eventos' },
]

export default async function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Bem-vinda ao universo da Denise Garcia</h1>
        <p className="text-sm text-muted-foreground">
          Encontre aulas, workshops, eventos e produtos digitais com atendimento direto pelo WhatsApp.
        </p>
        <div className="flex flex-col gap-3">
          {banners.map((banner) => (
            <Link
              key={banner.label}
              href={banner.href}
              className="flex items-center justify-between rounded-3xl border bg-white px-6 py-5 text-sm font-semibold uppercase tracking-[0.2em] shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
            >
              {banner.label}
              <span className="text-xs text-muted-foreground">Ver</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border bg-white p-6 md:grid-cols-[1fr_2fr]">
        <img
          src="/images/placeholder.svg"
          alt="Sobre Denise"
          className="h-52 w-full rounded-2xl object-cover"
        />
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Sobre Denise Garcia</h2>
          <p className="text-sm text-muted-foreground">
            Professora e bailarina com foco em empoderamento feminino, expressão corporal
            e bem-estar. Experiências presenciais e online para todos os níveis.
          </p>
        </div>
      </section>

      <section className="grid gap-6">
        <h2 className="text-lg font-semibold">Experiências</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Aulas personalizadas',
              description:
                'Treinos presenciais e online com foco na sua evolução e segurança.',
            },
            {
              title: 'Workshops temáticos',
              description:
                'Encontros intensivos para explorar técnicas, sensualidade e expressão.',
            },
          ].map((experience) => (
            <div key={experience.title} className="flex flex-col gap-3 rounded-3xl border bg-white p-6">
              <img
                src="/images/placeholder.svg"
                alt={experience.title}
                className="h-40 w-full rounded-2xl object-cover"
              />
              <h3 className="text-base font-semibold">{experience.title}</h3>
              <p className="text-sm text-muted-foreground">{experience.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
