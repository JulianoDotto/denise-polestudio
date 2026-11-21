type PageIntroProps = {
  eyebrow: string
  headline: string
  paragraphs: string[]
  children?: React.ReactNode
}

// Editorial opening shared by the inner pages: label, headline, hairline and text.
export default function PageIntro({ eyebrow, headline, paragraphs, children }: PageIntroProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-4">
      <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-vinho/70">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#c97a8c]" />
        {eyebrow}
      </p>
      <h2 className="mt-5 font-display text-3xl uppercase leading-tight tracking-[0.12em] text-vinho sm:text-4xl">
        {headline}
      </h2>
      <div aria-hidden="true" className="mt-6 h-px w-12 bg-vinho/30" />
      {paragraphs.map((text) => (
        <p key={text} className="mt-6 max-w-xl text-base leading-relaxed text-zinc-700">
          {text}
        </p>
      ))}
      {children}
    </section>
  )
}
