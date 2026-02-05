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
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
      <section className="soft-card flex flex-col gap-5 p-6 md:p-10">
        <span className="tracking-caps text-[10px] text-white/60">Studio</span>
        <h1 className="font-display text-3xl uppercase tracking-[0.22em] text-white md:text-4xl">
          Bem-vinda ao universo da Denise Garcia
        </h1>
        <p className="text-sm text-white/70 md:max-w-2xl">
          Encontre aulas, workshops, eventos e produtos digitais com atendimento direto pelo WhatsApp.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {banners.map((banner) => (
            <Link
              key={banner.label}
              href={banner.href}
              className="group flex items-center justify-between rounded-3xl border border-white/15 bg-white/5 px-6 py-5 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              <span className="font-display text-sm tracking-[0.35em] text-white">
                {banner.label}
              </span>
              <span className="text-[10px] text-white/50 group-hover:text-white/80">Ver</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="light-panel grid gap-6 p-6 md:grid-cols-[1fr_2fr]">
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
        <h2 className="font-display text-lg uppercase tracking-[0.2em] text-white/80">
          Experiências
        </h2>
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
            <div key={experience.title} className="soft-card flex flex-col gap-3 p-6">
              <img
                src="/images/placeholder.svg"
                alt={experience.title}
                className="h-40 w-full rounded-2xl object-cover"
              />
              <h3 className="font-display text-base uppercase tracking-[0.2em] text-white">
                {experience.title}
              </h3>
              <p className="text-sm text-white/70">{experience.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
