import Link from 'next/link'

const banners = [
  { label: 'Aulas', href: '/aulas' },
  { label: 'Loja Pole Dance', href: '/lojas/pole-dance' },
  { label: 'Loja Sex Shop', href: '/lojas/sexshop' },
  { label: 'Ebooks', href: '/ebooks' },
  { label: 'Eventos', href: '/eventos' },
]

export default function Home() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Bem-vinda ao Pole Studio</h1>
        <p className="text-sm text-muted-foreground">
          Selecione uma seção para explorar produtos, aulas, ebooks e eventos.
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
            e bem-estar. O estúdio oferece experiências presenciais e online para todos
            os níveis.
          </p>
        </div>
      </section>

      <section className="grid gap-6">
        <h2 className="text-lg font-semibold">Estúdios</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((studio) => (
            <div key={studio} className="flex flex-col gap-3 rounded-3xl border bg-white p-6">
              <img
                src="/images/placeholder.svg"
                alt={`Estúdio ${studio}`}
                className="h-40 w-full rounded-2xl object-cover"
              />
              <h3 className="text-base font-semibold">Estúdio {studio}</h3>
              <p className="text-sm text-muted-foreground">
                Ambiente pensado para acolher e estimular sua evolução nas artes sensuais.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
