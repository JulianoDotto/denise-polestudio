type HomeHeroProps = {
  imageUrl: string
  headline: string
  eyebrow: string
}

export default function HomeHero({ imageUrl, headline, eyebrow }: HomeHeroProps) {
  return (
    <section className="relative isolate h-[520px] overflow-hidden bg-stone-950 sm:h-[640px]">
      <img
        src={imageUrl}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="hero-image absolute inset-0 h-full w-full object-cover object-[center_15%]"
      />
      <div className="hero-veil absolute inset-0" />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-6 pb-12">
        <p className="text-xs uppercase tracking-[0.5em] text-marfim/70">{eyebrow}</p>
        <h1 className="mt-3 hero-title font-display text-2xl uppercase leading-tight text-marfim sm:text-4xl">
          {headline}
        </h1>
      </div>
    </section>
  )
}
