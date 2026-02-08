import HomeHero from '@/components/site/HomeHero'
import HomeIntro from '@/components/site/HomeIntro'
import ImageLinkCard from '@/components/site/ImageLinkCard'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

const helpLinks = [
  { title: TEXTS.HOME_LINK_AULAS_TITLE_1, href: '/aulas', imageUrl: IMAGES.HOME_BUTTON_LINKS_1 },
  { title: TEXTS.HOME_LINK_LOJA_TITLE_1, href: '/loja', imageUrl: IMAGES.HOME_BUTTON_LINKS_2 },
  { title: TEXTS.HOME_LINK_EBOOKS_TITLE_1, href: '/ebooks', imageUrl: IMAGES.HOME_BUTTON_LINKS_3 },
  { title: TEXTS.HOME_LINK_EVENTOS_TITLE_1, href: '/eventos', imageUrl: IMAGES.HOME_BUTTON_LINKS_4 },
  { title: TEXTS.HOME_LINK_WORKSHOPS_TITLE_1, href: '/workshops', imageUrl: IMAGES.HOME_BUTTON_LINKS_5 },
  {
    title: TEXTS.HOME_LINK_PRODUTOS_DIGITAIS_TITLE_1,
    href: '/produtos-digitais',
    imageUrl: IMAGES.HOME_BUTTON_LINKS_6,
  },
]

export default async function Home() {
  return (
    <div className="pb-12">
      <HomeHero imageUrl={IMAGES.HOME_HERO_1} headline={TEXTS.HOME_HERO_HEADLINE_1} />

      <HomeIntro title={TEXTS.HOME_INTRO_TITLE_1} text={TEXTS.HOME_INTRO_TEXT_1} />

      <section className="w-full">
        <div className="overflow-hidden bg-black">
          <img
            src={IMAGES.HOME_SECTION_IMAGE_1}
            alt={TEXTS.HOME_INTRO_IMAGE_ALT_1}
            className="h-64 w-full object-cover sm:h-80"
          />
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
        <h2 className="text-center font-display text-base uppercase tracking-[0.4em] text-white">
          {TEXTS.HOME_HELP_TITLE_1}
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
