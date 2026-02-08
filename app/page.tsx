import Link from 'next/link'
import { IMAGES } from '@/hardcoded/images'
import { TEXTS } from '@/hardcoded/texts'

const banners = [
  { label: TEXTS.HOME_LINK_LOJA_TITLE_1, href: '/loja' },
  { label: TEXTS.HOME_LINK_PRODUTOS_DIGITAIS_TITLE_1, href: '/produtos-digitais' },
  { label: TEXTS.HOME_LINK_AULAS_TITLE_1, href: '/aulas' },
  { label: TEXTS.HOME_LINK_WORKSHOPS_TITLE_1, href: '/workshops' },
  { label: TEXTS.HOME_LINK_EVENTOS_TITLE_1, href: '/eventos' },
]

export default async function Home() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
      <section className="soft-card flex flex-col gap-5 p-6 md:p-10">
        <span className="tracking-caps text-[10px] text-white/60">
          {TEXTS.HOME_BADGE_1}
        </span>
        <h1 className="font-display text-3xl uppercase tracking-[0.22em] text-white md:text-4xl">
          {TEXTS.HOME_HERO_TITLE_1}
        </h1>
        <p className="text-sm text-white/70 md:max-w-2xl">
          {TEXTS.HOME_HERO_DESCRIPTION_1}
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
              <span className="text-[10px] text-white/50 group-hover:text-white/80">
                {TEXTS.HOME_BANNER_ACTION_1}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="light-panel grid gap-6 p-6 md:grid-cols-[1fr_2fr]">
        <img
          src={IMAGES.HOME_SECTION_IMAGE_1}
          alt={TEXTS.HOME_SECTION_IMAGE_ALT_1}
          className="h-52 w-full rounded-2xl object-cover"
        />
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{TEXTS.HOME_ABOUT_TITLE_1}</h2>
          <p className="text-sm text-muted-foreground">
            {TEXTS.HOME_ABOUT_TEXT_1}
          </p>
        </div>
      </section>

      <section className="grid gap-6">
        <h2 className="font-display text-lg uppercase tracking-[0.2em] text-white/80">
          {TEXTS.HOME_EXPERIENCES_TITLE_1}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: TEXTS.HOME_EXPERIENCE_1_TITLE_1,
              description: TEXTS.HOME_EXPERIENCE_1_DESC_1,
              imageUrl: IMAGES.HOME_BUTTON_LINKS_1,
            },
            {
              title: TEXTS.HOME_EXPERIENCE_2_TITLE_1,
              description: TEXTS.HOME_EXPERIENCE_2_DESC_1,
              imageUrl: IMAGES.HOME_BUTTON_LINKS_2,
            },
          ].map((experience) => (
            <div key={experience.title} className="soft-card flex flex-col gap-3 p-6">
              <img
                src={experience.imageUrl}
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
