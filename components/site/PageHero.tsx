type PageHeroProps = {
  title: string
  eyebrow?: string
  // Without a photo the hero is set in type on the wine ground.
  imageUrl?: string
  imagePosition?: React.CSSProperties['objectPosition']
}

export default function PageHero({ imageUrl, title, eyebrow, imagePosition }: PageHeroProps) {
  const content = (
    <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-14">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.5em] text-marfim/70">{eyebrow}</p>
      ) : null}
      <h1 className="mt-3 hero-title font-display text-4xl uppercase text-marfim sm:text-5xl">
        {title}
      </h1>
    </div>
  )

  if (!imageUrl) {
    return (
      <section className="relative isolate h-[360px] overflow-hidden bg-[linear-gradient(160deg,#6e2235_0%,#5a1a2a_45%,#24090f_100%)] sm:h-[440px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-8 select-none whitespace-nowrap font-display text-[7rem] uppercase leading-none text-marfim/[0.06] sm:text-[10rem]"
        >
          {title}
        </span>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-marfim/15" />
        {content}
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
      {content}
    </section>
  )
}
