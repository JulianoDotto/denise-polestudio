type HomeIntroProps = {
  eyebrow: string
  title: string
  text: string
  additionalText?: string
  imageUrl: string
  imageSrcSet: string
  imageAlt: string
}

export default function HomeIntro({
  eyebrow,
  title,
  text,
  additionalText,
  imageUrl,
  imageSrcSet,
  imageAlt,
}: HomeIntroProps) {
  return (
    <section className="mx-3 mt-3 rounded-[28px] bg-areia">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-14 sm:grid-cols-[0.9fr_1.1fr] sm:items-center sm:gap-10">
        <div className="overflow-hidden rounded-[28px] [clip-path:inset(0_round_28px)]">
          <img
            src={imageUrl}
            srcSet={imageSrcSet}
            // Full width minus the card's margins and padding on phones; the narrower grid column from sm up.
            sizes="(min-width: 640px) 300px, calc(100vw - 72px)"
            alt={imageAlt}
            width={800}
            height={1000}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover object-[42%_50%]"
          />
        </div>
        <div>
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-vinho/70">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
            {eyebrow}
          </p>
          <h2 className="mt-5 font-display text-[2.1rem] leading-[1.08] tracking-[0.005em] text-vinho sm:text-5xl">
            {title}
          </h2>
          <div aria-hidden="true" className="mt-6 h-px w-12 bg-vinho/30" />
          <p className="mt-6 text-base leading-relaxed text-zinc-700">{text}</p>
          {additionalText ? (
            <p className="mt-4 text-base leading-relaxed text-zinc-700">{additionalText}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
