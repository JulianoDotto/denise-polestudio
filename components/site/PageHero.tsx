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

// The studio name set large in outline, as a watermark behind the type hero.
function NameMark() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[22%] select-none @container sm:top-[18%]">
      <p className="mx-auto max-w-5xl whitespace-nowrap px-4 font-display text-[min(10.2cqw,6rem)] uppercase leading-none tracking-[0.06em] text-transparent [-webkit-text-stroke:1px_rgba(243,236,226,0.2)]">
        Denise Garcia
      </p>
    </div>
  )
}

export default function PageHero({ imageUrl, title, eyebrow, index, total, imagePosition }: PageHeroProps) {
  if (!imageUrl) {
    return (
      <section className="relative isolate h-[420px] overflow-hidden bg-[linear-gradient(165deg,#6e2235_0%,#5a1a2a_40%,#2a0b13_100%)] text-marfim sm:h-[480px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-marfim/[0.06] blur-3xl"
        />
        <NameMark />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-between px-4 pb-10 pt-10">
          {index && total ? (
            <p aria-hidden="true" className="flex items-center gap-3 text-[11px] tracking-[0.32em] text-marfim/60">
              <span>{pad(index)}</span>
              <span className="h-px w-10 bg-marfim/30" />
              <span>{pad(total)}</span>
            </p>
          ) : (
            <span />
          )}
          <div>
            {eyebrow ? (
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-marfim/70">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
                {eyebrow}
              </p>
            ) : null}
            <h1 className="hero-title mt-4 font-display text-[2.6rem] uppercase leading-[0.95] text-marfim sm:text-7xl">
              {title}
            </h1>
            <div aria-hidden="true" className="mt-8 h-px w-full bg-marfim/15" />
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
