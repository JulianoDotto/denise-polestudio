type HomeHeroProps = {
  imageUrl: string
  headline: string
  className?: string
}

export default function HomeHero({ imageUrl, headline, className }: HomeHeroProps) {
  return (
    <section
      className={`relative isolate h-[520px] overflow-hidden bg-black sm:h-[640px] ${className ?? ''}`.trim()}
    >
      <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl items-end px-6 pb-12">
        <h1 className="font-display text-3xl uppercase tracking-[0.35em] leading-tight text-white sm:text-4xl">
          {headline}
        </h1>
      </div>
    </section>
  )
}
