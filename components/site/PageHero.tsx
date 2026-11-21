import Link from 'next/link'
import { TEXTS } from '@/hardcoded/texts'

type PageHeroProps = {
  title: string
  eyebrow?: string
  // Position of the page in the home links, shown as "02 / 05".
  index?: number
  total?: number
  // Without a photo the hero is set in type on the wine ground.
  imageUrl?: string
  imagePosition?: React.CSSProperties['objectPosition']
}

const pad = (value: number) => String(value).padStart(2, '0')

// The inner pages in the order of the home links, listed in the hero.
const PAGES = [
  { href: '/aulas', label: TEXTS.HOME_LINK_AULAS_TITLE_1 },
  { href: '/loja', label: TEXTS.HOME_LINK_LOJA_TITLE_1 },
  { href: '/produtos-digitais', label: TEXTS.HOME_LINK_PRODUTOS_DIGITAIS_TITLE_1 },
  { href: '/eventos', label: TEXTS.HOME_LINK_EVENTOS_TITLE_1 },
  { href: '/workshops', label: TEXTS.HOME_LINK_WORKSHOPS_TITLE_1 },
]

// Fine film grain over the wine ground.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

// The studio name set large in outline, as a watermark behind the type hero.
function NameMark() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[20%] select-none @container sm:top-[19%]">
      <p className="mx-auto max-w-5xl whitespace-nowrap px-4 font-display text-[min(10.2cqw,6rem)] uppercase leading-none tracking-[0.06em] text-transparent [-webkit-text-stroke:1px_rgba(243,236,226,0.2)]">
        Denise Garcia
      </p>
    </div>
  )
}

export default function PageHero({ imageUrl, title, eyebrow, index, total, imagePosition }: PageHeroProps) {
  if (!imageUrl) {
    const progress = index && total ? (index / total) * 100 : 0
    return (
      <section className="relative isolate h-[300px] overflow-hidden bg-[linear-gradient(165deg,#6e2235_0%,#5a1a2a_40%,#2a0b13_100%)] text-marfim sm:h-[320px]">
        {/* Light: a soft marfim glow top left, a rosé glow low on the right. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-marfim/[0.07] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#c97a8c]/[0.14] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        {/* Column hairlines at thirds of the content width. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="mx-auto grid h-full max-w-5xl grid-cols-3 px-4">
            <span />
            <span className="border-l border-marfim/[0.06]" />
            <span className="border-l border-marfim/[0.06]" />
          </div>
        </div>
        <NameMark />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-between px-4 pb-8 pt-8">
          <div className="flex items-center justify-between text-[11px] tracking-[0.32em] text-marfim/60">
            {index && total ? (
              <p aria-hidden="true" className="flex items-center gap-3">
                <span className="text-marfim">{pad(index)}</span>
                <span className="h-px w-10 bg-marfim/30" />
                <span>{pad(total)}</span>
              </p>
            ) : (
              <span />
            )}
            {index ? (
              <nav aria-label={TEXTS.PAGE_HERO_NAV_ARIA_1} className="hidden md:block">
                <ul className="flex items-center gap-5 uppercase tracking-[0.24em]">
                  {PAGES.map((page, position) => {
                    const current = position + 1 === index
                    return (
                      <li key={page.href}>
                        <Link
                          href={page.href}
                          aria-current={current ? 'page' : undefined}
                          className={`inline-flex items-center gap-2 transition-colors duration-300 ${
                            current ? 'text-marfim' : 'text-marfim/45 hover:text-marfim/85'
                          }`}
                        >
                          {current ? (
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
                          ) : null}
                          {page.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            ) : null}
          </div>
          <div>
            {eyebrow ? (
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-marfim/70">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
                {eyebrow}
              </p>
            ) : null}
            <h1 className="hero-title mt-4 font-display text-[min(8.8vw,2.3rem)] uppercase leading-[0.95] text-marfim sm:text-5xl">
              {title}
            </h1>
            {/* Hairline that fills up to this page's place among the five. */}
            <div aria-hidden="true" className="relative mt-6 h-px w-full bg-marfim/15">
              {progress ? (
                <>
                  <span className="absolute inset-y-0 left-0 bg-marfim/60" style={{ width: `${progress}%` }} />
                  <span
                    className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c97a8c]"
                    style={{ left: `${progress}%` }}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative isolate h-[520px] overflow-hidden bg-stone-950 sm:h-[640px]">
      <img
        src={imageUrl}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="hero-image absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="hero-veil absolute inset-0" />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-14">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.5em] text-marfim/70">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 hero-title font-display text-4xl uppercase text-marfim sm:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  )
}
