import type { Metadata } from 'next'

import HomeHero from '@/components/site/HomeHero'
import HomeIntro from '@/components/site/HomeIntro'
import HomeLinks, { type HomeLink } from '@/components/site/HomeLinks'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const homeLinks: HomeLink[] = [
  {
    title: TEXTS.HOME_LINK_AULAS_TITLE_1,
    description: TEXTS.HOME_LINK_AULAS_DESC_1,
    href: '/aulas',
    imageUrl: IMAGES.HOME_LINK_AULAS_1,
  },
  {
    title: TEXTS.HOME_LINK_LOJA_TITLE_1,
    description: TEXTS.HOME_LINK_LOJA_DESC_1,
    href: '/loja',
    imageUrl: IMAGES.HOME_LINK_LOJA_1,
  },
  {
    title: TEXTS.HOME_LINK_PRODUTOS_DIGITAIS_TITLE_1,
    description: TEXTS.HOME_LINK_PRODUTOS_DIGITAIS_DESC_1,
    href: '/produtos-digitais',
    imageUrl: IMAGES.HOME_LINK_PRODUTOS_DIGITAIS_1,
  },
  {
    title: TEXTS.HOME_LINK_EVENTOS_TITLE_1,
    description: TEXTS.HOME_LINK_EVENTOS_DESC_1,
    href: '/eventos',
    imageUrl: IMAGES.HOME_LINK_EVENTOS_1,
  },
  {
    title: TEXTS.HOME_LINK_WORKSHOPS_TITLE_1,
    description: TEXTS.HOME_LINK_WORKSHOPS_DESC_1,
    href: '/workshops',
    imageUrl: IMAGES.HOME_LINK_WORKSHOPS_1,
  },
]

export default async function Home() {
  return (
    <div className="pb-6">
      <HomeHero
        imageUrl={IMAGES.HOME_HERO_1}
        headline={TEXTS.HOME_HERO_HEADLINE_1}
        eyebrow={TEXTS.HOME_HERO_EYEBROW_1}
      />

      <HomeIntro
        eyebrow={TEXTS.HOME_INTRO_EYEBROW_1}
        title={TEXTS.HOME_INTRO_TITLE_1}
        text={TEXTS.HOME_INTRO_TEXT_1}
        additionalText={TEXTS.HOME_INTRO_TEXT_2}
        imageUrl={IMAGES.HOME_SECTION_IMAGE_1}
        imageAlt={TEXTS.HOME_INTRO_IMAGE_ALT_1}
      />

      <HomeLinks eyebrow={TEXTS.HOME_HELP_EYEBROW_1} title={TEXTS.HOME_HELP_TITLE_1} links={homeLinks} />
    </div>
  )
}
