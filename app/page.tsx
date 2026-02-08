import HomeHero from '@/components/site/HomeHero'
import HomeIntro from '@/components/site/HomeIntro'
import ImageLinkCard from '@/components/site/ImageLinkCard'

const helpLinks = [
  { title: 'Aulas', href: '/aulas', imageUrl: '/images/placeholder.svg' },
  { title: 'Loja', href: '/loja', imageUrl: '/images/placeholder.svg' },
  { title: 'E-books', href: '/ebooks', imageUrl: '/images/placeholder.svg' },
  { title: 'Eventos', href: '/eventos', imageUrl: '/images/placeholder.svg' },
  { title: 'Workshops', href: '/workshops', imageUrl: '/images/placeholder.svg' },
  {
    title: 'Produtos digitais',
    href: '/produtos-digitais',
    imageUrl: '/images/placeholder.svg',
  },
]

export default async function Home() {
  return (
    <div className="flex flex-col gap-10 bg-[#FDFDFD] pb-12">
      <HomeHero
        imageUrl="/images/placeholder.svg"
        headline="Liberdade através da sensualidade"
      />

      <HomeIntro
        title="Olá, sou Denise Garcia"
        text="Adicionar bio de Denise Garcia. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      />

      <section className="w-full">
        <div className="overflow-hidden bg-black">
          <img
            src="/images/placeholder.svg"
            alt="Denise Garcia"
            className="h-64 w-full object-cover sm:h-80"
          />
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6">
        <h2 className="text-center font-display text-base uppercase tracking-[0.4em] text-zinc-800">
          Veja como posso te ajudar
        </h2>
        <div className="grid gap-4">
          {helpLinks.map((item) => (
            <ImageLinkCard
              key={item.href}
              href={item.href}
              title={item.title}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
